'use client'

import { IMAGE_SPEC } from '@pm-ext/image'
import { assertValue, unreachable } from '@pm-ext/utils'
import type { EditorView } from 'prosemirror-view'
import React from 'react'
import { ProsemirrorEditor } from '../../../../../components/pm'
import { PMEditorExampleLayout } from '../../../../../components/pm/pmEditorExampleLayout'

function ImagePMEditor() {
	const [, forceUpdate] = React.useReducer((x: number) => x * -1, 1)
	const [view, setView] = React.useState<EditorView | undefined>()

	const IMAGE_SRC = 'https://picsum.photos/200/300'
	const initHtml = `<p>Here is an image: <img src="${IMAGE_SRC}" alt="Example Image" /></p>`

	return (
		<>
			<div />
			<ProsemirrorEditor
				nodes={{
					image: IMAGE_SPEC,
				}}
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
