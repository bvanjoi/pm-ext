"use client"

import { type ReactNode, useEffect, useRef, useState } from "react"
import { EditorView } from "prosemirror-view"
import { EditorState } from "prosemirror-state"
import { EditorToolbar } from "./editor-toolbar"
import { cn } from "@/lib/utils"

interface EditorWrapperProps {
  schema: any
  plugins: any[]
  toolbar?: {
    showHeadings?: boolean
    showMarks?: boolean
    showLists?: boolean
  }
  minHeight?: string
  children?: (view: EditorView | null) => ReactNode
}

export function EditorWrapper({
  schema,
  plugins,
  toolbar = { showHeadings: true, showMarks: true },
  minHeight = "min-h-64",
  children,
}: EditorWrapperProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<EditorView | null>(null)

  useEffect(() => {
    if (!editorRef.current) return

    const state = EditorState.create({
      schema,
      plugins,
    })

    const newView = new EditorView(editorRef.current, { state })
    setView(newView)

    return () => {
      newView.destroy()
    }
  }, [schema, plugins])

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <EditorToolbar
        view={view}
        showHeadings={toolbar.showHeadings}
        showMarks={toolbar.showMarks}
        showLists={toolbar.showLists}
      />
      <div
        ref={editorRef}
        className={cn("prose prose-sm dark:prose-invert max-w-none p-6", minHeight, "focus-visible:outline-none")}
      />
      {children?.(view)}
    </div>
  )
}
