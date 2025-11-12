import { LinkPopover } from '../../components/ui/linkPopover'

export function TestLinkPopover0(props?: {
	onConfirm?: (href: string, text: string) => void
}) {
	return <LinkPopover {...props} />
}
