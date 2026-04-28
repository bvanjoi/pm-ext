'use client'

import {
	Bold,
	ChevronDown,
	ChevronLeft,
	Code2,
	FileText,
	FunctionSquare,
	Heading,
	Highlighter,
	ImageIcon,
	Italic,
	Link2,
	List,
	ListOrdered,
	ListTodo,
	Moon,
	Quote,
	Settings,
	Strikethrough,
	Sun,
	Table2,
	Underline
} from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import { cn } from '@/utils'
import type { EditorFeatures } from './pm-editor-layout'

interface EditorSidebarProps {
	features: EditorFeatures
	onToggleFeature: (feature: string, subFeature?: string) => void
	theme: 'light' | 'dark'
	onToggleTheme: () => void
}

interface SubMenuItem {
	key: string
	label: string
	icon: React.ElementType
}

interface FeatureItem {
	key: string
	label: string
	icon: React.ElementType
	children?: SubMenuItem[]
}

interface FeatureGroup {
	category: string
	items: FeatureItem[]
}

const featureGroups: FeatureGroup[] = [
	{
		category: 'Mark',
		items: [
			// { key: 'bold', label: 'Bold', icon: Bold },
			// { key: 'italic', label: 'Italic', icon: Italic },
			// { key: 'underline', label: 'Underline', icon: Underline },
			// { key: 'strike', label: 'Strikethrough', icon: Strikethrough },
			// { key: 'highlight', label: 'Highlight', icon: Highlighter },
			{ key: 'link', label: 'Link', icon: Link2 }
		]
	},
	{
		category: 'Node',
		items: [
			// { key: 'heading', label: 'Heading', icon: Heading },
			// { key: 'blockquote', label: 'Blockquote', icon: Quote },
			{ key: 'image', label: 'Image', icon: ImageIcon }
			// { key: 'latex', label: 'LaTeX', icon: FunctionSquare },
			// { key: 'code', label: 'Code Block', icon: Code2 },
			// { key: 'table', label: 'Table', icon: Table2 },
			// {
			// 	key: 'list',
			// 	label: 'List',
			// 	icon: List,
			// 	children: [
			// 		{ key: 'ordered', label: 'Ordered List', icon: ListOrdered },
			// 		{ key: 'unordered', label: 'Unordered List', icon: List },
			// 		{ key: 'task', label: 'Task List', icon: ListTodo }
			// 	]
			// }
		]
	}
]

