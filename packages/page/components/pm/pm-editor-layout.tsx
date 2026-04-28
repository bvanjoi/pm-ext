'use client'

import { useEffect, useState } from 'react'
import { Editor } from './pm-editor'
import { EditorSidebar } from './sidebar'

export interface EditorFeatures {
	image: boolean
	latex: boolean
	code: boolean
	table: boolean
	link: boolean
	list: {
		ordered: boolean
		unordered: boolean
		task: boolean
	}
}

export function EditorLayout() {
	const [theme, setTheme] = useState<'light' | 'dark'>('light')
	const [features, setFeatures] = useState<EditorFeatures>({
		image: true,
		latex: false,
		code: true,
		table: false,
		link: true,
		list: {
			ordered: true,
			unordered: true,
			task: false
		}
	})

	useEffect(() => {
		const savedTheme = localStorage.getItem('editor-theme') as
			| 'light'
			| 'dark'
			| null
		if (savedTheme) {
			setTheme(savedTheme)
			document.documentElement.classList.toggle('dark', savedTheme === 'dark')
		}
	}, [])

	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light'
		setTheme(newTheme)
		localStorage.setItem('editor-theme', newTheme)
		document.documentElement.classList.toggle('dark', newTheme === 'dark')
	}

	const toggleFeature = (feature: string, subFeature?: string) => {
		setFeatures(prev => {
			if (subFeature && feature === 'list') {
				return {
					...prev,
					list: {
						...prev.list,
						[subFeature]: !prev.list[subFeature as keyof typeof prev.list]
					}
				}
			}

			// 顶层布尔值开关
			if (feature !== 'list') {
				return {
					...prev,
					[feature]: !prev[feature as keyof Omit<EditorFeatures, 'list'>]
				}
			}

			return prev
		})
	}

	return (
		<div className="flex h-screen w-full bg-background">
			<EditorSidebar
				features={features}
				onToggleFeature={toggleFeature}
				theme={theme}
				onToggleTheme={toggleTheme}
			/>
			<main className="flex-1 flex flex-col overflow-hidden">
				<Editor features={features} />
			</main>
		</div>
	)
}
