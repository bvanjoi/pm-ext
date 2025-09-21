import type { Meta, StoryObj } from '@storybook/react'
import { Plugin } from 'prosemirror-state'
import * as React from 'react'
import { AUTO_LINK_PLUGIN, AUTO_LINK_SPEC } from '../../../pm-auto-link/dist'
import { ProsemirrorEditor } from '../pm/index'

function AutoLinkPMEditor() {
	return (
		<ProsemirrorEditor
			marks={{
				link: AUTO_LINK_SPEC,
			}}
			plugins={[new Plugin(AUTO_LINK_PLUGIN)]}
		/>
	)
}

const meta: Meta = {
	component: AutoLinkPMEditor,
}

export const Primary: StoryObj = {}
export default meta
