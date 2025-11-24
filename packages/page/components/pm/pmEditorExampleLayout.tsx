'use client'

import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface PMEditorExampleLayoutProps {
	head: string
	description: string
	editorElement: () => React.JSX.Element

	previous?: string
	next?: string
}

export function PMEditorExampleLayout(props: PMEditorExampleLayoutProps) {
	const { i18n, t } = useTranslation()
	const locale = i18n.language
	const { head, description } = props

	function Navigation(
		props:
			| { mode: 'previous'; previous: string }
			| { mode: 'next'; next: string },
	) {
		const { mode } = props
		const text = mode === 'previous' ? props.previous : props.next
		const desc =
			mode === 'previous'
				? `← ${t('common.previously')}`
				: `${t('common.nextUp')} →`
		const isRight = mode === 'next' ? ['text-right', 'col-start-2'] : []
		return (
			<Link
				href={`/${locale}/docs/basics/${text}`}
				className={clsx(
					'group flex flex-col gap-2 p-4 border border-border rounded-lg hover:border-primary hover:bg-muted transition-colors',
					isRight,
				)}
			>
				<span className="text-sm text-muted-foreground group-hover:text-foreground">
					{desc}
				</span>
				<span className="font-medium text-foreground">{text}</span>
			</Link>
		)
	}

	return (
		<React.StrictMode>
			<div className="w-full">
				<div className="border-border">
					<div className="max-w-5xl mx-auto px-6 pt-12">
						<h1 className="text-5xl font-bold mb-4 text-foreground">{head}</h1>
						<p className="text-lg text-muted-foreground max-w-2xl">
							{description}
						</p>
					</div>
				</div>
			</div>

			<div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
				<div className="space-y-4">
					<div className="border border-border rounded-lg overflow-hidden bg-card">
						{props.editorElement()}
					</div>
				</div>
			</div>

			<div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
				<div className="grid grid-cols-2 gap-4 pt-8 border-t border-border">
					{props.previous ? (
						<Navigation mode="previous" previous={props.previous} />
					) : null}
					{props.next ? <Navigation mode="next" next={props.next} /> : null}
				</div>
			</div>
		</React.StrictMode>
	)
}
