import { useEffect, useState } from 'react'

const useCheckMark = () => {
	const [checked, setChecked] = useState<Set<string>>(new Set())
	const [isCheckedAll, setIsCheckedAll] = useState<boolean>(false)

	const handleCheckMark = (id: string) => {
		setChecked(prev => {
			const next = new Set(prev)

			if (next.has(id)) {
				next.delete(id)
			} else {
				next.add(id)
			}

			return next
		})
		setIsCheckedAll(true)
	}
	const handleCheckMarkAll = (data: string[]) => {
		data.forEach(item => {
			setChecked(prev => {
				const next = new Set(prev)

				if (isCheckedAll) {
					next.delete(item)
				} else {
					next.add(item)
				}

				return next
			})
		})

		setIsCheckedAll(!isCheckedAll)
	}
	const handleClearCheckedSet = () => {
		setChecked(new Set())
	}

	useEffect(() => {
		if (checked.size >= 1) setIsCheckedAll(true)
		else setIsCheckedAll(false)
	}, [checked.size])

	return {
		handleCheckMark,
		checked,
		handleCheckMarkAll,
		isCheckedAll,
		handleClearCheckedSet,
	}
}

export default useCheckMark
