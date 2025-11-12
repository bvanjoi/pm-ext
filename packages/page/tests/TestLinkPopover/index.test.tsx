import { expect, test } from '@playwright/experimental-ct-react'
import { HTMLSelectorORM, PageQuery } from '../utils'
import { TestLinkPopover0 } from './fixture'

test('LinkPopover', async ({ mount, page }) => {
	const query = PageQuery(page)
	const selector = HTMLSelectorORM().appendAttribute(
		'data-slot',
		'popover-content',
	)

	let clicked = false

	const component = await mount(
		<TestLinkPopover0
			onConfirm={() => {
				clicked = true
			}}
		/>,
	)

	await Promise.all([
		expect(component).toContainText('editorLink'),
		expect(query.isVisible(selector)).resolves.toBe(false),
	])

	await component.click()
	expect(clicked).toBe(false)

	await expect(query.isVisible(selector)).resolves.toBe(true)

	const confirmBtn = HTMLSelectorORM().appendAttribute('data-slot', 'button')
	const locator = page.locator(confirmBtn.value()).nth(1)
	expect(await locator.innerText()).toBe('commonConfirm')

	await locator.click()

	expect(clicked).toBe(true)
})
