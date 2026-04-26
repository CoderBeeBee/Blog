import styles from './CategoriesList.module.scss'
import { useFetchAllCategoriesQuery, useUpdateCategoryMutation } from '../../../slices/api/categoriesApi'
import { TrashSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import type { CategoryProps } from '../../../types/types'

import useGlobalContext from '../../../hooks/useGlobalContext'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

const CategoriesList = () => {
	const [successMessage, setSuccessMessage] = useState<string>('')
	const [errorMessage, setErrorMessage] = useState<string>('')
	const { data: categories } = useFetchAllCategoriesQuery()
	const [dragged, setDragged] = useState<CategoryProps | null>(null)
	const [roots, setRoots] = useState<CategoryProps[]>([])
	const [updateCategory] = useUpdateCategoryMutation()
	const { editContext } = useGlobalContext()
	const { catId, handleSetCategory, handleDeleteCategory } = editContext

	const [targetId, setTargetId] = useState<string | null>(null)
	const [position, setPosition] = useState<number | null>(null)
	const offsetY = useRef(0)
	const dragElement = useRef<HTMLElement | null>(null)
	const [isDragging, setIsDragging] = useState(false)

	const handleDragStart = (e: PointerEvent, item: CategoryProps) => {
		const el = e.currentTarget as HTMLElement

		dragElement.current = el

		const rect = el.getBoundingClientRect()

		offsetY.current = rect.top

		setDragged(item)
	}

	const handleDragMove = (e: PointerEvent<HTMLDivElement>) => {
		e.stopPropagation()
		const target = e.currentTarget as HTMLDivElement

		const id = target.dataset.element

		if (!dragged || !dragElement.current) return

		const dy = Math.abs(e.clientY - position!)

		// 🔥 próg np. 6px
		if (!isDragging && dy > 8) {
			setIsDragging(true)
		}

		if (!isDragging) return

		setPosition(e.clientY - offsetY.current)

		if (id) {
			setTargetId(id)
		}
	}

	const handleDragEnd = async (
		e: PointerEvent<HTMLDivElement>,
		targetItem: CategoryProps | null,
		targetParentId: string | null,
	) => {
		e.preventDefault()
		e.stopPropagation()
		if (!dragged) return

		const name = dragged.name
		const slug = name.toLowerCase().replace(/\s+/g, '-')

		const parentName = targetItem ? targetItem.name : ''
		const parentSlug = parentName.toLowerCase().replace(/\s+/g, '-')

		const parentCategory = parentSlug ? `${parentSlug}/` : ''

		const permalink = `/categories/${parentCategory}${slug}`

		const updatedData = { ...dragged, parent: targetParentId, slug: permalink }

		try {
			if (dragged._id === targetItem?._id || dragged.parent === targetParentId) {
				setDragged(null)
				setTargetId(null)
				dragElement.current = null
				setIsDragging(false)
				return
			}
			const res = await updateCategory(updatedData).unwrap()

			if (res) setSuccessMessage(res.message)
		} catch (error) {
			if (typeof error === 'object' && error !== null) {
				const fetchError = error as FetchBaseQueryError
				const message =
					fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data
						? (fetchError.data.message as string)
						: 'An unexpected error has occured'

				setErrorMessage(message)
			} else {
				setErrorMessage('An unexpected error has occured')
			}
		}

		setDragged(null)
		setTargetId(null)
		setIsDragging(false)
		dragElement.current = null
	}

	useEffect(() => {
		if (!categories) return

		const map = new Map<string, CategoryProps>()
		const roots: CategoryProps[] = []

		categories.forEach((cat: CategoryProps) => {
			map.set(cat._id, { ...cat, children: [] })
		})

		categories.forEach((cat: CategoryProps) => {
			if (cat.parent) {
				const parent = map.get(cat.parent)
				if (parent) parent.children?.push(map.get(cat._id)!)
			} else {
				roots.push(map.get(cat._id)!)
			}
		})
		setRoots([...roots].sort((a, b) => a.name.localeCompare(b.name)))
	}, [categories])

	useEffect(() => {
		if (!successMessage) return

		const timeout = setTimeout(() => {
			setSuccessMessage('')
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}, 5000)

		return () => clearTimeout(timeout)
	}, [successMessage])
	return (
		<div
			data-element="1"
			onPointerMove={e => handleDragMove(e)}
			onPointerUp={e => handleDragEnd(e, null, null)}
			className={`${styles.categoriesWrapper} ${targetId === '1' ? styles.targetWrapper : ''}`}>
			<p className={styles.categoriesWrapperTitle}>Category List</p>
			<div className={styles.categoryWrapper}>
				{roots?.map((c, index) => (
					<div
						data-element={c._id}
						key={c._id}
						onPointerUp={e => handleDragEnd(e, c, c._id)}
						onPointerMove={e => handleDragMove(e)}
						className={`${styles.categoryBox} ${targetId === c._id ? styles.targetCategory : ''}`}>
						<span
							data-id={c._id}
							onClick={() => {
								handleSetCategory(c._id)

								setDragged(null)
							}}
							onPointerDown={e => handleDragStart(e, c)}
							key={c._id}
							className={`${styles.category} ${isDragging && styles.isDragging} ${dragged?._id === c._id ? styles.categoryDragging : ''}`}
							style={
								dragged?._id === c._id && isDragging
									? {
											transform: `translateY(${position}px) scale(0.8)`,

											zIndex: 1000,
										}
									: {}
							}>
							{index + 1}. {c.name}{' '}
							<button data-id={c._id} className={styles.deleteCategory} onClick={() => handleDeleteCategory(c._id)}>
								{catId === c._id && <TrashSVG className={styles.trashSVG} />}
							</button>
						</span>

						{c.children &&
							c.children.map((cat, i) => (
								<span
									draggable
									onClick={() => {
										handleSetCategory(cat._id)
										setDragged(null)
									}}
									data-id={cat._id}
									onPointerDown={e => handleDragStart(e, cat)}
									key={cat._id}
									className={`${styles.category} ${isDragging && styles.isDragging} ${c.children && c.children?.length > 0 ? styles.categoryChildren : ''} ${dragged?._id === cat._id ? styles.categoryDragging : ''}`}
									style={
										dragged?._id === cat._id && isDragging
											? {
													transform: `translateY(${position}px) scale(0.8)`,

													zIndex: 1000,
												}
											: {}
									}>
									{i + 1}. {cat.name}{' '}
									<button
										data-id={cat._id}
										className={styles.deleteCategory}
										onClick={() => handleDeleteCategory(cat._id)}>
										{catId === cat._id && <TrashSVG className={styles.trashSVG} />}
									</button>
								</span>
							))}
					</div>
				))}
			</div>
			{(errorMessage || successMessage) && (
				<APIResponseMessage messageType={successMessage ? 'success' : 'error'}>
					{errorMessage ? errorMessage : successMessage}
				</APIResponseMessage>
			)}
		</div>
	)
}

export default CategoriesList
