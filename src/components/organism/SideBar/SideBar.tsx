import { type ReactNode } from 'react'
import styles from './SideBar.module.scss'
import useGlobalContext from '../../../hooks/useGlobalContext'

interface SideBarProps {
	children: ReactNode
}

const SideBar = ({ children }: SideBarProps) => {
	const { sideBarRef, sideBarMenu } = useGlobalContext()
	const { isOpen } = sideBarMenu

	return (
		<div ref={sideBarRef} className={`${styles.sideBarContainer} ${isOpen ? styles.activeSideBar : ''}`}>
			<div className={styles.sideBarLinks}>{children}</div>
		</div>
	)
}

export default SideBar
