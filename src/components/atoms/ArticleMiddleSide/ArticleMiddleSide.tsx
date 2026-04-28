import { useLocation } from 'react-router'
import { CommentsSVG, HeartSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import { usePostContext } from '../../../hooks/usePostContext'
import { useFetchLiveCommentsQuery } from '../../../slices/api/commentsApi'
import ResponsiveArticleImage from '../ResponsiveArticleImage/ResponsiveArticleImage'
import {
	useFetchLivePostLikesQuery,
	useFetchUserLikedPostQuery,
	useToogleLikePostMutation,
} from '../../../slices/api/postLikeApi'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../store'
import { useEffect, useMemo, useState } from 'react'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import GoogleAds from '../../modules/GoogleAdds/GoogleAds'
import useGlobalContext from '../../../hooks/useGlobalContext'
interface ArticleMiddleSideProps {
	styles: { [key: string]: string }
}

type ArticleBlock =
	| { type: 'text' | 'add'; value: string; client?: string; slot?: string }
	| { type: 'image'; value: { src: string; alt: string; description: string } }

const ArticleMiddleSide = ({ styles }: ArticleMiddleSideProps) => {
	const isDev = import.meta.env.VITE_NODE_ENV === 'development'

	const slot = ''
	const { articleContent, introduction } = usePostContext()
	const [likeMessage, setLikeMessage] = useState<string>('')
	const { search, pathname } = useLocation()

	const params = new URLSearchParams(search)
	const postId = params.get('id')
	const { id, isLogged } = useSelector((state: RootState) => state.auth)

	const { data } = useFetchLiveCommentsQuery(postId!, { skip: !postId })
	const [likePost, { error }] = useToogleLikePostMutation()
	const { data: likedPost } = useFetchUserLikedPostQuery({ postId, userId: id }, { skip: !isLogged || !postId || !id })

	const { data: postLikes } = useFetchLivePostLikesQuery(postId!, { skip: !postId })
	const { ads } = useGlobalContext()
	
	const articleWithAds = useMemo<ArticleBlock[]>(() => {
		if (!articleContent) return []

		return articleContent.flatMap((block, index) => {
			return (index + 1) % 4 === 0
				? [
						block,
						{
							type: 'add',
							value: 'ad-slot-1',
							client: ads.client,
							slot: isDev ? '6300978111' : slot,
						},
					]
				: [block]
		})
	}, [ads.client, articleContent, isDev])

	const handleSetLike = async () => {
		if (!postId) return

		if (!isLogged) {
			setLikeMessage('You must log in')
			return
		}

		await likePost(postId)
	}

	useEffect(() => {
		if (error && typeof error === 'object' && error !== null) {
			const fetchError = error as FetchBaseQueryError
			const errorMessage =
				fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data
					? (fetchError.data.message as string)
					: 'An unexpected error has occured'
			setLikeMessage(errorMessage)
		}
	}, [error])

	useEffect(() => {
		if (likeMessage) {
			const timer = setTimeout(() => {
				setLikeMessage('')
			}, 3000)

			return () => clearTimeout(timer)
		}
	}, [likeMessage])

	return (
		<div className={styles.articleMiddleSideContainer}>
			<ReactMarkdown remarkPlugins={[remarkGfm]}>{introduction}</ReactMarkdown>
			<div className={styles.articleContentContainer}>
				<div className={styles.articleContent}>
					{articleWithAds.map((item: ArticleBlock, index: number) => {
						if (item.type === 'text') {
							return (
								<ReactMarkdown key={index} remarkPlugins={[remarkGfm]}>
									{item.value}
								</ReactMarkdown>
							)
						}

						if (item.type === 'add') {
							return ads.slots.singlePost.enableAd ? (
								<GoogleAds className={styles.articleAdd} key={pathname + index} client={item.client} slot={item.slot} />
							) : null
								
							
						}
						if (item.type === 'image') {
							return (
								<div key={index} className={styles.articleImage}>
									<ResponsiveArticleImage mainImageSrc={item.value.src} imageAlt={item.value.alt} />

									<span className={styles.articleImageText}>{item.value.description}</span>
								</div>
							)
						}

						return null
					})}
				</div>
			</div>

			<div className={styles.articleReactionsBox}>
				<div className={styles.articleReactionsInfo}>
					<span className={styles.articleLikes}>
						<button
							type="button"
							aria-label="Like button"
							title="Like Button"
							onClick={() => handleSetLike()}
							className={styles.articleSVG}>
							<HeartSVG className={`${styles.articleLikeSVG} ${likedPost?.userId === id ? styles.liked : ''}`} />
						</button>
						<span className={styles.reactionText}>
							{postLikes && postLikes > 0
								? postLikes === 1
									? `${postLikes} Like`
									: `${postLikes} Likes`
								: `${postLikes} Likes`}
						</span>
					</span>
					<span className={styles.articleComments}>
						<span className={styles.articleSVG}>
							<CommentsSVG className={styles.articleCommentSVG} />
						</span>
						<span className={styles.reactionText}>
							{data && data.length > 0
								? data?.length === 1
									? `${data?.length} Comment`
									: `${data?.length} Comments`
								: `${data?.length} Comments`}
						</span>
					</span>
				</div>
				{likeMessage && <span className={styles.articleLikeMessage}>{likeMessage}</span>}
			</div>
		</div>
	)
}

export default ArticleMiddleSide
