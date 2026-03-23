import { NextRequest, NextResponse } from "next/server";    

export async function GET() {
  return NextResponse.json({ message: "Hello, world!" });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ message: "Hello, world!" });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ message: "Hello, world!" });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ message: "Hello, world!" });
}

