import { useTranslation } from 'react-i18next'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export function LinkPopover() {
	const { t } = useTranslation()
	return (
		<Popover>
			<PopoverTrigger>
				<Button className="m-1 cursor-pointer">{t('editorLink')}</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<div className="grid gap-2">
					<div className="grid grid-cols-3 items-center gap-4">
						<Label htmlFor="href">Href</Label>
						<Input id="href" className="col-span-2 h-8" />
					</div>
					<div className="grid grid-cols-3 items-center gap-4">
						<Label htmlFor="text">Text</Label>
						<Input id="text" className="col-span-2 h-8" />
					</div>
					<Button className="mt-2 cursor-pointer">{t('common.confirm')}</Button>
				</div>
			</PopoverContent>
		</Popover>
	)
}
