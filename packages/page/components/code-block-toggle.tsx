'use client'

import { type ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'
import { CodeBlock } from './code-block'

interface CodeBlockToggleProps {
	react: string
	vue: string
	showLineNumbers?: boolean
	children?: (activeTab: 'react' | 'vue') => ReactNode
}

export function CodeBlockToggle({
	react: reactCode,
	vue: vueCode,
	showLineNumbers = false,
	children,
}: CodeBlockToggleProps) {
	const [activeTab, setActiveTab] = useState<'react' | 'vue'>('react')

	return (
		<div className="space-y-4">
			{/* Toggle Buttons */}
			<div className="flex gap-2">
				<button
					onClick={() => setActiveTab('react')}
					className={cn(
						'px-3 py-1 text-sm font-medium rounded transition-colors',
						activeTab === 'react'
							? 'bg-primary text-primary-foreground'
							: 'bg-muted text-foreground hover:bg-muted hover:opacity-80',
					)}
				>
					React
				</button>
				<button
					onClick={() => setActiveTab('vue')}
					className={cn(
						'px-3 py-1 text-sm font-medium rounded transition-colors',
						activeTab === 'vue'
							? 'bg-primary text-primary-foreground'
							: 'bg-muted text-foreground hover:bg-muted hover:opacity-80',
					)}
				>
					Vue
				</button>
			</div>

			{/* Code Display */}
			{children ? (
				children(activeTab)
			) : (
				<CodeBlock
					language={activeTab === 'react' ? 'typescript' : 'vue'}
					code={activeTab === 'react' ? reactCode : vueCode}
					showLineNumbers={showLineNumbers}
				/>
			)}
		</div>
	)
}
