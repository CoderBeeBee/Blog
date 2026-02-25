import useGlobalContext from '../../../hooks/useGlobalContext'

import type { ReactNode } from 'react'

interface SignOutBtnProps {
	children: ReactNode
	className: string
	ariaLabel?: string
}

const SignOutBtn = ({ children, className, ariaLabel }: SignOutBtnProps) => {
	const { signOut, mobileMenu, openCloseUserMenu } = useGlobalContext()
	const { toggle } = mobileMenu
	return (
		<button
			type="button"
			title="Sign Out"
			aria-label={ariaLabel}
			className={className}
			onClick={() => {
				signOut()
				toggle()
				openCloseUserMenu()
			}}>
			{children}
		</button>
	)
}

export default SignOutBtn
