import CloseButton from '../../../components/atoms/CloseButton/CloseButton'
import MenuElement from '../../../components/organism/menuElement/MenuElement'
import type { MenuTypes } from '../dataNavigation/dataNavigation'
import styles from './MobileNav.module.scss'
import ControlPanel from '../../../components/organism/ControlPanel/ControlPanel'
import useGlobalContext from '../../../hooks/useGlobalContext'


interface MobileRefProps {
	dataMenu: MenuTypes[]
}

const MobileNav = ({ dataMenu }: MobileRefProps) => {
	const { setActiveIndex,setActiveSubIndex,mobileMenu,scrollMenu } = useGlobalContext()
	const { toggle, isOpen, isVisible } = mobileMenu


	return (
		<div
			className={`${styles.mobileContainer} ${isVisible ? styles.visibleMenu : ''} ${isOpen ? styles.displayAnim : ''} ${scrollMenu ? styles.scrollMenu : ''}`}>
			<div className={styles.mobileElement}>
				<CloseButton
					styles={styles}
					handleClose={() => {
						toggle()
						setActiveIndex(null)
						setActiveSubIndex(null)
					}}
				/>
				<h2 className={styles.title}>Navigate to</h2>
			</div>
			<div className={styles.mobileLink}>
				<ControlPanel
					
					styles={styles}
					index={0}
				/>

				{dataMenu.map((item: MenuTypes, index: number) => {
					return (
						<MenuElement
							key={index}
							styles={styles}
							data={item}
							index={index}
							
						/>
					)
				})}
			</div>
		</div>
	)
}

export default MobileNav
