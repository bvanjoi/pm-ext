import { expect, test } from '@playwright/test'
import { InlinePlaceholderLoading } from '@pm-ext/component-placeholder/inline-block-placeholder'

test('`InlinePlaceholderLoading` - should render correctly', async ({
	page
}) => {
	// await page.setContent('<div id="container"></div>')
	// await page.evaluate(() => {
	// 	const container = document.getElementById('container')
	// 	if (container) {
	// 		const placeholder = InlinePlaceholderLoading()
	// 		container.appendChild(placeholder)
	// 	}
	// })
	// const placeholder = page.locator('.inline-placeholder-loading')
	// await expect(placeholder).toHaveCount(1)
})
