import { useEffect, useState } from 'react'

interface WindowSize {
	width: number
	height: number
}

const useWindowSize = () => {
	const [windowSize, setWindowSize] = useState<WindowSize>({
		width: typeof window !== 'undefined' ? window.innerWidth : 0,
		height: typeof window !== 'undefined' ? window.innerHeight : 0,
	})

	useEffect(() => {
		let timeOutId: ReturnType<typeof setTimeout> | null = null

		const handleResize = () => {
			if (timeOutId) clearTimeout(timeOutId)

			timeOutId = setTimeout(() => {
				setWindowSize({
					width: window.innerWidth,
					height: window.innerHeight,
				})
			}, 200)
		}

		window.addEventListener('resize', handleResize)
		// handleResize()

		return () => {
			if (timeOutId) clearTimeout(timeOutId)
			window.removeEventListener('resize', handleResize)
		}
	}, [])
	const widthGreater900 = windowSize.width > 900

	const widthLess1300 = windowSize.width < 1300
	const widthLess1100 = windowSize.width < 1100
	const widthLess900 = windowSize.width < 900
	const widthLess800 = windowSize.width < 800
	const widthLess700 = windowSize.width < 700

	const isMobile = windowSize.width < 800
	const isMobilePanel = windowSize.width < 600

	return {
		width: windowSize.width,
		height: windowSize.height,
        widthGreater900,
		widthLess1300,
        widthLess1100,
		widthLess900,
		widthLess800,
		widthLess700,
		isMobile,
		isMobilePanel,
	}
}

export default useWindowSize
