'use client'

import {
	getInlineImageNodeType,
	IMAGE_NODE_PLACEHOLDER_PLUGIN_SPEC,
	ImageNodeView,
	INLINE_IMAGE_SPEC,
	insertImageNodeAt
} from '@pm-ext/node-image'
import { ProseMirrorProvider, useProseMirror } from '@pm-ext/react'
import { assertValue, unreachable } from '@pm-ext/utils'
import { Plugin } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import React from 'react'
import { ImagePopover } from '@/components/ui/imagePopover'
import { ProsemirrorEditor } from '../../../../../components/pm'
import { PMEditorExampleLayout } from '../../../../../components/pm/pmEditorExampleLayout'

function Menu() {
	const pmView = useProseMirror()

	return (
		<div className="border-b border-border bg-background p-3 flex flex-wrap gap-2">
			<ImagePopover
				onConfirm={href => {
					assertValue(pmView)
					const inlineImageNodeType = getInlineImageNodeType(
						pmView.state.schema,
						'inlineImage'
					)
					if (inlineImageNodeType) {
						const tr = insertImageNodeAt(
							pmView.state.tr,
							inlineImageNodeType,
							pmView.state.selection.from,
							href
						)
						pmView.dispatch(tr)
					}
				}}
			/>
		</div>
	)
}

function ImagePMEditor() {
	const [, forceUpdate] = React.useReducer((x: number) => x * -1, 1)
	const [view, setView] = React.useState<EditorView | undefined>()

	const IMAGE_SRC = 'https://picsum.photos/200/300'
	const initHtml = `<p>Here is an image: <img src="${IMAGE_SRC}" alt="Example Image" /></p>`

	return (
		<div>
			<ProseMirrorProvider view={view}>
				<Menu />
			</ProseMirrorProvider>
			<ProsemirrorEditor
				nodes={{
					inlineImage: INLINE_IMAGE_SPEC
				}}
				nodeViews={{
					inlineImage: ImageNodeView({ inline: true })
				}}
				plugins={[new Plugin(IMAGE_NODE_PLACEHOLDER_PLUGIN_SPEC)]}
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
		</div>
	)
}

export default function ImageExample() {
	const head = 'Links'
	const description =
		'Add hyperlinks to your content with Prosemirror. This example shows how to add, edit, and remove links in your editor.'

	const next = 'image'
	return (
		<PMEditorExampleLayout
			head={head}
			description={description}
			editorElement={ImagePMEditor}
			next={next}
		/>
	)
}
