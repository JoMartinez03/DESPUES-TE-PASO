import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function UserAvatar({
  name,
  avatar,
  size = "default",
  className,
}: {
  name: string
  avatar?: string | null
  size?: "default" | "sm" | "lg"
  className?: string
}) {
  return (
    <Avatar size={size} className={cn("bg-primary/10", className)}>
      {avatar ? <AvatarImage src={avatar} alt={name} /> : null}
      <AvatarFallback className="font-semibold text-primary">
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  )
}