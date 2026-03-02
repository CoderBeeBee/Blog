import styles from './PostTags.module.scss'
import type { MouseEvent } from 'react'
import { useDeleteTagMutation, useFetchAllTagsQuery } from '../../../slices/api/tagsApi'
import WrapperBox from '../../atoms/WrapperBox/WrapperBox'
import { CloseSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'

const PostTags = () => {
	const { data } = useFetchAllTagsQuery()
	const [deleteTag] = useDeleteTagMutation()
	const handleDeleteTag = async (e: MouseEvent<HTMLSpanElement>) => {
		const target = e.currentTarget as HTMLSpanElement
		const tagId = target.dataset.id

		try {
			if (!tagId) return
			await deleteTag(tagId)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className={styles.tagsWrapper}>
			<WrapperBox>
				<p className={styles.tagsTitle}>Tag List</p>
				<div className={styles.tagsList}>
					{data?.map(tag => (
						<span key={tag._id} className={styles.postTag}>
							{tag.name}{' '}
							<span data-id={tag._id} className={styles.deleteTag} onClick={e => handleDeleteTag(e)}>
								<CloseSVG className={styles.closeSVG} />
							</span>
						</span>
					))}
				</div>
			</WrapperBox>
		</div>
	)
}

export default PostTags
