    import { NextResponse } from "next/server";
    import nacl from "tweetnacl";
    import bs58 from "bs58";
    import { supabaseAdmin } from "@/lib/supabase/admin";

    export async function POST(req: Request) {
    try {
        const { wallet, message, signature } = await req.json();
        const isValid = nacl.sign.detached.verify(
        new TextEncoder().encode(message),
        new Uint8Array(signature),
        bs58.decode(wallet),
        );

        if (!isValid) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        const { data: user, error } = await supabaseAdmin
          .from("users")
          .upsert(
            {
              wallet_address: wallet,
              username: "anon",
              avatar: null,
            },
            { onConflict: "wallet_address" },
          )
          .select()
          .single();

        if (error) {
          console.error("SUPABASE ERROR:", error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ user });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
    }
