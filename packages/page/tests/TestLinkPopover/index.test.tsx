import { expect, test } from '@playwright/experimental-ct-react'
import { HTMLSelectorORM, PageQuery } from '../utils'
import { TestLinkPopover0 } from './fixture'

test('LinkPopover', async ({ mount, page }) => {
	const query = PageQuery(page)
	const selector = HTMLSelectorORM().appendAttribute(
		'data-slot',
		'popover-content',
	)

	const component = await mount(<TestLinkPopover0 />)
	await Promise.all([
		expect(component).toContainText('editorLink'),
		expect(query.isVisiable(selector)).resolves.toBe(false),
	])

	await component.click()
	await expect(query.isVisiable(selector)).resolves.toBe(true)
})
