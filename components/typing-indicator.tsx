"use client"

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
        K
      </div>
      <div className="flex items-center gap-1 rounded-lg bg-secondary px-4 py-3">
        <span className="text-sm text-secondary-foreground">Thinking</span>
        <div className="flex gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground animate-pulse"></span>
          <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:200ms]"></span>
          <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:400ms]"></span>
        </div>
      </div>
    </div>
  )
}
