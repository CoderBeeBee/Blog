import { useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { useLocation } from 'react-router'

const useSort = () => {
	const { pathname } = useLocation()
	const listRef = useRef<HTMLDivElement | null>(null)
	const [focusedChevron, setFocusedChevron] = useState<string>('')
	const [action, setAction] = useState<string>('')
	const [sort, setSort] = useState({
		sortBy: '',
		order: '',
	})

	const handleSetSort = (e: MouseEvent<HTMLDivElement | HTMLButtonElement> | KeyboardEvent) => {
		const target = e.currentTarget as HTMLDivElement | HTMLButtonElement
		const el = target.dataset.element

		if (!el) return
		if (el !== focusedChevron) {
			setFocusedChevron(el)
		} else {
			setFocusedChevron('')
		}

		if (pathname.includes('posts') && (el === 'status' || el === 'categories')) return

		setAction('')
		listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })

		if (
			el === 'created At' ||
			el === 'published At' ||
			el === 'scheduled At' ||
			el === 'comments' ||
			el === 'views' ||
			el === 'comments' ||
			el === 'last Login' ||
			el === 'status'
		) {
			setSort(prev => {
				const newOrder = prev.sortBy === el ? (prev.order === 'asc' ? 'desc' : 'asc') : 'desc'

				return { sortBy: el, order: newOrder }
			})
			return
		}

		setSort(prev => {
			const newOrder = prev.sortBy === el ? (prev.order === 'desc' ? 'asc' : 'desc') : 'asc'

			return { sortBy: el, order: newOrder }
		})
	}

	const handleSetAction = ({ sort, action }: { sort: string; action: string }) => {
		setSort({ sortBy: sort, order: 'asc' })
		setAction(action)
		listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
	}
	const handleResetSort = () => {
		if (sort.sortBy === '') return
		setSort({
			order: '',
			sortBy: '',
		})

		setFocusedChevron('')
	}

	return {
		handleSetSort,
		handleSetAction,
		action,
		sort,
		listRef,
		setSort,
		setAction,
		focusedChevron,
		setFocusedChevron,
		handleResetSort,
	}
}

export default useSort
