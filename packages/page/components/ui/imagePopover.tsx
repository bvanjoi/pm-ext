import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from './button'
import { Label } from './label'
import { LabelInput } from './labelInput'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

interface ImagePopoverProps {
	onConfirm?: (href: string) => void
}

export function ImagePopover(props: ImagePopoverProps): React.JSX.Element {
	const { t } = useTranslation()
	const [href, setHref] = React.useState<string>('')

	const onConfirm = () => {
		if (props.onConfirm && href) {
			props.onConfirm(href)
		}
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button className="m-1 cursor-pointer">{t('editorImage')}</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<div className="grid gap-2">
					<div className="grid grid-cols-3 items-center gap-4">
						<Label htmlFor="image">{t('linkPopoverHrefLabel')}</Label>
						<LabelInput id="image" onChange={setHref} />
					</div>
					<Button className="mt-2 cursor-pointer" onClick={onConfirm}>
						{t('commonConfirm')}
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	)
}
