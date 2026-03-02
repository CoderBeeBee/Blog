import AddCategoryForm from '../../../../organism/AddCategoryForm/AddCategoryForm'
import AddTagsForm from '../../../../organism/AddTagsForm/AddTagsForm'
import PostCategories from '../../../../organism/PostCategories/PostCategories'
import PostTags from '../../../../organism/PostTags/PostTags'
import styles from './PostCategoryTagTemplate.module.scss'

const PostCategoryTagTemplate = () => {
	return (
		<div className={styles.postCategoryTagContainer}>
			<AddCategoryForm />
			<PostCategories />
			<AddTagsForm />
			<PostTags />
		</div>
	)
}

export default PostCategoryTagTemplate
