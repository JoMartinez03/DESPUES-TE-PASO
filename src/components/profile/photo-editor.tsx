"use client"

import { useState } from "react"
import Cropper from "react-easy-crop"
import { Loader2, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  AVATAR_CROP_MAX_ZOOM,
  AVATAR_CROP_MIN_ZOOM,
} from "@/lib/avatar"
import {
  centeredSquareArea,
  type CropArea,
  type CropSize,
} from "@/lib/avatar-crop"

const ZOOM_STEP = 0.2

/**
 * Encuadre del avatar. El círculo que dibuja el cropper ES el avatar final:
 * lo que queda adentro es exactamente lo que se guarda en el archivo.
 */
export function PhotoEditor({
  imageUrl,
  onCancel,
  onConfirm,
  busy = false,
}: {
  imageUrl: string
  onCancel: () => void
  onConfirm: (area: CropArea, natural: CropSize) => void
  busy?: boolean
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(AVATAR_CROP_MIN_ZOOM)
  const [natural, setNatural] = useState<CropSize | null>(null)
  const [area, setArea] = useState<CropArea | null>(null)
  const [mediaFailed, setMediaFailed] = useState(false)

  const ready = natural !== null

  function handleZoomChange(value: number) {
    setZoom(
      Math.min(AVATAR_CROP_MAX_ZOOM, Math.max(AVATAR_CROP_MIN_ZOOM, value)),
    )
  }

  function handleConfirm() {
    if (!natural) return
    onConfirm(
      area ?? centeredSquareArea(natural.width, natural.height),
      natural,
    )
  }

  return (
    <Sheet
      open
      onOpenChange={(next) => {
        // El recorte ya está en marcha: cerrar acá dejaría una subida sin
        // haber confirmado nada visible.
        if (!next && !busy) onCancel()
      }}
    >
      <SheetContent
        side="bottom"
        className="gap-4 rounded-t-2xl p-5 sm:mx-auto sm:max-w-md"
      >
        <SheetHeader className="p-0">
          <SheetTitle>Acomodá tu foto</SheetTitle>
          <SheetDescription>
            {mediaFailed
              ? "No pudimos mostrar esa foto. Probá con otra."
              : "Arrastrá, pellizcá o hacé scroll para acomodar. Sólo se ve el círculo."}
          </SheetDescription>
        </SheetHeader>

        <div className="relative mx-auto aspect-square w-full">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            minZoom={AVATAR_CROP_MIN_ZOOM}
            maxZoom={AVATAR_CROP_MAX_ZOOM}
            // minZoom 1 + restrictPosition son lo que impide que la imagen
            // quede más chica que el círculo y dejen huecos.
            cropShape="round"
            showGrid={false}
            restrictPosition
            zoomSpeed={0.5}
            zoomWithScroll
            // `onError` va por `mediaProps`: la librería no expone un `onMediaError`.
            mediaProps={{
              alt: "Foto a recortar",
              onError: () => setMediaFailed(true),
            }}
            onCropChange={setCrop}
            onZoomChange={handleZoomChange}
            onMediaLoaded={(media) =>
              setNatural({
                width: media.naturalWidth,
                height: media.naturalHeight,
              })
            }
            onCropComplete={(_percentages, pixels) => setArea(pixels)}
          />
        </div>

        {mediaFailed ? null : (
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              aria-label="Alejar"
              onClick={() => handleZoomChange(zoom - ZOOM_STEP)}
              disabled={busy}
            >
              <Minus />
            </Button>
            <input
              type="range"
              aria-label="Zoom"
              className="h-2 w-full flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary disabled:opacity-50"
              min={AVATAR_CROP_MIN_ZOOM}
              max={AVATAR_CROP_MAX_ZOOM}
              step={0.01}
              value={zoom}
              onChange={(event) => handleZoomChange(Number(event.target.value))}
              disabled={busy}
            />
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              aria-label="Acercar"
              onClick={() => handleZoomChange(zoom + ZOOM_STEP)}
              disabled={busy}
            >
              <Plus />
            </Button>
          </div>
        )}

        <SheetFooter className="flex-row gap-2 p-0">
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            onClick={onCancel}
            disabled={busy}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={handleConfirm}
            disabled={busy || !ready}
          >
            {busy ? <Loader2 className="animate-spin" /> : null}
            Guardar foto
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
