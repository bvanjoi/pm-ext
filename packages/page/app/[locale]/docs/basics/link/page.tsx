'use client'

import {
	addLinkMark,
	getLinkMark,
	insertTextWithLinkMark,
	LINK_PLUGIN_SPEC,
	LINK_SPEC,
	removeLinkMark,
} from '@pm-ext/link'
import { ProseMirrorProvider, useProseMirror } from '@pm-ext/react'
import { assertValue, unreachable } from '@pm-ext/utils'
import { Plugin } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import React from 'react'
import { PMEditorExampleLayout } from '@/components/pm/pmEditorExampleLayout'
import { ProsemirrorEditor } from '../../../../../components/pm'
import { LinkPopover } from '../../../../../components/ui/linkPopover'

function getLinkPopoverMode(pmView: EditorView | undefined):
	| {
			mode: 'insert'
	  }
	| {
			mode: 'editHref'
			href: string
	  } {
	if (!pmView) {
		return { mode: 'insert' }
	}
	const selection = pmView.state.selection
	if (selection.empty) {
		return { mode: 'insert' }
	}

	const node = pmView.state.doc.nodeAt(selection.from)
	if (!node) {
		return { mode: 'insert' }
	}

	const linkMark = getLinkMark(node)

	if (linkMark) {
		return {
			mode: 'editHref',
			href: linkMark.attrs.originalHref,
		}
	}

	return {
		mode: 'editHref',
		href: '',
	}
}

function Menu() {
	const pmView = useProseMirror()

	const linkPopoverMode = getLinkPopoverMode(pmView)

	const InnerLinkPopover: React.FC = () => {
		if (linkPopoverMode.mode === 'insert') {
			const onConfirm = (href: string, text: string) => {
				assertValue(pmView)
				if (!(href && text)) {
					return
				}
				const pos = pmView.state.selection.from
				const tr = insertTextWithLinkMark(pmView.state.tr, pos, text, href)
				pmView.dispatch(tr)
			}
			return <LinkPopover mode="insert" onConfirm={onConfirm} />
		}

		if (linkPopoverMode.mode === 'editHref') {
			const onConfirm = (href: string) => {
				assertValue(pmView)
				const tr = addLinkMark(pmView.state.tr, href)
				pmView.dispatch(tr)
			}
			const onRemove = () => {
				assertValue(pmView)
				const tr = removeLinkMark(pmView.state.tr)
				pmView.dispatch(tr)
			}
			return (
				<LinkPopover
					mode="editHref"
					href={linkPopoverMode.href}
					onConfirm={onConfirm}
					onRemove={onRemove}
				/>
			)
		}
	}

	return (
		<div className="border-b border-border bg-background p-3 flex flex-wrap gap-2">
			<InnerLinkPopover />
		</div>
	)
}

function LinkPMEditor() {
	const [, forceUpdate] = React.useReducer((x: number) => x * -1, 1)
	const [view, setView] = React.useState<EditorView | undefined>()

	const initHtml =
		'<p>Here is a link to <a href="https://www.google.com/">Google</a>.</p>'

	return (
		<>
			<ProseMirrorProvider view={view}>
				<Menu />
			</ProseMirrorProvider>
			<ProsemirrorEditor
				marks={{
					link: LINK_SPEC,
				}}
				plugins={[new Plugin(LINK_PLUGIN_SPEC)]}
				initHtml={initHtml}
				view={view}
				onInitView={v => {
					if (!view) {
						setView(() => v)
					} else {
						unreachable()
					}
				}}
				onUpdateView={() => {
					forceUpdate()
				}}
				onDestroyView={() => {
					if (view) {
						assertValue(view.isDestroyed)
						setView(undefined)
					} else {
						unreachable()
					}
				}}
			/>
		</>
	)
}

export default function LinksExample() {
	const head = 'Links'
	const description =
		'Add hyperlinks to your content with Prosemirror. This example shows how to add, edit, and remove links in your editor.'

	const next = 'image'
	return (
		<PMEditorExampleLayout
			head={head}
			description={description}
			editorElement={LinkPMEditor}
			next={next}
		/>
	)
}
