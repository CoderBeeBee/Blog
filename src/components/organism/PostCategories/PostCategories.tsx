import styles from './PostCategories.module.scss'
import { useDeleteCategoryMutation, useFetchAllCategoriesQuery } from '../../../slices/api/categoriesApi'
import { CloseSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import type { MouseEvent } from 'react'
import WrapperBox from '../../atoms/WrapperBox/WrapperBox'

const PostCategories = () => {
	const { data } = useFetchAllCategoriesQuery()
	const [deleteCategory] = useDeleteCategoryMutation()
	const handleDeleteCategory = async (e: MouseEvent<HTMLSpanElement>) => {
		const target = e.currentTarget as HTMLSpanElement
		const categoryId = target.dataset.id

		try {
			if (!categoryId) return
			const res = await deleteCategory(categoryId)
			console.log(res)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className={styles.postCategoriesWrapper}>
			<WrapperBox>
			<p className={styles.postCategoriesTitle}>Category List</p>
				<div className={styles.postCategoriesList}>
					{data?.map(c => (
						<span key={c._id} className={styles.postCategory}>
							{c.name}{' '}
							<span data-id={c._id} className={styles.deletePostCategory} onClick={e => handleDeleteCategory(e)}>
								<CloseSVG className={styles.closeSVG} />
							</span>
						</span>
					))}
				</div>
			</WrapperBox>
		</div>
	)
}

export default PostCategories
