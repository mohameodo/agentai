

export function LinkMarkdown({
  href,
  children,
  ...props
}: React.ComponentProps<"a">) {
  if (!href) return <span {...props}>{children}</span>

  // Check if href is a valid URL
  let domain = ""
  try {
    const url = new URL(href)
    domain = url.hostname
  } catch {
    // If href is not a valid URL (likely a relative path)
    domain = href.split("/").pop() || href
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-muted text-muted-foreground hover:bg-muted-foreground/30 hover:text-primary inline-flex h-5 max-w-32 items-center gap-1 overflow-hidden rounded-full py-0 pr-2 pl-0.5 text-xs leading-none overflow-ellipsis whitespace-nowrap no-underline transition-colors duration-150"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-3.5"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
      <span className="overflow-hidden font-normal text-ellipsis whitespace-nowrap">
        {domain ? domain.replace("www.", "") : href}
      </span>
    </a>
  )
}
