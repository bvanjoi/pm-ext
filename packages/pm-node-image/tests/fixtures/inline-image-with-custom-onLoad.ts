import { defaultOnLoad } from '@pm-ext/node-image/view/default-placeholder'
import { setupInlineImageEditor } from './base-inline-image'

setupInlineImageEditor({
	builtinInlineImagePlaceholderOptions: {
		onLoad: (view, id) => {
			document.title = 'Image Loaded'
			defaultOnLoad(view, id)
		}
	}
})
