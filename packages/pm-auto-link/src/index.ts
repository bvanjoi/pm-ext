import type { MarkSpec, Node as PMNode } from 'prosemirror-model'
import type { PluginSpec, Transaction } from 'prosemirror-state'
import type { StepMap } from 'prosemirror-transform'
import { type AutoLinkParser, createAutoLinkParser } from './parseLink'

export { createAutoLinkParser } from './parseLink'

export const AUTO_LINK_SPEC: MarkSpec = {
	attrs: {
		href: {},
		isAuto: {
			default: true,
		},
	},
	inclusive: false,
	toDOM: mark => ['a', { href: mark.attrs.href }, 0],
	parseDOM: [
		{
			tag: 'a[href]',
			getAttrs: dom => {
				return { href: dom.getAttribute('href') }
			},
		},
	],
}

function getNewStartAndNewEndFromStepMap(
	stepMap: StepMap,
): Array<[number, number]> {
	const ans: Array<[number, number]> = []
	stepMap.forEach((...args) => {
		ans.push([args[2], args[3]])
	})
	return ans
}

function getAllChangedNodesFromTr(
	tr: Transaction,
): { node: PMNode; pos: number }[] {
	const nodes: { node: PMNode; pos: number }[] = []
	for (let i = tr.mapping.from; i < tr.mapping.to; i += 1) {
		const stepMap = tr.mapping.maps[i]
		getNewStartAndNewEndFromStepMap(stepMap).forEach(([from, to]) => {
			tr.doc.nodesBetween(
				from,
				to,
				(node, pos) => {
					if (!node.isTextblock) {
						return false
					}
					nodes.push({ node, pos })
				},
				1,
			)
		})
	}
	return nodes
}

export const AUTO_LINK_PLUGIN: PluginSpec<any> = {
	appendTransaction(trs, _, newState) {
		const nodes = trs
			.map(tr => getAllChangedNodesFromTr(tr))
			.filter(list => list.length > 0)
			.flat()
		if (nodes.length === 0) {
			return
		}
		let tr = newState.tr
		const linkMark = newState.schema.marks.link
		for (const { node, pos: start } of nodes) {
			node.descendants((n, pos) => {
				if (n.marks.find(m => m.type === linkMark && m.attrs.isAuto)) {
					tr = tr.removeMark(start + pos, start + pos + n.nodeSize, linkMark)
				}
			})
		}
		const linkParser: AutoLinkParser = createAutoLinkParser()
		for (const { node, pos } of nodes) {
			const list = linkParser(node.textContent)
			for (const item of list) {
				tr = tr.addMark(
					pos + item.start,
					pos + item.end,
					linkMark.create({
						href: node.textContent.slice(item.start, item.end),
					}),
				)
			}
		}
		return tr
	},
}
