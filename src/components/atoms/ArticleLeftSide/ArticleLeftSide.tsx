import { usePostContext } from '../../../hooks/usePostContext'
import styles from './ArticleLeftSide.module.scss'

const ArticleLeftSide = () => {
	const { author, tags, publishedAt } = usePostContext()

	return (
		<div className={styles.articleLeftSideContainer}>
			<div className={styles.authorContent}>
				<div className={styles.authorAvatar}>
					<img src={author.avatar.src} alt={`Author's photo`} />
				</div>
				<div>
					<div className={styles.byline}>
						<span>By</span>
						<a href="#">{author.name}</a>
					</div>
					<div className={styles.publishedInfo}>
						<span>{new Date(publishedAt).toLocaleDateString('pl-PL')}</span>
					</div>
				</div>
			</div>
			<div className={styles.metaBottom}>
				<div className={styles.metaInfo}>
					<div className={styles.tagsInfo}>
						<p>Tags:</p>
						{tags?.map((tag, index) => (
							<span key={index}>{tag}</span>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ArticleLeftSide
