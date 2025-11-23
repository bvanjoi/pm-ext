'use client'

import {
	addLinkMark,
	getLinkMark,
	insertTextWithLinkMark,
	LINK_PLUGIN_SPEC,
	LINK_SPEC,
} from '@pm-ext/link'
import { ProseMirrorProvider, useProseMirror } from '@pm-ext/react'
import { assertValue, unreachable } from '@pm-ext/utils'
import Link from 'next/link'
import { Plugin } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import React from 'react'
import { useTranslation } from 'react-i18next'
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
			return (
				<LinkPopover
					mode="editHref"
					href={linkPopoverMode.href}
					onConfirm={onConfirm}
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
	const { t, i18n } = useTranslation()
	const locale = i18n.language

	return (
		<React.StrictMode>
			<div className="w-full">
				<div className="border-b border-border">
					<div className="max-w-5xl mx-auto px-6 py-12">
						<div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
							<Link href="/docs/examples">Examples</Link>
							<span>/</span>
							<Link href="/docs/basics">Basics</Link>
						</div>
						<h1 className="text-5xl font-bold mb-4 text-foreground">Links</h1>
						<p className="text-lg text-muted-foreground max-w-2xl">
							Add hyperlinks to your content with Prosemirror. This example
							shows how to add, edit, and remove links in your editor.
						</p>
					</div>
				</div>

				<div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
					<div className="space-y-4">
						<div className="border border-border rounded-lg overflow-hidden bg-card">
							<LinkPMEditor />
						</div>
					</div>
				</div>

				<div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
					<div className="grid grid-cols-2 gap-4 pt-8 border-t border-border">
						<Link
							href={`/${locale}/docs/basics/lists`}
							className="group flex flex-col gap-2 p-4 border border-border rounded-lg hover:border-primary hover:bg-muted transition-colors"
						>
							<span className="text-sm text-muted-foreground group-hover:text-foreground">
								← {t('common.previously')}
							</span>
							<span className="font-medium text-foreground">
								{t('navigation.lists')}
							</span>
						</Link>
						<Link
							href={`/${locale}/docs/basics/images`}
							className="group flex flex-col gap-2 p-4 border border-border rounded-lg hover:border-primary hover:bg-muted transition-colors text-right"
						>
							<span className="text-sm text-muted-foreground group-hover:text-foreground">
								{t('common.nextUp')} →
							</span>
							<span className="font-medium text-foreground">
								{t('navigation.images')}
							</span>
						</Link>
					</div>
				</div>
			</div>
		</React.StrictMode>
	)
}
