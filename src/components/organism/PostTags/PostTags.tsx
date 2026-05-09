import styles from './PostTags.module.scss'

import AddTagsForm from '../../modules/AddTagsForm/AddTagsForm'
import PostTagsList from '../../modules/PostTagsList/PostTagsList'
import Breadcrumbs from '../../atoms/Breadcrumbs/Breadcrumbs'

const PostTags = () => {
	return (
		<div className={styles.tagsWrapper}>
			<Breadcrumbs />
			<AddTagsForm />

			<PostTagsList />
		</div>
	)
}

export default PostTags
