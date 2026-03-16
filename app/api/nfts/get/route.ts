import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/server";

export async function GET() {
  try {
    const { data, error } = await supabase.from("nfts").select("*");

    console.debug("Data", data);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ nfts: data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
