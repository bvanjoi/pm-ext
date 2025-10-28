import { IMG_NODE_SPEC } from '@pm-ext/img'
import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { ProsemirrorEditor } from '../pm/index'

function ImgPMEditor() {
	return (
		<div>
			<ProsemirrorEditor
				nodes={{
					img: IMG_NODE_SPEC,
				}}
			/>
		</div>
	)
}

const meta: Meta = {
	component: ImgPMEditor,
}

export const Primary: StoryObj = {}
export default meta
