import { usePostContext } from '../../../hooks/usePostContext'

interface ArticleLefSideProps {
	styles: { [key: string]: string }
}

const ArticleLeftSide = ({ styles }: ArticleLefSideProps) => {
	const { author, categories, tags } = usePostContext()

	return (
		<div className={styles.articleLeftSideContainer}>
			<div className={styles.authorContent}>
				<div className={styles.authorAvatar}>
					<img src={author.avatar.src} alt={`Author's photo`} />
				</div>
				<div className={styles.byline}>
					<span>Posted By</span>
					<a href="#">{author.name}</a>
				</div>
			</div>
			<div className={styles.metaBottom}>
				<div className={styles.metaInfo}>
					<div className={styles.catLinks}>
						<p>In </p>
						{categories.map((item, index) => (
							<a key={index} href={`/categories/${item.split(' ').join('-').toLowerCase()}`}>
								{item} 
							</a>
						))}
					</div>
					<div className={styles.onInfo}>
						<p>On</p>
						<span>{new Date(author.createdAt).toLocaleDateString('en-GB')}</span>
					</div>
					<div className={styles.tagsInfo}>
						<p>Tags</p>
						{tags.map((tag, index) => (
							<span key={index}>{tag}</span>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ArticleLeftSide
