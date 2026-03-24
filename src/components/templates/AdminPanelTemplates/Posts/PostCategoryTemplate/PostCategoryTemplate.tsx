import AddCategoryForm from '../../../../organism/AddCategoryForm/AddCategoryForm'

import PostCategories from '../../../../organism/PostCategories/PostCategories'

import styles from './PostCategoryTemplate.module.scss'

const PostCategoryTagTemplate = () => {
	return (
		<div className={styles.postCategoryContainer}>
			<AddCategoryForm />
			<PostCategories />
			
		</div>
	)
}

export default PostCategoryTagTemplate
