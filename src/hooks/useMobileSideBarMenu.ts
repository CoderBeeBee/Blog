import { useCallback, useState } from 'react'
import { MobileMenuState, type MobileMenuTypes } from '../types/types'

// export const useMobileSideBarMenu = () => {
// 	const [active, setActive] = useState<boolean>(false)
// 	const [isVisible, setIsVisible] = useState<boolean>(false)
// 	const open = useCallback(() => {
// 		setActive(true)

// 		setTimeout(() => {
// 			setIsVisible(true)
// 		}, 300)
// 	}, [])
// 	const close = useCallback(() => {
// 		setActive(false)
// 		setTimeout(() => {
// 			setIsVisible(false)
// 		}, 300)
// 	}, [])
// 	const toggle = useCallback(() => {
// 		setActive(prev => !prev)
// 	}, [])

// 	return {
// 		active,
// 		isVisible,
// 		open,
// 		close,
// 		toggle,
// 	}
// }
export const useMobileSideBarMenu = () => {
	const [state, setState] = useState<MobileMenuTypes>(MobileMenuState.CLOSED)

	const open = useCallback(() => {
		if (state !== MobileMenuState.CLOSED) return

		setState(MobileMenuState.OPENING)
		setTimeout(() => {
			setState(MobileMenuState.OPEN)
		}, 100)
	}, [state])
	const close = useCallback(() => {
		if (state !== MobileMenuState.OPEN) return

		setState(MobileMenuState.CLOSING)
		setTimeout(() => {
			setState(MobileMenuState.CLOSED)
		}, 500)
	}, [state])
	const toggle = useCallback(() => {
		if (state === MobileMenuState.OPEN) close()
		else if (state === MobileMenuState.CLOSED) open()
	}, [state, open, close])

	return {
		isOpen: state === MobileMenuState.OPEN,
		isVisible: state !== MobileMenuState.CLOSED,
		open,
		close,
		toggle,
	}
}
