import type { Node as PMNode } from 'prosemirror-model'
import type { PluginSpec, Transaction } from 'prosemirror-state'
import type { StepMap } from 'prosemirror-transform'
import { type AutoLinkParser, createAutoLinkParser } from './parseLink'
import { getLinkMarkType, isLinkMark } from './utils'

function getNewStartAndNewEndFromStepMap(
	stepMap: StepMap,
): Array<[number, number]> {
	const ans: Array<[number, number]> = []
	stepMap.forEach((...args) => {
		ans.push([args[2], args[3]])
	})
	return ans
}

interface NodeInfo {
	node: PMNode
	pos: number
}

function getAllChangedNodesFromTr(tr: Transaction): NodeInfo[] {
	const nodes: NodeInfo[] = []
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
		const linkMarkType = getLinkMarkType(newState.schema)
		if (!linkMarkType) {
			return
		}
		const nodes = trs
			.map(tr => getAllChangedNodesFromTr(tr))
			.filter(list => list.length > 0)
			.flat()
		if (nodes.length === 0) {
			return
		}
		let tr = newState.tr
		const filteredNodes: NodeInfo[] = []
		for (const { node, pos: start } of nodes) {
			node.descendants((n, pos) => {
				if (n.marks.find(m => isLinkMark(m) && m.attrs.auto)) {
					tr = tr.removeMark(
						start + pos,
						start + pos + n.nodeSize,
						linkMarkType,
					)
				}
				if (
					n.marks.length === 0 ||
					n.marks.every(m => !isLinkMark(m) || !m.attrs.auto)
				) {
					filteredNodes.push({ node: n, pos: start + pos })
				}
			})
		}
		const linkParser: AutoLinkParser = createAutoLinkParser()
		for (const { node, pos } of filteredNodes) {
			const list = linkParser(node.textContent)
			for (const item of list) {
				tr = tr.addMark(
					pos + item.start,
					pos + item.end,
					linkMarkType.create({
						href: node.textContent.slice(item.start, item.end),
						auto: true,
					}),
				)
			}
		}
		return tr
	},
}
