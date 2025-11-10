import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

interface LabelInputProps {
	id: string
	onChange: (value: string) => void
}

function LabelInput(props: LabelInputProps) {
	return (
		<Input
			id="href"
			className="col-span-2 h-8"
			onChange={e => {
				props.onChange(e.currentTarget.value)
			}}
		/>
	)
}

interface LinkPopoverProps {
	onConfirm?: (href: string, text: string) => void
}

export function LinkPopover(props: LinkPopoverProps): React.JSX.Element {
	const { t } = useTranslation()

	const [herf, setHref] = React.useState<string>('')
	const [text, setText] = React.useState<string>('')

	const onConfirm = () => {
		if (props.onConfirm) {
			props.onConfirm(herf, text)
		}
	}

	return (
		<Popover>
			<PopoverTrigger>
				<Button className="m-1 cursor-pointer">{t('editorLink')}</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<div className="grid gap-2">
					<div className="grid grid-cols-3 items-center gap-4">
						<Label htmlFor="href">{t('linkPopoverHrefLabel')}</Label>
						<LabelInput id="href" onChange={setHref} />
					</div>
					<div className="grid grid-cols-3 items-center gap-4">
						<Label htmlFor="text">{t('linkPopoverTextLabel')}</Label>
						<LabelInput id="text" onChange={setText} />
					</div>
					<Button className="mt-2 cursor-pointer" onClick={onConfirm}>
						{t('commonConfirm')}
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	)
}
