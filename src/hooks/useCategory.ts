import { useEffect, useState } from 'react'
import { useDeleteCategoryMutation, useFetchCategoryToEditQuery } from '../slices/api/categoriesApi'
import { useLocation } from 'react-router'

const useCategory = () => {
	const { pathname } = useLocation()
	const [catId, setCatId] = useState<string>('')
	const [successDeleteMessage, setSuccessDeleteMessage] = useState<string>('')
	const [deleteCategory] = useDeleteCategoryMutation()
	const { data: editCategory } = useFetchCategoryToEditQuery(catId, { skip: !catId })

	const handleSetCategory = (id: string) => {
		if (catId === id) {
			setCatId('')
		} else {
			setCatId(id)
		}
	}
	const handleDeleteCategory = async (id: string) => {
		try {
			if (!id) return

			const res = await deleteCategory(id).unwrap()
			
			if (res) {
				setSuccessDeleteMessage(res.message)
			}
		} catch (error) {
			console.log(error)
		}
	}
	useEffect(() => {
		if (!pathname.includes('categories')) {
			setCatId('')
		}
	}, [pathname])
	return { catId, handleSetCategory, editCategory, handleDeleteCategory, successDeleteMessage }
}

export { useCategory }
