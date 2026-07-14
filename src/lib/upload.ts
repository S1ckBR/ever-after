import { supabase } from "./supabase";

export async function uploadPresenteImagem(file: File): Promise<string | null> {
  try {
    // Cria um nome único para o arquivo para evitar substituições acidentais
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
    const filePath = `presentes/${fileName}`;

    // Faz o upload para o bucket 'fotos-casamento'
    const { error: uploadError } = await supabase.storage
      .from("fotos-casamento")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Pega a URL pública da imagem que acabamos de subir
    const { data } = supabase.storage
      .from("fotos-casamento")
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    return null;
  }
}