import { usePostContext } from '../../../hooks/usePostContext'
import ArticleLeftSide from '../../atoms/ArticleLeftSide/ArticleLeftSide'
import ArticleMiddleSide from '../../atoms/ArticleMiddleSide/ArticleMiddleSide'
import ArticleRightSide from '../../atoms/ArticleRightSide/ArticleRightSide'
import ResponsiveArticleImage from '../../atoms/ResponsiveArticleImage/ResponsiveArticleImage'
import styles from './ArticleContent.module.scss'

const ArticleContent = () => {
	const { mainImage, title } = usePostContext()
	return (
		<article className={styles.articleContainer}>
			
			<div className={styles.imageContainer}>
				<ResponsiveArticleImage mainImageSrc={mainImage.src} imageAlt={mainImage.alt} className={styles.image} />
			</div>
			<div className={styles.headerContainer}>
				<h1 className={styles.headerTitle}>{title}</h1>
			</div>
			

			<div className={`${styles.articleTextContainer} row`}>
				<ArticleLeftSide />
				<ArticleMiddleSide />
				<ArticleRightSide  />
			</div>
		</article>
	)
}

export default ArticleContent
