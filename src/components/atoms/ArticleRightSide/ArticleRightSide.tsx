import { useLocation } from 'react-router'
import { useFetchPostCreatedAtQuery } from '../../../slices/api/postApi'
import AnchorLink from '../AnchorLink/AnchorLink'
import createUrl from '../../../hooks/createUrl'
interface ArticleRightSideProps {
	styles: { [key: string]: string }
}

const ArticleRightSide = ({ styles }: ArticleRightSideProps) => {
	const { search } = useLocation()
	const query = new URLSearchParams(search)
	const postId = query.get('id')
	const { data } = useFetchPostCreatedAtQuery(postId)

	if (!data) return

	const { prevPost, nextPost } = data

	const prevID = prevPost?._id || postId
	const nextID = nextPost?._id || postId

	const urlPrev = createUrl({ slug: prevPost?.seo.slug, _id: prevID })
	const urlNext = createUrl({ slug: nextPost?.seo.slug, _id: nextID })

	return (
		<div className={styles.articleRightSideContainer}>
			<div className={`${styles.prev} ${prevID === postId ? styles.disabled : ''} `}>
				<span>Previous</span>
				<AnchorLink href={urlPrev} rel="prev">
					{prevID !== postId ? prevPost?.title : '-----'}
				</AnchorLink>
				
			</div>
			<div className={`${styles.next} ${nextID === postId ? styles.disabled : ''}`}>
				<span>Next</span>
				<AnchorLink href={urlNext} rel="next">
					{nextID !== postId ? nextPost?.title : '-----'}
				</AnchorLink>
				
			</div>
		</div>
	)
}

export default ArticleRightSide
