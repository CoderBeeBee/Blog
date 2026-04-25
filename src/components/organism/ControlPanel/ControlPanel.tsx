import { useSelector } from 'react-redux'
import type { RootState } from '../../../store'

import ControlPanelSignIn from '../../atoms/ControlPanelSignIn/ControlPanelSignIn'
import ControlPanelUser from '../../atoms/ControlPanelUser/ControlPanelUser'

import useWindowSize from '../../../hooks/useWindowSize'
import useGlobalContext from '../../../hooks/useGlobalContext'

interface ControlPanelProps {
	styles: Record<string, string>
	index: number
}

const ControlPanel = ({ styles, index }: ControlPanelProps) => {
	const { widthLess900 } = useWindowSize()
	const { isLogged, role } = useSelector((state: RootState) => state.auth)
	const { expandCollapseDropdown, activeIndex } = useGlobalContext()
	return (
		<div
			className={`${styles.navPanelWrapper} ${activeIndex === index ? styles.active : ''}`}
			onClick={() => {
				if (!widthLess900) return
				expandCollapseDropdown(index)
			}}>
			{!isLogged ? <ControlPanelSignIn styles={styles} /> : role === 'User' ? <ControlPanelUser styles={styles} /> : ''}
		</div>
	)
}

export default ControlPanel
