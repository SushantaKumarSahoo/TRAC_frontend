import * as Minio from "minio";

const endpoint = process.env.MINIO_ENDPOINT || "localhost";
const port = parseInt(process.env.MINIO_PORT || "9000", 10);
const useSSL = process.env.MINIO_USE_SSL === "true";
const accessKey = process.env.MINIO_ACCESS_KEY || "minioadmin";
const secretKey = process.env.MINIO_SECRET_KEY || "minioadmin";

export const MINIO_BUCKET = process.env.MINIO_BUCKET || "csm-videos";

let clientInstance: Minio.Client | null = null;

export function getMinioClient(): Minio.Client {
  if (!clientInstance) {
    clientInstance = new Minio.Client({
      endPoint: endpoint,
      port: port,
      useSSL: useSSL,
      accessKey: accessKey,
      secretKey: secretKey,
    });
  }
  return clientInstance;
}

export async function checkMinioHealth(): Promise<{
  connected: boolean;
  endpoint: string;
  port: number;
  bucket: string;
  error?: string;
}> {
  try {
    const client = getMinioClient();
    // Test connection with a timeout
    const exists = await Promise.race([
      client.bucketExists(MINIO_BUCKET),
      new Promise<boolean>((_, reject) =>
        setTimeout(() => reject(new Error("MinIO connection timed out")), 2500)
      ),
    ]);

    if (!exists) {
      try {
        await client.makeBucket(MINIO_BUCKET);
      } catch (err: any) {
        console.warn("Could not auto-create bucket:", err.message);
      }
    }

    return {
      connected: true,
      endpoint,
      port,
      bucket: MINIO_BUCKET,
    };
  } catch (err: any) {
    return {
      connected: false,
      endpoint,
      port,
      bucket: MINIO_BUCKET,
      error: err.message || "Unable to connect to MinIO",
    };
  }
}

export async function ensureBucket() {
  const client = getMinioClient();
  const exists = await client.bucketExists(MINIO_BUCKET);
  if (!exists) {
    await client.makeBucket(MINIO_BUCKET);
  }
}

export async function getMinioVideos(): Promise<any[]> {
  const client = getMinioClient();
  await ensureBucket();

  const stream = client.listObjects(MINIO_BUCKET, "videos/", true);
  const objects: string[] = [];

  for await (const obj of stream) {
    if (obj.name) {
      objects.push(obj.name);
    }
  }

  // Find unique video IDs
  // Path format: videos/<videoId>/metadata.json or videos/<videoId>/video.mp4
  const videoIds = new Set<string>();
  for (const name of objects) {
    const parts = name.split("/");
    if (parts.length >= 2 && parts[1]) {
      videoIds.add(parts[1]);
    }
  }

  const videos: any[] = [];

  for (const vid of Array.from(videoIds)) {
    const metadataPath = `videos/${vid}/metadata.json`;
    let metadata: any = null;

    if (objects.includes(metadataPath)) {
      try {
        const dataStream = await client.getObject(MINIO_BUCKET, metadataPath);
        const chunks: Buffer[] = [];
        for await (const chunk of dataStream) {
          chunks.push(chunk);
        }
        metadata = JSON.parse(Buffer.concat(chunks).toString("utf-8"));
      } catch (e) {
        console.error(`Failed reading metadata for ${vid}:`, e);
      }
    }

    // Generate presigned URLs for video and thumbnail
    const videoFile = objects.find((o) => o.startsWith(`videos/${vid}/video.`));
    const thumbFile = objects.find((o) => o.startsWith(`videos/${vid}/thumbnail.`));

    let videoUrl = "";
    let thumbnailUrl = "";

    if (videoFile) {
      try {
        videoUrl = await client.presignedGetObject(MINIO_BUCKET, videoFile, 24 * 60 * 60);
      } catch {
        videoUrl = `http://${endpoint}:${port}/${MINIO_BUCKET}/${videoFile}`;
      }
    }

    if (thumbFile) {
      try {
        thumbnailUrl = await client.presignedGetObject(MINIO_BUCKET, thumbFile, 24 * 60 * 60);
      } catch {
        thumbnailUrl = `http://${endpoint}:${port}/${MINIO_BUCKET}/${thumbFile}`;
      }
    }

    if (metadata) {
      videos.push({
        ...metadata,
        id: vid,
        videoUrl: videoUrl || metadata.videoUrl,
        thumbnail: thumbnailUrl || metadata.thumbnail,
      });
    } else if (videoFile) {
      // Basic fallback object if only raw video was uploaded
      videos.push({
        id: vid,
        title: vid.replace(/[-_]/g, " "),
        description: "Video asset stored in MinIO bucket",
        department: "General",
        presenter: {
          name: "MinIO User",
          role: "Presenter",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        },
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        duration: "00:00",
        durationSeconds: 0,
        progressPercent: 0,
        currentSeconds: 0,
        resolution: "HD 1080P",
        thumbnail: thumbnailUrl || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
        videoUrl: videoUrl,
        isFavorite: false,
        views: 1,
        tags: ["MinIO", "Storage"],
        keyTakeaways: [],
        participants: [],
        chapters: [],
        transcript: [],
        resources: [],
      });
    }
  }

  return videos;
}
