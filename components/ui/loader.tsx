import { cn } from "@/lib/utils"

interface LoaderProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

const sizeStyles = {
  sm: "w-8",
  md: "w-12", 
  lg: "w-16"
}

export function Loader({ className, size = "md" }: LoaderProps) {
  return (
    <div 
      className={cn(
        "loader",
        sizeStyles[size],
        className
      )}
      style={{
        aspectRatio: "4",
        background: `
          radial-gradient(circle closest-side at left 6px top 50%, var(--foreground) 90%, transparent),
          radial-gradient(circle closest-side, var(--foreground) 90%, transparent),
          radial-gradient(circle closest-side at right 6px top 50%, var(--foreground) 90%, transparent)
        `,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        animation: "l4 1s infinite alternate"
      }}
    />
  )
}

// Add the keyframes to your global CSS or use a style tag
export const LoaderStyles = `
@keyframes l4 {
  to {
    width: 25px;
    aspect-ratio: 1;
  }
}
`
