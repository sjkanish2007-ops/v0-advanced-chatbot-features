"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  settings: {
    model: string
    temperature: number
    maxTokens: number
  }
  onSave: (settings: {
    model: string
    temperature: number
    maxTokens: number
  }) => void
}

export function SettingsModal({ isOpen, onClose, settings, onSave }: SettingsModalProps) {
  const [formSettings, setFormSettings] = useState(settings)

  if (!isOpen) return null

  const handleSave = () => {
    onSave(formSettings)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Model</label>
            <select
              value={formSettings.model}
              onChange={(e) => setFormSettings({ ...formSettings, model: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2"
            >
              <option value="kanish-mini">Kanish Mini</option>
              <option value="llama2">Llama 2</option>
              <option value="neural-chat">Neural Chat</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Temperature: {formSettings.temperature.toFixed(2)}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={formSettings.temperature}
              onChange={(e) =>
                setFormSettings({
                  ...formSettings,
                  temperature: Number.parseFloat(e.target.value),
                })
              }
              className="w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>Precise</span>
              <span>Balanced</span>
              <span>Creative</span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Max Response Length</label>
            <select
              value={formSettings.maxTokens}
              onChange={(e) =>
                setFormSettings({
                  ...formSettings,
                  maxTokens: Number.parseInt(e.target.value),
                })
              }
              className="w-full rounded-md border border-border bg-background px-3 py-2"
            >
              <option value="512">Short</option>
              <option value="1024">Medium</option>
              <option value="2048">Long</option>
              <option value="4096">Very Long</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
