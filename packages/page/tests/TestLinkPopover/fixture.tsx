import React from 'react'
import { LinkPopover } from '../../components/ui/linkPopover'

export function TestLinkPopover0() {
	const [href, setHref] = React.useState<string>()
	const [text, setText] = React.useState<string>()
	return (
		<React.Fragment>
			{typeof href === 'string' ? <p id="test-href">{href}</p> : undefined}
			{typeof text === 'string' ? <p id="test-text">{text}</p> : undefined}
			<LinkPopover
				onConfirm={(...args) => {
					setHref(args[0])
					setText(args[1])
				}}
			/>
		</React.Fragment>
	)
}
