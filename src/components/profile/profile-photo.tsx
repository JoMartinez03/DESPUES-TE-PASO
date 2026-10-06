"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState, useTransition } from "react"
import { Camera, Loader2, Trash2 } from "lucide-react"
import { removeAvatar, updateAvatar } from "@/actions/profile"
import { buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import {
  AVATAR_HEIF_ERROR,
  avatarQuickError,
  isUnsupportedHeif,
} from "@/lib/avatar"
import { cropAvatarFile } from "@/lib/avatar-client"
import type { CropArea, CropSize } from "@/lib/avatar-crop"
import { cn } from "@/lib/utils"

// El editor y el cropper pesan lo suficiente como para no entrar en el bundle de
// /perfil: se cargan recién cuando el usuario elige una foto.
const PhotoEditor = dynamic(
  () =>
    import("@/components/profile/photo-editor").then(
      (module) => module.PhotoEditor,
    ),
  { ssr: false },
)

const UPLOAD_FAILED_ERROR =
  "Falló la subida. Si la foto es muy pesada, probá con una versión más chica."

const PREPARE_FAILED_TITLE = "No se pudo preparar la foto"

export function ProfilePhoto({ hasAvatar }: { hasAvatar: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [editorFile, setEditorFile] = useState<File | null>(null)
  const [editorUrl, setEditorUrl] = useState<string | null>(null)
  const [isCropping, setIsCropping] = useState(false)
  const [isPending, startTransition] = useTransition()
  const busy = isCropping || isPending

  useEffect(() => {
    return () => {
      if (editorUrl) URL.revokeObjectURL(editorUrl)
    }
  }, [editorUrl])

  function closeEditor() {
    setEditorFile(null)
    setEditorUrl(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  function rejectSelection(description: string) {
    toast({ title: "No se pudo elegir la foto", description })
  }

  async function handleSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Vaciar el input antes de cualquier await permite volver a elegir el mismo
    // archivo después de cancelar.
    event.target.value = ""
    if (!file) return

    // Chequeo barato antes de leer bytes o generar el preview.
    const quickError = avatarQuickError(file)
    if (quickError) {
      rejectSelection(quickError)
      return
    }

    // HEIC se detecta por magic bytes: el MIME declarado no es confiable.
    const header = new Uint8Array(await file.slice(0, 16).arrayBuffer())
    if (isUnsupportedHeif(header)) {
      rejectSelection(AVATAR_HEIF_ERROR)
      return
    }

    setEditorFile(file)
    setEditorUrl(URL.createObjectURL(file))
  }

  async function handleConfirm(area: CropArea, natural: CropSize) {
    if (!editorFile) return

    setIsCropping(true)
    try {
      const cropped = await cropAvatarFile(editorFile, area, natural)
      if (!cropped.ok) {
        // El editor sigue abierto: el usuario puede reintentar o cancelar.
        toast({ title: PREPARE_FAILED_TITLE, description: cropped.error })
        return
      }
      closeEditor()
      upload(cropped.file)
    } catch {
      toast({
        title: PREPARE_FAILED_TITLE,
        description: "No pudimos procesar la imagen. Probá con otra foto.",
      })
    } finally {
      setIsCropping(false)
    }
  }

  function upload(file: File) {
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("file", file)
        const result = await updateAvatar(formData)
        if (result.ok) {
          toast({ title: "Foto actualizada" })
        } else {
          toast({
            title: "No se pudo cambiar la foto",
            description: result.error,
          })
        }
      } catch {
        // Cubre 413 de bodySizeLimit, cortes de red y fallos de serialización,
        // que antes dejaban la UI clavada sin ningún mensaje.
        toast({ title: "No se pudo cambiar la foto", description: UPLOAD_FAILED_ERROR })
      }
    })
  }

  function handleRemove() {
    startTransition(async () => {
      try {
        const result = await removeAvatar()
        if (result.ok) {
          toast({ title: "Foto eliminada" })
        } else {
          toast({
            title: "No se pudo eliminar la foto",
            description: result.error,
          })
        }
      } catch {
        toast({
          title: "No se pudo eliminar la foto",
          description: "Intentá de nuevo.",
        })
      }
    })
  }

  return (
    <div className="flex min-h-9 flex-col items-center justify-center gap-2">
      {editorFile && editorUrl ? (
        <PhotoEditor
          imageUrl={editorUrl}
          onCancel={closeEditor}
          onConfirm={handleConfirm}
          busy={isCropping}
        />
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <label
            className={cn(
              buttonVariants({ variant: "outline" }),
              "cursor-pointer",
              busy && "pointer-events-none opacity-60",
            )}
          >
            {busy ? <Loader2 className="animate-spin" /> : <Camera />}
            Cambiar foto
            <input
              ref={inputRef}
              type="file"
              // `image/*` y no la lista de MIME: es lo único que hace aparecer
              // "Tomar foto" en iOS. La validación real (magic bytes +
              // allowlist) vive en el servidor y no depende de este atributo.
              accept="image/*"
              onChange={handleSelect}
              disabled={busy}
              className="sr-only"
            />
          </label>
          {hasAvatar ? (
            <button
              type="button"
              className={cn(buttonVariants({ variant: "ghost" }))}
              onClick={handleRemove}
              disabled={busy}
            >
              {isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}
              Eliminar foto
            </button>
          ) : null}
        </div>
      )}
    </div>
  )
}
