export function ImageLoading(): HTMLElement {
	const p = document.createElement('p')
	p.innerText = 'Loading...'
	p.style.cssText = 'color: #999; font-size: 14px;'
	return p
}
