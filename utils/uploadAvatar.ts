import supabase from "@/lib/supabase/client";

export default async function uploadAvatar(file: File, user: { id: string }) {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}.${ext}`;

  const filePath = `${user.id}/${fileName}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

  return data.publicUrl;
}
