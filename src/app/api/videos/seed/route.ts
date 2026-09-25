import { NextResponse } from "next/server";
import { getMinioClient, MINIO_BUCKET, ensureBucket, checkMinioHealth } from "@/lib/minio";
import { INITIAL_VIDEOS } from "@/data/videos";

export async function POST() {
  const health = await checkMinioHealth();
  if (!health.connected) {
    return NextResponse.json(
      { error: `MinIO is offline at ${health.endpoint}:${health.port}. Please start MinIO first.` },
      { status: 503 }
    );
  }

  const client = getMinioClient();
  await ensureBucket();

  let uploadedCount = 0;

  for (const video of INITIAL_VIDEOS) {
    const metaObjectName = `videos/${video.id}/metadata.json`;
    const metaBuffer = Buffer.from(JSON.stringify(video, null, 2), "utf-8");

    await client.putObject(MINIO_BUCKET, metaObjectName, metaBuffer, metaBuffer.length, {
      "Content-Type": "application/json",
    });
    uploadedCount++;
  }

  return NextResponse.json({
    success: true,
    message: `Successfully seeded ${uploadedCount} enterprise sessions into MinIO bucket "${MINIO_BUCKET}"`,
    bucket: MINIO_BUCKET,
    count: uploadedCount,
  });
}
