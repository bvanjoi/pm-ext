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

interface LinkPopoverBaseProps {
	onConfirm?: (href: string, text: string) => void
}

interface InsertLinkPopoverProps extends LinkPopoverBaseProps {
	mode: 'insert'
}

interface EditLinkPopoverProps extends LinkPopoverBaseProps {
	mode: 'editHref'
	href: string
	updateHref?: (newHref: string) => void
}

type LinkPopoverProps = InsertLinkPopoverProps | EditLinkPopoverProps

function InsertLinkPopoverContent(
	props: InsertLinkPopoverProps,
): React.JSX.Element {
	const { t } = useTranslation()
	const [herf, setHref] = React.useState<string>('')
	const [text, setText] = React.useState<string>('')
	const onConfirm = () => {
		if (props.onConfirm) {
			props.onConfirm(herf, text)
		}
	}
	return (
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
	)
}

function EditLinkPopoverContent(
	props: EditLinkPopoverProps,
): React.JSX.Element {
	const { href, onConfirm, updateHref } = props
	const { t } = useTranslation()

	const onConfirmClick = () => {
		if (onConfirm) {
			onConfirm(href, '')
		}
	}

	const onHrefTextChange = (newHref: string) => {
		if (updateHref) {
			updateHref(newHref)
		}
	}

	return (
		<div className="grid gap-2">
			<div className="grid grid-cols-3 items-center gap-4">
				<Label htmlFor="text">{t('linkPopoverTextLabel')}</Label>
				<LabelInput id="text" onChange={onHrefTextChange} />
			</div>
			<Button className="mt-2 cursor-pointer" onClick={onConfirmClick}>
				{t('commonConfirm')}
			</Button>
		</div>
	)
}

export function LinkPopover(props: LinkPopoverProps): React.JSX.Element {
	const { mode } = props
	const { t } = useTranslation()

	if (mode !== 'insert' && mode !== 'editHref') {
		return <></>
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button className="m-1 cursor-pointer">{t('editorLink')}</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				{mode === 'insert' ? <InsertLinkPopoverContent {...props} /> : null}
				{mode === 'editHref' ? <EditLinkPopoverContent {...props} /> : null}
			</PopoverContent>
		</Popover>
	)
}
