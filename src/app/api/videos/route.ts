import { NextRequest, NextResponse } from "next/server";
import { getMinioClient, MINIO_BUCKET, ensureBucket, getMinioVideos, checkMinioHealth } from "@/lib/minio";

export async function GET() {
  const health = await checkMinioHealth();

  if (!health.connected) {
    return NextResponse.json({
      connected: false,
      storage: "minio",
      endpoint: `${health.endpoint}:${health.port}`,
      bucket: health.bucket,
      message: health.error || "MinIO is not reachable",
      videos: [],
    });
  }

  try {
    const videos = await getMinioVideos();
    return NextResponse.json({
      connected: true,
      storage: "minio",
      endpoint: `${health.endpoint}:${health.port}`,
      bucket: health.bucket,
      count: videos.length,
      videos,
    });
  } catch (err: any) {
    return NextResponse.json({
      connected: true,
      storage: "minio",
      endpoint: `${health.endpoint}:${health.port}`,
      bucket: health.bucket,
      error: err.message,
      videos: [],
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const videoFile = formData.get("video") as File | null;
    const thumbnailFile = formData.get("thumbnail") as File | null;
    const title = (formData.get("title") as string) || "Untitled Session";
    const department = (formData.get("department") as string) || "General";
    const presenterName = (formData.get("presenterName") as string) || "Enterprise Presenter";
    const presenterRole = (formData.get("presenterRole") as string) || "Presenter";
    const description = (formData.get("description") as string) || "";
    const tagsRaw = (formData.get("tags") as string) || "";

    if (!videoFile) {
      return NextResponse.json({ error: "No video file provided" }, { status: 400 });
    }

    const health = await checkMinioHealth();
    if (!health.connected) {
      return NextResponse.json(
        { error: `MinIO storage is offline: ${health.error}. Please ensure MinIO is running.` },
        { status: 503 }
      );
    }

    const client = getMinioClient();
    await ensureBucket();

    // Unique Video ID
    const videoId = `vid-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const ext = videoFile.name.split(".").pop() || "mp4";
    const videoObjectName = `videos/${videoId}/video.${ext}`;

    // Upload Video File to MinIO
    const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
    await client.putObject(MINIO_BUCKET, videoObjectName, videoBuffer, videoBuffer.length, {
      "Content-Type": videoFile.type || "video/mp4",
    });

    // Upload Thumbnail File if provided
    let thumbObjectName = "";
    if (thumbnailFile) {
      const thumbExt = thumbnailFile.name.split(".").pop() || "jpg";
      thumbObjectName = `videos/${videoId}/thumbnail.${thumbExt}`;
      const thumbBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
      await client.putObject(MINIO_BUCKET, thumbObjectName, thumbBuffer, thumbBuffer.length, {
        "Content-Type": thumbnailFile.type || "image/jpeg",
      });
    }

    // Build Metadata
    const metadata = {
      id: videoId,
      title,
      description,
      department,
      presenter: {
        name: presenterName,
        role: presenterRole,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      },
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      duration: "00:00",
      durationSeconds: 0,
      progressPercent: 0,
      currentSeconds: 0,
      resolution: "HD 1080P",
      isFavorite: false,
      views: 0,
      tags: tagsRaw ? tagsRaw.split(",").map((t) => t.trim()) : ["MinIO"],
      keyTakeaways: [],
      participants: [
        {
          name: presenterName,
          role: presenterRole,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
          speakingTime: "0m 00s",
          speakingPercent: 100,
        },
      ],
      chapters: [],
      transcript: [],
      resources: [],
    };

    // Store metadata.json in MinIO
    const metaObjectName = `videos/${videoId}/metadata.json`;
    const metaBuffer = Buffer.from(JSON.stringify(metadata, null, 2), "utf-8");
    await client.putObject(MINIO_BUCKET, metaObjectName, metaBuffer, metaBuffer.length, {
      "Content-Type": "application/json",
    });

    return NextResponse.json({
      success: true,
      message: "Video and metadata successfully uploaded to MinIO",
      videoId,
      bucket: MINIO_BUCKET,
    });
  } catch (err: any) {
    console.error("MinIO upload error:", err);
    return NextResponse.json({ error: err.message || "Failed to upload to MinIO" }, { status: 500 });
  }
}
