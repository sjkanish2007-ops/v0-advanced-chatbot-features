"use client"

import { useEffect, useRef } from "react"
import { marked } from "marked"

interface MarkdownContentProps {
  content: string
}

// Simple syntax highlighting without external dependencies
const highlightCode = (code: string, language: string): string => {
  // Basic keyword highlighting for common languages
  const keywords: { [key: string]: string[] } = {
    javascript: [
      "function",
      "const",
      "let",
      "var",
      "return",
      "if",
      "else",
      "for",
      "while",
      "class",
      "import",
      "export",
    ],
    typescript: [
      "function",
      "const",
      "let",
      "var",
      "return",
      "if",
      "else",
      "for",
      "while",
      "class",
      "interface",
      "type",
      "import",
      "export",
    ],
    python: ["def", "return", "if", "else", "for", "while", "class", "import", "from", "as", "try", "except"],
    jsx: ["function", "const", "let", "return", "if", "else", "import", "export", "useState", "useEffect"],
    tsx: ["function", "const", "let", "return", "if", "else", "import", "export", "useState", "useEffect", "interface"],
  }

  let highlighted = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")

  // Highlight strings
  highlighted = highlighted.replace(/("(?:\\.|[^"\\])*")/g, '<span class="text-green-400">$1</span>')
  highlighted = highlighted.replace(/('(?:\\.|[^'\\])*')/g, '<span class="text-green-400">$1</span>')

  // Highlight comments
  highlighted = highlighted.replace(/(\/\/.*?)$/gm, '<span class="text-gray-500">$1</span>')
  highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500">$1</span>')

  // Highlight keywords
  const keywordList = keywords[language] || []
  keywordList.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "g")
    highlighted = highlighted.replace(regex, `<span class="text-blue-400 font-semibold">${keyword}</span>`)
  })

  // Highlight numbers
  highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>')

  return highlighted
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      const renderer = {
        code: (args: { text: string; lang: string | undefined; raw: string }) => {
          const language = args.lang || "code"
          const highlighted = highlightCode(args.text, language)

          return `
            <div class="my-4 rounded-lg overflow-hidden bg-slate-900">
              <div class="flex items-center justify-between bg-slate-800 px-4 py-2 text-sm">
                <span class="text-slate-400 font-mono font-semibold">${language.toUpperCase()}</span>
                <button class="copy-btn flex items-center gap-2 text-slate-300 hover:text-white px-2 py-1 rounded text-xs bg-slate-700 hover:bg-slate-600 transition-colors">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 011 1v1h2V4a2 2 0 00-2-2h-2a2 2 0 00-2 2v1H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2h-2V3z"></path>
                  </svg>
                  <span>Copy</span>
                </button>
              </div>
              <pre class="p-4 overflow-x-auto"><code class="text-slate-100 text-sm leading-relaxed font-mono">${highlighted}</code></pre>
            </div>
          `
        },
        heading: (args: { text: string; depth: number }) => {
          const sizes = ["text-3xl", "text-2xl", "text-xl", "text-lg", "text-base", "text-sm"]
          return `<h${args.depth} class="${sizes[args.depth - 1]} font-bold my-4 text-slate-100">${args.text}</h${args.depth}>`
        },
        paragraph: (args: { text: string }) => {
          return `<p class="my-3 text-slate-300 leading-relaxed">${args.text}</p>`
        },
        list: (args: { items: string[]; ordered: boolean }) => {
          const tag = args.ordered ? "ol" : "ul"
          const className = args.ordered ? "list-decimal" : "list-disc"
          return `<${tag} class="${className} list-inside my-3 space-y-1 text-slate-300"><li>${args.items.join("</li><li>")}</li></${tag}>`
        },
        strong: (args: { text: string }) => {
          return `<strong class="font-bold text-slate-100">${args.text}</strong>`
        },
        em: (args: { text: string }) => {
          return `<em class="italic text-slate-300">${args.text}</em>`
        },
        codespan: (args: { text: string }) => {
          return `<code class="bg-slate-800 text-orange-400 px-2 py-1 rounded font-mono text-sm">${args.text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code>`
        },
        blockquote: (args: { text: string }) => {
          return `<blockquote class="border-l-4 border-slate-500 pl-4 my-3 text-slate-400 italic">${args.text}</blockquote>`
        },
        link: (args: { href: string; title: string | null; text: string }) => {
          return `<a href="${args.href}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">${args.text}</a>`
        },
      }

      marked.use({ renderer })

      // Parse markdown
      const html = marked.parse(content)
      containerRef.current.innerHTML = html as string

      // Add event listeners to copy buttons
      containerRef.current.querySelectorAll(".copy-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
          const codeBlock = (e.currentTarget as HTMLElement).closest(".rounded-lg")?.querySelector("code")
          if (codeBlock) {
            const text = codeBlock.textContent || ""
            navigator.clipboard.writeText(text).then(() => {
              const btn = e.currentTarget as HTMLButtonElement
              const originalText = btn.innerHTML
              btn.innerHTML =
                '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path></svg><span>Copied</span>'
              setTimeout(() => {
                btn.innerHTML = originalText
              }, 2000)
            })
          }
        })
      })
    }
  }, [content])

  return <div ref={containerRef} className="space-y-2" />
}
