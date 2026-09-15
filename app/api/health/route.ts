import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const start = Date.now()
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: "ok", db: "up", latency: Date.now() - start, time: new Date().toISOString() })
  } catch (e:any) {
    return NextResponse.json({ status: "error", db: "down", error: e.message }, { status: 500 })
  }
}
