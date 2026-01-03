export function ImageLoading(): HTMLSpanElement {
	const span = document.createElement('span')
	span.innerText = 'Loading...'
	span.style.cssText = 'color: #999; font-size: 14px;'
	return span
}
