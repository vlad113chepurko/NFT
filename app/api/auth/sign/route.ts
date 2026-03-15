import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import globalErrorHandler from "@/middleware/error-handler";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { data: signInData, error: signInError } = await supabase.auth.signUp(
      { email, password },
    );

    if (signInError?.code === "invalid_credentials") {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({ email, password });

      if (signUpError) {
        return NextResponse.json(
          { error: signUpError.message },
          { status: 400 },
        );
      }

      return NextResponse.json(
        { session: signUpData.session, user: signUpData.user },
        { status: 201 },
      );
    }

    if (signInError) {
      return NextResponse.json({ error: signInError.message }, { status: 401 });
    }

    return NextResponse.json({
      session: signInData.session,
      user: signInData.user,
    });
  } catch (error: any) {
    return globalErrorHandler(error);
  }
}
