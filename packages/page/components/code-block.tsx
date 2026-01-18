'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
	language: string
	code: string
	showLineNumbers?: boolean
}

export function CodeBlock({
	language,
	code,
	showLineNumbers = false
}: CodeBlockProps) {
	const [copied, setCopied] = useState(false)

	const copyToClipboard = () => {
		navigator.clipboard.writeText(code)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const lines = code.split('\n')

	return (
		<div className="border border-border rounded-lg overflow-hidden bg-slate-950">
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-slate-900">
				<span className="text-xs font-mono text-slate-400">{language}</span>
				<button
					onClick={copyToClipboard}
					className={cn(
						'text-xs font-medium px-2 py-1 rounded transition-all',
						copied
							? 'bg-green-600 text-white'
							: 'text-slate-400 hover:text-slate-300 hover:bg-slate-800'
					)}
				>
					{copied ? 'Copied!' : 'Copy'}
				</button>
			</div>

			{/* Code Content */}
			<pre className="overflow-x-auto p-4">
				<code className="text-sm font-mono text-slate-300 whitespace-pre">
					{showLineNumbers ? (
						<div className="flex">
							<div className="select-none pr-4 text-right text-slate-600 border-r border-slate-700">
								{lines.map((_, i) => (
									<div key={i}>{i + 1}</div>
								))}
							</div>
							<div className="pl-4">{code}</div>
						</div>
					) : (
						code
					)}
				</code>
			</pre>
		</div>
	)
}
