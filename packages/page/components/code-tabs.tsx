"use client"

import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface CodeTab {
  label: string
  language: string
  code: string
}

interface CodeTabsProps {
  tabs: CodeTab[]
  defaultTab?: number
  children?: (code: string, language: string) => ReactNode
}

export function CodeTabs({ tabs, defaultTab = 0, children }: CodeTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const activeCode = tabs[activeTab]

  return (
    <div className="space-y-4">
      {/* Tab Buttons */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={cn(
              "px-3 py-1 text-sm font-medium rounded transition-colors",
              activeTab === index
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-muted hover:opacity-80",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {children ? (
        children(activeCode.code, activeCode.language)
      ) : (
        <div className="border border-border rounded-lg overflow-hidden bg-slate-950">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-slate-900">
            <span className="text-xs font-mono text-slate-400">{activeCode.language}</span>
            <button
              onClick={() => navigator.clipboard.writeText(activeCode.code)}
              className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
            >
              Copy
            </button>
          </div>
          <pre className="overflow-x-auto p-4">
            <code className="text-sm font-mono text-slate-300 whitespace-pre">{activeCode.code}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
