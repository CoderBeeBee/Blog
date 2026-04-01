import AddTagsForm from '../../../../organism/AddTagsForm/AddTagsForm'
import PostTags from '../../../../organism/PostTags/PostTags'
import styles from './PostTagsTemplate.module.scss'

const PostTagsTemplate = () => {
	return (
		<div className={styles.postTagsContainer}>
			<AddTagsForm />
			<PostTags />
		</div>
	)
}

export default PostTagsTemplate
