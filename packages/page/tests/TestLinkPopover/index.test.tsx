import { expect, test } from '@playwright/experimental-ct-react'
import { HTMLSelectorORM, PageQuery } from '../utils'
import {
	EditHrefLinkPopover0,
	TestLinkPopover0,
	UnexpectModeLinkPopover,
} from './fixture'

test('unexpect mode of LinkPopover', async ({ mount }) => {
	const component = await mount(<UnexpectModeLinkPopover />)
	await expect(component).toBeEmpty()
})

test('test insert mode of LinkPopover', async ({ mount, page }) => {
	const query = PageQuery(page)
	const popoverBtn = HTMLSelectorORM().appendAttribute(
		'data-slot',
		'popover-content',
	)
	const confirmBtn = HTMLSelectorORM().appendAttribute('data-slot', 'button')
	const hrefSpan = HTMLSelectorORM().appendId('test-href')
	const textSpan = HTMLSelectorORM().appendId('test-text')

	const component = await mount(<TestLinkPopover0 />)

	await Promise.all([
		expect(component).toContainText('editorLink'),
		expect(query.isVisible(popoverBtn)).resolves.toBe(false),
	])

	await component.click()

	await Promise.all([
		expect(query.isVisible(popoverBtn)).resolves.toBe(true),
		expect(page.locator(hrefSpan.value())).toHaveCount(0),
		expect(page.locator(textSpan.value())).toHaveCount(0),
	])

	const locator = page.locator(confirmBtn.value()).nth(0)
	expect(await locator.innerText()).toBe('commonConfirm')

	await locator.click()

	await Promise.all([
		expect(query.isVisible(popoverBtn)).resolves.toBe(true),
		expect(page.locator(hrefSpan.value())).toHaveCount(1),
		expect(page.locator(textSpan.value())).toHaveCount(1),
	])
})

test('default value for editHref mode of LinkPopover', async ({
	mount,
	page,
}) => {
	const c = await mount(<EditHrefLinkPopover0 defaultHref="google.com" />)
	await c.click()
	const input = HTMLSelectorORM().appendElement('input')
	const loc = page.locator(input.value())
	await Promise.all([
		expect(loc.count()).resolves.toBe(1),
		expect(loc.first().inputValue()).resolves.toBe('google.com'),
	])
})
