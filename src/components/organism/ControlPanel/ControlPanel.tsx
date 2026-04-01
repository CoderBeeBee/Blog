import { useSelector } from 'react-redux'
import type { RootState } from '../../../store'

import ControlPanelSignIn from '../../atoms/ControlPanelSignIn/ControlPanelSignIn'
import ControlPanelUser from '../../atoms/ControlPanelUser/ControlPanelUser'
import type { MouseEvent } from 'react'

interface ControlPanelProps {
	styles: Record<string, string>
	index: number
	activeIndex?: number | null
	handleOpenCloseDropdown?: (e: MouseEvent<HTMLDivElement | HTMLAnchorElement>) => void
}

const ControlPanel = ({ styles, index, activeIndex, handleOpenCloseDropdown }: ControlPanelProps) => {
	const { isLogged, role } = useSelector((state: RootState) => state.auth)

	return (
		<div
			className={`${styles.navPanelWrapper} ${activeIndex === index ? styles.active : ''}`}
			data-element={index}
			onClick={e => {
				handleOpenCloseDropdown?.(e)
			}}>
			{!isLogged ? <ControlPanelSignIn styles={styles} /> : role === 'User' ? <ControlPanelUser styles={styles} /> : ''}
		</div>
	)
}

export default ControlPanel