export function EditorSidebar({
	features,
	onToggleFeature,
	theme,
	onToggleTheme
}: EditorSidebarProps) {
	const [collapsed, setCollapsed] = useState(false)
	const [expandedMenus, setExpandedMenus] = useState<string[]>(['list'])

	const toggleExpand = (key: string) => {
		setExpandedMenus(prev =>
			prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
		)
	}

	const getFeatureState = (key: string, subKey?: string): boolean => {
		if (key === 'list' && subKey) {
			return features.list?.[subKey as keyof typeof features.list] ?? false
		}
		if (key === 'list') {
			return features.list ? Object.values(features.list).some(Boolean) : false
		}
		return ((features as Record<string, unknown>)[key] as boolean) ?? false
	}

	return (
		<aside
			className={cn(
				'h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300',
				collapsed ? 'w-16' : 'w-64'
			)}
		>
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b border-sidebar-border">
				{!collapsed && (
					<div className="flex items-center gap-2">
						<FileText className="h-5 w-5 text-sidebar-primary" />
						<span className="font-semibold text-sidebar-foreground">
							Editor
						</span>
					</div>
				)}
				<button
					onClick={() => setCollapsed(!collapsed)}
					className={cn(
						'p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors',
						collapsed && 'mx-auto'
					)}
				>
					<ChevronLeft
						className={cn(
							'h-4 w-4 transition-transform',
							collapsed && 'rotate-180'
						)}
					/>
				</button>
			</div>

			{/* Feature Toggles */}
			<div className="flex-1 p-3 overflow-y-auto">
				{featureGroups.map((group, groupIndex) => (
					<div key={group.category}>
						{/* Category Separator */}
						{!collapsed ? (
							<div className="flex items-center gap-2 px-2 my-4">
								<div className="h-px flex-1 bg-sidebar-border" />
								<span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
									{group.category}
								</span>
								<div className="h-px flex-1 bg-sidebar-border" />
							</div>
						) : (
							groupIndex > 0 && (
								<div className="h-px mx-2 my-3 bg-sidebar-border" />
							)
						)}

						{/* Feature Items */}
						<div className="space-y-1">
							{group.items.map(({ key, label, icon: Icon, children }) => (
								<div key={key}>
									<button
										onClick={() =>
											children ? toggleExpand(key) : onToggleFeature(key)
										}
										className={cn(
											'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
											'hover:bg-sidebar-accent group',
											collapsed && 'justify-center px-2'
										)}
									>
										<Icon
											className={cn(
												'h-4 w-4 flex-shrink-0 transition-colors',
												getFeatureState(key)
													? 'text-sidebar-primary'
													: 'text-muted-foreground'
											)}
										/>
										{!collapsed && (
											<>
												<span
													className={cn(
														'flex-1 text-left text-sm transition-colors',
														getFeatureState(key)
															? 'text-sidebar-foreground'
															: 'text-muted-foreground'
													)}
												>
													{label}
												</span>
												{children ? (
													<ChevronDown
														className={cn(
															'h-4 w-4 text-muted-foreground transition-transform',
															expandedMenus.includes(key) && 'rotate-180'
														)}
													/>
												) : (
													<div
														className={cn(
															'w-9 h-5 rounded-full p-0.5 transition-colors',
															getFeatureState(key)
																? 'bg-sidebar-primary'
																: 'bg-muted'
														)}
													>
														<div
															className={cn(
																'w-4 h-4 rounded-full bg-white shadow-sm transition-transform',
																getFeatureState(key)
																	? 'translate-x-4'
																	: 'translate-x-0'
															)}
														/>
													</div>
												)}
											</>
										)}
									</button>

									{children && !collapsed && expandedMenus.includes(key) && (
										<div className="ml-4 pl-3 border-l border-sidebar-border mt-1 space-y-1">
											{children.map(
												({ key: subKey, label: subLabel, icon: SubIcon }) => (
													<button
														key={subKey}
														onClick={() => onToggleFeature(key, subKey)}
														className={cn(
															'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all',
															'hover:bg-sidebar-accent group'
														)}
													>
														<SubIcon
															className={cn(
																'h-3.5 w-3.5 flex-shrink-0 transition-colors',
																getFeatureState(key, subKey)
																	? 'text-sidebar-primary'
																	: 'text-muted-foreground'
															)}
														/>
														<span
															className={cn(
																'flex-1 text-left text-xs transition-colors',
																getFeatureState(key, subKey)
																	? 'text-sidebar-foreground'
																	: 'text-muted-foreground'
															)}
														>
															{subLabel}
														</span>
														<div
															className={cn(
																'w-8 h-4 rounded-full p-0.5 transition-colors',
																getFeatureState(key, subKey)
																	? 'bg-sidebar-primary'
																	: 'bg-muted'
															)}
														>
															<div
																className={cn(
																	'w-3 h-3 rounded-full bg-white shadow-sm transition-transform',
																	getFeatureState(key, subKey)
																		? 'translate-x-4'
																		: 'translate-x-0'
																)}
															/>
														</div>
													</button>
												)
											)}
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				))}
			</div>

			{/* Footer */}
			<div className="p-3 border-t border-sidebar-border space-y-1">
				{/* 主题切换按钮 */}
				<button
					onClick={onToggleTheme}
					className={cn(
						'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
						'hover:bg-sidebar-accent text-sidebar-foreground',
						collapsed && 'justify-center px-2'
					)}
				>
					{theme === 'light' ? (
						<Moon className="h-4 w-4" />
					) : (
						<Sun className="h-4 w-4" />
					)}
					{!collapsed && (
						<span className="text-sm">
							{theme === 'light' ? 'Dark Mode' : 'Light Mode'}
						</span>
					)}
				</button>
				{/* 设置按钮 */}
				<button
					className={cn(
						'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
						'hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-foreground',
						collapsed && 'justify-center px-2'
					)}
				>
					<Settings className="h-4 w-4" />
					{!collapsed && <span className="text-sm">Settings</span>}
				</button>
			</div>
		</aside>
	)
}
