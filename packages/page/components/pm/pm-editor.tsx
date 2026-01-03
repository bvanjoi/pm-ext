'use client'

import {
	addLinkMark,
	getLinkMark,
	getLinkMarkType,
	insertTextWithLinkMark,
	LINK_PLUGIN_SPEC,
	LINK_SPEC,
	removeLinkMark
} from '@pm-ext/mark-link'
import {
	getInlineImageNodeType,
	IMAGE_NODE_PLACEHOLDER_PLUGIN_SPEC,
	ImageNodeView,
	INLINE_IMAGE_SPEC,
	insertImageNodeAt
} from '@pm-ext/node-image'
import { subscribeInlinePlaceholder } from '@pm-ext/node-image/view/default-placeholder'
import { ProseMirrorProvider, useProseMirror } from '@pm-ext/react'
import { assertValue, unreachable } from '@pm-ext/utils'
import { Plugin } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import React from 'react'
import { useTranslation } from '@/i18n/hooks'
import { ImagePopover } from '../ui/imagePopover'
import { LinkPopover } from '../ui/linkPopover'
import { ProsemirrorEditor } from '.'
import type { EditorFeatures } from './pm-editor-layout'

interface ProsemirrorEditorProps {
	features: EditorFeatures
}

// function getEnabledFeatureTags(features: EditorFeatures): string[] {
// 	const tags: string[] = []

// 	if (features.image) tags.push('image')
// 	if (features.latex) tags.push('latex')
// 	if (features.code) tags.push('code')
// 	if (features.table) tags.push('table')
// 	if (features.link) tags.push('link')

// 	// 处理嵌套的 list 功能
// 	if (features.list.ordered) tags.push('ordered list')
// 	if (features.list.unordered) tags.push('unordered list')
// 	if (features.list.task) tags.push('task list')

// 	return tags
// }

function Header() {
	return (
		<header className="flex items-center gap-2 px-6 py-3 border-b border-border bg-card/50">
			<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
				<span className="px-2 py-1 rounded bg-muted font-mono">
					Document.md
				</span>
			</div>
			<div className="flex-1" />
		</header>
	)
}

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
			href: linkMark.attrs.originalHref
		}
	}

	return {
		mode: 'editHref',
		href: ''
	}
}

function Menu() {
	const pmView = useProseMirror()
	const { t } = useTranslation()

	const linkPopoverMode = getLinkPopoverMode(pmView)

	const InnerLinkPopover: React.FC = () => {
		if (linkPopoverMode.mode === 'insert') {
			const onConfirm = (href: string, text: string) => {
				assertValue(pmView)
				if (!(href && text)) {
					return
				}
				const pos = pmView.state.selection.from
				const linkMarkType = getLinkMarkType(pmView.state.schema, 'link')
				assertValue(linkMarkType)
				const tr = insertTextWithLinkMark(
					pmView.state.tr,
					linkMarkType,
					pos,
					text,
					href
				)
				pmView.dispatch(tr)
			}
			return <LinkPopover mode="insert" onConfirm={onConfirm} t={t} />
		}

		if (linkPopoverMode.mode === 'editHref') {
			const onConfirm = (href: string) => {
				assertValue(pmView)
				const linkMarkType = getLinkMarkType(pmView.state.schema, 'link')
				assertValue(linkMarkType)
				const tr = addLinkMark(pmView.state.tr, linkMarkType, href)
				pmView.dispatch(tr)
			}
			const onRemove = () => {
				assertValue(pmView)
				const linkMarkType = getLinkMarkType(pmView.state.schema, 'link')
				assertValue(linkMarkType)
				const tr = removeLinkMark(pmView.state.tr, linkMarkType)
				pmView.dispatch(tr)
			}
			return (
				<LinkPopover
					mode="editHref"
					href={linkPopoverMode.href}
					onConfirm={onConfirm}
					onRemove={onRemove}
					t={t}
				/>
			)
		}
	}

	return (
		<div className="border-b border-border bg-background p-3 flex flex-wrap gap-2">
			<InnerLinkPopover />
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
				t={t}
			/>
		</div>
	)
}

export function Editor({ features }: ProsemirrorEditorProps) {
	const [, forceUpdate] = React.useReducer((x: number) => x * -1, 1)
	const [view, setView] = React.useState<EditorView | undefined>()

	const IMAGE_SRC = 'https://picsum.photos/60/90'
	const initHtml = `
<p>Here is a link to <a href="https://www.google.com/">Google</a>.</p>
<p>Here is an inline image: <img src="${IMAGE_SRC}" alt="Example Image" /></p>
`
	return (
		<div className="flex-1 flex flex-col overflow-hidden">
			<Header />
			<div className="flex-1 overflow-auto">
				<div className="max-w-4xl mx-auto px-8 py-10 lg:px-16 lg:py-14">
					<ProseMirrorProvider view={view}>
						<Menu />
					</ProseMirrorProvider>
					<ProsemirrorEditor
						nodes={{
							inlineImage: INLINE_IMAGE_SPEC
						}}
						marks={{
							link: LINK_SPEC
						}}
						nodeViews={{
							inlineImage: ImageNodeView({
								inline: true,
								subscribePlaceholder: (view, getPos, imageDOM) =>
									subscribeInlinePlaceholder(view, getPos, imageDOM)
							})
						}}
						plugins={[
							new Plugin(IMAGE_NODE_PLACEHOLDER_PLUGIN_SPEC),
							new Plugin(LINK_PLUGIN_SPEC)
						]}
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
			</div>
		</div>
	)
}
