import { NextResponse } from "next/server";
import { checkMinioHealth } from "@/lib/minio";

export async function GET() {
  const health = await checkMinioHealth();
  return NextResponse.json(health);
}
