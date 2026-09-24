"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Camera, Loader2, Trash2 } from "lucide-react"
import { removeAvatar, updateAvatar } from "@/actions/profile"
import { buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

export function ProfilePhoto({ hasAvatar }: { hasAvatar: boolean }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isPending, startTransition] = useTransition()

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

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current)
      return URL.createObjectURL(file)
    })
  }

  function handleUpload() {
    if (!selectedFile) return
    startTransition(async () => {
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
      cancelSelection()
      router.refresh()
    })
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await removeAvatar()
      if (result.ok) {
        toast({ title: "Foto eliminada" })
      } else {
        toast({
          title: "No se pudo eliminar la foto",
          description: result.error,
        })
      }
      router.refresh()
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
              disabled={isPending}
            >
              {isPending ? <Loader2 className="animate-spin" /> : null}
              Guardar foto
            </button>
            <button
              type="button"
              className={cn(buttonVariants({ variant: "ghost" }))}
              onClick={cancelSelection}
              disabled={isPending}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <label
            className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer")}
          >
            <Camera />
            Cambiar foto
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleSelect}
              className="sr-only"
            />
          </label>
          {hasAvatar ? (
            <button
              type="button"
              className={cn(buttonVariants({ variant: "ghost" }))}
              onClick={handleRemove}
              disabled={isPending}
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