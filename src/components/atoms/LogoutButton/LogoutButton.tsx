import { LogoutSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import useGlobalContext from '../../../hooks/useGlobalContext'

import type { ReactNode } from 'react'

interface LogoutButtonProps {
	children: ReactNode
	className: string
	ariaLabel?: string
}

const LogoutButton = ({ children, className, ariaLabel }: LogoutButtonProps) => {
	const { signOut, mobileMenu, openCloseUserMenu } = useGlobalContext()
	const { toggle } = mobileMenu
	return (
		<button
			type="button"
			title="Log out"
			aria-label={ariaLabel}
			className={className}
			onClick={() => {
				signOut()
				toggle()
				openCloseUserMenu()
			}}>
			<LogoutSVG /> {children}
		</button>
	)
}

export default LogoutButton
