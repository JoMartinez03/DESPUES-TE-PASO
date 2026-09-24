"use server"

import { put, del } from "@vercel/blob"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  avatarValidationError,
  extensionFor,
  type AllowedAvatarType,
} from "@/lib/avatar"
import { updateNicknameSchema } from "@/lib/validations/profile"

export type ProfileActionResult =
  | { ok: true }
  | { ok: false; error: string }

export async function updateNickname(input: {
  name: string
}): Promise<ProfileActionResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { ok: false, error: "No hay sesión activa." }
  }

  const parsed = updateNicknameSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Apodo inválido.",
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name },
  })

  revalidatePath("/", "layout")
  return { ok: true }
}

export async function updateAvatar(
  formData: FormData,
): Promise<ProfileActionResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { ok: false, error: "No hay sesión activa." }
  }

  const file = formData.get("file")
  if (!(file instanceof File)) {
    return { ok: false, error: "No se recibió ningún archivo." }
  }

  const buffer = new Uint8Array(await file.arrayBuffer())
  const validationError = avatarValidationError(file, buffer)
  if (validationError) return { ok: false, error: validationError }

  const type = file.type as AllowedAvatarType

  const current = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { avatar: true },
  })

  let uploaded: { url: string }
  try {
    uploaded = await put(
      `avatars/${crypto.randomUUID()}.${extensionFor(type)}`,
      Buffer.from(buffer),
      { access: "public", contentType: type, addRandomSuffix: true },
    )
  } catch (error) {
    console.error("updateAvatar: put failed", error)
    return { ok: false, error: "No pudimos subir la imagen. Intentá de nuevo." }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { avatar: uploaded.url },
  })

  if (current?.avatar && current.avatar !== uploaded.url) {
    try {
      await del(current.avatar)
    } catch (error) {
      console.error(
        "updateAvatar: no se pudo eliminar la imagen anterior",
        error,
      )
    }
  }

  revalidatePath("/", "layout")
  return { ok: true }
}

export async function removeAvatar(): Promise<ProfileActionResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { ok: false, error: "No hay sesión activa." }
  }

  const current = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { avatar: true },
  })

  if (current?.avatar) {
    try {
      await del(current.avatar)
    } catch (error) {
      console.error(
        "removeAvatar: no se pudo eliminar la imagen remota",
        error,
      )
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { avatar: null },
  })

  revalidatePath("/", "layout")
  return { ok: true }
}