"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Camera, Loader2, Trash2 } from "lucide-react"
import { removeAvatar, updateAvatar } from "@/actions/profile"
import { buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import {
  AVATAR_HEIF_ERROR,
  avatarQuickError,
  isUnsupportedHeif,
} from "@/lib/avatar"
import { prepareAvatarFile } from "@/lib/avatar-client"
import { cn } from "@/lib/utils"

const UPLOAD_FAILED_ERROR =
  "Falló la subida. Si la foto es muy pesada, probá con una versión más chica."

export function ProfilePhoto({ hasAvatar }: { hasAvatar: boolean }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isPreparing, setIsPreparing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const busy = isPreparing || isPending

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  function cancelSelection() {
    setSelectedFile(null)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  function rejectSelection(description: string) {
    cancelSelection()
    toast({ title: "No se pudo elegir la foto", description })
  }

  async function handleSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    // Chequeo barato antes de leer bytes o generar preview.
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

    setIsPreparing(true)
    try {
      const prepared = await prepareAvatarFile(file)
      if (!prepared.ok) {
        rejectSelection(prepared.error)
        return
      }
      if (prepared.recompressed) {
        toast({
          title: "Foto optimizada",
          description: "La reduzte para que entre más rápido.",
        })
      }
      setSelectedFile(prepared.file)
      setPreview(URL.createObjectURL(prepared.file))
    } catch {
      rejectSelection("No pudimos procesar la imagen. Probá con otra foto.")
    } finally {
      setIsPreparing(false)
    }
  }

  function handleUpload() {
    if (!selectedFile) return
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("file", selectedFile)
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
      } finally {
        cancelSelection()
        router.refresh()
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
      } finally {
        router.refresh()
      }
    })
  }

  return (
    <div className="flex min-h-9 flex-col items-center justify-center gap-2">
      {preview ? (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- preview local, objectURL no apta para next/image */}
          <img
            src={preview}
            alt="Selección previa"
            className="size-12 rounded-full object-cover ring-2 ring-border"
          />
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              className={cn(buttonVariants({ variant: "default" }))}
              onClick={handleUpload}
              disabled={busy}
            >
              {busy ? <Loader2 className="animate-spin" /> : null}
              Guardar foto
            </button>
            <button
              type="button"
              className={cn(buttonVariants({ variant: "ghost" }))}
              onClick={cancelSelection}
              disabled={busy}
            >
              Cancelar
            </button>
          </div>
        </div>
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
              accept="image/jpeg,image/png,image/webp"
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
