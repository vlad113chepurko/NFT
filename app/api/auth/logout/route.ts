import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const response = NextResponse.json({ success: true });

    response.cookies.set("access_token", "", { maxAge: 0 });
    response.cookies.set("refresh_token", "", { maxAge: 0 });
    response.cookies.set("session", "", { maxAge: 0 });

    return response;
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      error: error.message,
      success: false,
    });
  }
}
