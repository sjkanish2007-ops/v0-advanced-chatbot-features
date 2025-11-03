"use client"

export function WelcomeScreen({
  onPromptClick,
}: {
  onPromptClick?: (prompt: string) => void
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
        K
      </div>
      <h1 className="text-3xl font-bold mb-2">Welcome to Kanish Mini</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Advanced AI chatbot with markdown support, code highlighting, and more.
      </p>
    </div>
  )
}
