import { cn } from "cn"

function Skeleton({
  className,
  // Decorativo por defecto: un placeholder no aporta información al lector de
  // pantalla; el estado de carga lo comunica el `aria-busy` del contenedor.
  "aria-hidden": ariaHidden = true,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden={ariaHidden}
      className={cn(
        "animate-pulse rounded-md bg-muted motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
