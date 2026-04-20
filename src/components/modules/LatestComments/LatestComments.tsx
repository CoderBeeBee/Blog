import createUrl from '../../../hooks/createUrl'
import type { latestCommentsTypes } from '../../../types/types'
import AnchorLink from '../../atoms/AnchorLink/AnchorLink'
import styles from './LatestComments.module.scss'

interface LatestCommentsProps {
	latestComments: latestCommentsTypes[]
}

const LatestComments = ({ latestComments }: LatestCommentsProps) => {
	return (
		<div className={styles.latestCommentsContainer}>
			<h3 className={styles.latestCommentsTitle}>Latest Comments</h3>

			{latestComments.map((com, index) => {
				const url = createUrl({ _id: com.postId, slug: com.seo.slug })
				return (
					<div key={index} className={styles.latestCommentsWrapper}>
						<div className={styles.latestCommentsImage}>
							<img src={com.avatar} alt="User" />
						</div>
						<div className={styles.latestCommentsInfo}>
							<span className={styles.latestCommentsAuthor}>{com.author}</span>
							<div className={styles.latestCommentsComment}>{com.comment}</div>
							<div className={styles.latestCommentsPost}>
								<span>Post :</span>
								<AnchorLink href={url} className={styles.latestCommentsPostTitle}>
									„{com.postTitle}”
								</AnchorLink>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default LatestComments
