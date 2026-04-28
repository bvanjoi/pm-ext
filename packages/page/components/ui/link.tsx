import NextLink from 'next/link'
import type React from 'react'
import { cn } from '@/utils'

interface LinkProps extends React.ComponentProps<typeof NextLink> {
	className?: string
}

export function Link({ className, ...props }: LinkProps) {
	return (
		<NextLink
			className={cn(
				'text-primary hover:underline transition-colors',
				className,
			)}
			{...props}
		/>
	)
}
