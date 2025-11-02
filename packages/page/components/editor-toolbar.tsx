"use client"

import type { EditorView } from "prosemirror-view"
import { toggleMark, setBlockType } from "prosemirror-commands"
import { cn } from "@/lib/utils"

interface EditorToolbarProps {
  view: EditorView | null
  showHeadings?: boolean
  showMarks?: boolean
  showLists?: boolean
}

export function EditorToolbar({ view, showHeadings = true, showMarks = true, showLists = false }: EditorToolbarProps) {
  if (!view) return null

  const { state } = view

  const applyToggleMark = (markName: string) => {
    const mark = state.schema.marks[markName]
    if (!mark) return

    const command = toggleMark(mark)
    command(state, view.dispatch)
    view.focus()
  }

  const applySetBlockType = (nodeType: string, attrs: Record<string, any> = {}) => {
    const node = state.schema.nodes[nodeType]
    if (!node) return

    const command = setBlockType(node, attrs)
    command(state, view.dispatch)
    view.focus()
  }

  return (
    <div className="flex flex-wrap gap-2 p-3 border-b border-border bg-background">
      {/* Heading Controls */}
      {showHeadings && (
        <>
          {["paragraph", "heading"].map((type) =>
            type === "paragraph" ? (
              <button
                key="paragraph"
                onClick={() => applySetBlockType("paragraph")}
                title="Paragraph"
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded transition-colors",
                  "bg-muted hover:bg-muted-foreground/20",
                )}
              >
                P
              </button>
            ) : (
              ["1", "2", "3"].map((level) => (
                <button
                  key={`h${level}`}
                  onClick={() => applySetBlockType("heading", { level: Number.parseInt(level) })}
                  title={`Heading ${level}`}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded transition-colors",
                    "bg-muted hover:bg-muted-foreground/20",
                  )}
                >
                  H{level}
                </button>
              ))
            ),
          )}
        </>
      )}

      {/* Separator */}
      {showHeadings && showMarks && <div className="w-px bg-border mx-1" />}

      {/* Text Mark Controls */}
      {showMarks && (
        <>
          {["bold", "italic", "strike", "code"].map((mark) => (
            <button
              key={mark}
              onClick={() => applyToggleMark(mark)}
              title={`${mark.charAt(0).toUpperCase() + mark.slice(1)}`}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded transition-colors capitalize",
                "bg-muted hover:bg-muted-foreground/20",
              )}
            >
              {mark === "bold" ? "B" : mark === "italic" ? "I" : mark === "strike" ? "S" : "<>"}
            </button>
          ))}
        </>
      )}

      {/* Separator */}
      {showMarks && showLists && <div className="w-px bg-border mx-1" />}

      {/* List Controls - Placeholder for future implementation */}
      {showLists && (
        <button
          disabled
          className={cn(
            "px-3 py-1 text-xs font-medium rounded transition-colors",
            "bg-muted hover:bg-muted-foreground/20 opacity-50 cursor-not-allowed",
          )}
        >
          Lists
        </button>
      )}
    </div>
  )
}
