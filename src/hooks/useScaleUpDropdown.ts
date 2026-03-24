import { useEffect, useRef, useState } from 'react'
import useSort from './useSort'

const useScaleUpDropdown = () => {
	const scaleRef = useRef<(HTMLTableCellElement | null)[]>([])
	const [scaleUp, setScaleUp] = useState<number | null>(null)
	const { setFocusedChevron } = useSort()
	const handleScaleUpDropdown = (index: number) => {
		if (scaleUp === index) setScaleUp(null)
		else setScaleUp(index)
	}

	useEffect(() => {
		const handleClickOutside = (e: globalThis.MouseEvent) => {
			if (scaleUp === null) return
			const el = scaleRef.current[scaleUp]

			if (!el) return
			const target = e.target as Node
			if (!el?.contains(target)) {
				setScaleUp(null)
				setFocusedChevron('')
			}
		}
		window.addEventListener('mousedown', handleClickOutside)

		return () => window.removeEventListener('mousedown', handleClickOutside)
	}, [scaleUp, setFocusedChevron])

	return {
		scaleRef,
		scaleUp,
		handleScaleUpDropdown,
	}
}

export default useScaleUpDropdown
