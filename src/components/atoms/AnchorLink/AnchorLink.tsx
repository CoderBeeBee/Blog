import type { KeyboardEvent, MouseEvent, ReactNode, RefObject } from 'react'
import { removePaginationLinksTags } from '../../../utils/removePaginationLinksTag'
import { useLocation, useNavigate } from 'react-router'
import useWindowSize from '../../../hooks/useWindowSize'

interface AnchorLink {
	children: ReactNode
	href: string
	rel?: string
	target?: string
	className?: string
	count?: number
	index?: number
	ariaLabel?: string
	title?: string
	ref?: RefObject<HTMLAnchorElement | null>
	handleClose?: () => void
	onKeyDown?: (e: KeyboardEvent) => void
	onClickCollapseDropdown?: () => void
	toggle?: () => void
}

const AnchorLink = ({
	children,
	href,
	rel,
	target,
	count,
	className,
	ariaLabel,
	ref,
	toggle,
	title,
	onClickCollapseDropdown,
	handleClose,
	onKeyDown,
}: AnchorLink) => {
	const { widthLess900 } = useWindowSize()

	const navigate = useNavigate()
	const location = useLocation()

	const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault()

		removePaginationLinksTags()

		if (widthLess900) {
			toggle?.()
		}
		

		handleClose?.()
		const url = new URL(window.location.origin + href)
		const path = url.pathname
		const search = url.search

		const hash = url.hash.replace('#', '')

		if (location.pathname !== path || location.search !== search) {
			setTimeout(() => {
				navigate({ pathname: path, search, hash: hash ? `#${hash}` : undefined })
			}, 200)

			setTimeout(() => {
				window.scrollTo({ top: 0, behavior: 'smooth' })
			}, 210)
		}
	}

	return (
		<a
			title={title}
			href={href}
			ref={ref}
			onKeyDown={e => onKeyDown?.(e)}
			onClick={e => handleClick(e)}
			onMouseEnter={() => {
				if (widthLess900) return
				onClickCollapseDropdown?.()
			}}
			rel={rel}
			draggable={false}
			target={target}
			aria-label={ariaLabel}
			data-main={count}
			data-element={-1}
			className={`${className ? className : ''}  `}>
			{children}
		</a>
	)
}

export default AnchorLink
