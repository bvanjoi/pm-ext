export type I18nMessage = {
	common: {
		language: string
		search: string
		noResults: string
		docs: string
		basics: string
		previously: string
		nextUp: string
	}
	navigation: {
		prosemirror: string
		collaborativeEditing: string
		customNodes: string
		formatting: string
		images: string
		installation: string
		links: string
		lists: string
		overview: string
		plugins: string
		textEditor: string
	}
	editor: {
		bold: string
		italic: string
		underline: string
		code: string
		heading1: string
		heading2: string
		heading3: string
		bulletList: string
		orderedList: string
		blockquote: string
		codeBlock: string
		link: string
		image: string
		undo: string
		redo: string
		clear: string
	}
	examples: {
		formatting: {
			title: string
			description: string
			preview: string
			code: string
			react: string
			vue: string
			copy: string
			copied: string
		}
		lists: {
			title: string
			description: string
		}
		links: {
			title: string
			description: string
		}
		images: {
			title: string
			description: string
		}
		textEditor: {
			title: string
			description: string
		}
	}
}
