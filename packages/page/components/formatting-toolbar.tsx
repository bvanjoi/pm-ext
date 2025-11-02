'use client'

import { setBlockType, toggleMark } from 'prosemirror-commands'
import type { EditorView } from 'prosemirror-view'
import { cn } from '@/lib/utils'

interface FormattingToolbarProps {
	view: EditorView | null
}

export function FormattingToolbar({ view }: FormattingToolbarProps) {
	if (!view) return null

	const { state } = view

	const applyToggleMark = (markName: string) => {
		const mark = state.schema.marks[markName]
		if (!mark) return

		const command = toggleMark(mark)
		command(state, view.dispatch)
		view.focus()
	}

	const applySetBlockType = (
		nodeType: string,
		attrs: Record<string, any> = {},
	) => {
		const node = state.schema.nodes[nodeType]
		if (!node) return

		const command = setBlockType(node, attrs)
		command(state, view.dispatch)
		view.focus()
	}

	return (
		<>
			{['h1', 'h2', 'h3', 'paragraph'].map(type => (
				<button
					key={type}
					onClick={() =>
						applySetBlockType(type === 'paragraph' ? 'paragraph' : 'heading', {
							level:
								type === 'paragraph'
									? undefined
									: Number.parseInt(type.slice(1)),
						})
					}
					className={cn(
						'px-3 py-1 text-xs font-medium rounded transition-colors',
						'bg-muted hover:bg-muted-foreground/20',
					)}
				>
					{type.toUpperCase()}
				</button>
			))}

			<div className="w-px bg-border mx-1" />

			{['bold', 'italic', 'strike', 'code'].map(mark => (
				<button
					key={mark}
					onClick={() => applyToggleMark(mark)}
					className={cn(
						'px-3 py-1 text-xs font-medium rounded transition-colors capitalize',
						'bg-muted hover:bg-muted-foreground/20',
					)}
				>
					{mark}
				</button>
			))}
		</>
	)
}
