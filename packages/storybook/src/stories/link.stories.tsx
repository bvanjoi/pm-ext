import { Button, Popover } from '@mui/material'
import { AUTO_LINK_PLUGIN, LINK_SPEC } from '@pm-ext/link'
import type { Meta, StoryObj } from '@storybook/react'
import { Plugin } from 'prosemirror-state'
import * as React from 'react'
import { ProsemirrorEditor } from '../pm/index'

function App() {
	const [showLinkPopover, setShowLinkPopover] = React.useState(false)
	return (
		<div>
			<Button
				onClick={() => {
					setShowLinkPopover(true)
				}}
			>
				Link
			</Button>
			<LinkPMEditor />
			<Popover open={showLinkPopover} onClose={() => setShowLinkPopover(false)}>
				placeholder
			</Popover>
		</div>
	)
}

function LinkPMEditor() {
	return (
		<ProsemirrorEditor
			marks={{
				link: LINK_SPEC,
			}}
			plugins={[new Plugin(AUTO_LINK_PLUGIN)]}
			initHtml="<p>Here is link example!</p>"
		/>
	)
}

const meta: Meta = {
	title: 'link',
	component: App,
}

export const Primary: StoryObj = {}
export default meta
