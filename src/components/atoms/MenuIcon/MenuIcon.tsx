import { useEffect, useRef } from 'react'
import styles from './MenuIcon.module.scss'
import useWindowSize from '../../../hooks/useWindowSize'
import useGlobalContext from '../../../hooks/useGlobalContext'

const MenuIcon = () => {
	const size = useWindowSize()
	const refBtn = useRef<HTMLButtonElement>(null)
	const { mobileMenu } = useGlobalContext()
	const { toggle } = mobileMenu
	useEffect(() => {
		if (size.width <= 900) {
			refBtn.current?.classList.add(styles.toggle)
		} else {
			refBtn.current?.classList.remove(styles.toggle)
		}
	}, [size])

	return (
		<button ref={refBtn} className={styles.btn} title="Menu" onClick={() => toggle()}>
			<span className={styles.span}></span>
		</button>
	)
}

export default MenuIcon
