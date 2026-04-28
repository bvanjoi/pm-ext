import { Input } from './input'

export interface LabelInputProps {
	id: string
	defaultValue?: string
	onChange?: (value: string) => void
}

export function LabelInput(props: LabelInputProps) {
	return (
		<Input
			id={props.id}
			className="col-span-2 h-8"
			defaultValue={props.defaultValue}
			onChange={e => {
				if (props.onChange) {
					props.onChange(e.currentTarget.value)
				}
			}}
		/>
	)
}
