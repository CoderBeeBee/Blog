import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	type Dispatch,
	type MouseEvent,
	type SetStateAction,
} from 'react'
import Article from '../../atoms/MasonryArticle/Article'
import styles from './PostsContent.module.scss'
import type { ArticleContentProps } from '../../../types/types'
import Aos from 'aos'
import { useLocation } from 'react-router'
import useGlobalContext from '../../../hooks/useGlobalContext'
import GoogleAds from '../../modules/GoogleAdds/GoogleAds'

interface PostsContentProps {
	currentPage: number
	setCurrentPage: Dispatch<SetStateAction<number>>
	data: {
		posts: ArticleContentProps[]
		totalPages: number
	}
}
type ArticleBlock =
	| ArticleContentProps
	| { type: 'ad'; client: string; slot: string; left?: string; top?: string; height?: string }

const PostsContent = ({ data, currentPage, setCurrentPage }: PostsContentProps) => {
	const { ads, navRef } = useGlobalContext()
	const enableAds = ads?.slots?.postsSection?.enableAd

	const [width, setWidth] = useState<number>(0)
	const [columns, setColumns] = useState<number>(0)

	const sectionRef = useRef<HTMLElement>(null)
	const articleRef = useRef<(HTMLElement | null)[]>([])
	const [wrapperHeight, setWrapperHeight] = useState<number | null>(null)
	const heightsCache = useRef<number[]>([])
	const [styledPostData, setStyledPostData] = useState<ArticleBlock[]>([])

	const { pathname } = useLocation()
	const { posts, totalPages = 1 } = { ...data }
	const isDev = import.meta.env.VITE_NODE_ENV === 'development'

	const slot = ''

	const paginationButtons = useMemo(() => {
		const buttons: (number | string)[] = []

		buttons.push(1)

		if (currentPage > 4) buttons.push('...')

		const start = Math.max(2, currentPage - 1)
		const end = Math.min(totalPages - 1, currentPage + 1)

		for (let i = start; i <= end; i++) buttons.push(i)

		if (currentPage < totalPages - 2) buttons.push('...')

		if (totalPages > 1) buttons.push(totalPages)

		return buttons
	}, [currentPage, totalPages])

	const handlePageChange = (e: MouseEvent<HTMLButtonElement>) => {
		const target = e.target as HTMLButtonElement
		const direction = target.dataset.direction

		if (direction === 'prev' && currentPage > 1) {
			setCurrentPage(prev => prev - 1)
		}
		if (direction === 'next' && currentPage < totalPages) {
			setCurrentPage(prev => prev + 1)
		}
		scrollSection()
	}

	const handleSetPage = (e: MouseEvent<HTMLButtonElement>) => {
		const target = e.target as HTMLButtonElement
		const value = target.textContent

		if (value === '...') return

		const page = +value!
		if (currentPage === page) return
		setCurrentPage(page)

		scrollSection()
	}

	useEffect(() => {
		const handleResize = () => {
			const w = window.innerWidth
			setWidth(w)

			if (w > 1400) setColumns(4)
			else if (w > 1100) setColumns(3)
			else if (w > 700) setColumns(2)
			else setColumns(1)
		}

		handleResize()

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])
	const percent = useMemo(() => Math.floor(100 / columns), [columns])

	const articleWithAds = useMemo<ArticleBlock[]>(() => {
		if (!posts) return []

		return enableAds
			? posts.flatMap((block, index) => {
					return (index + 1) % 5 === 0
						? [
								block,
								{
									type: 'ad',
									client: ads.client,
									slot: isDev ? '6300978111' : slot,
								},
							]
						: [block]
				})
			: posts
	}, [ads?.client, enableAds, isDev, posts])

	const recalcGrid = useCallback(() => {
		if (!posts) return

		if (posts.length === 0) {
			setStyledPostData([])
			setWrapperHeight(0)
			return
		}

		const columnHeights = new Array(columns).fill(0)

		const updated = articleWithAds.map((post: ArticleBlock, index: number) => {
			const col = index % columns
			// const col = columnHeights.indexOf(Math.min(...columnHeights))
			// const height = heightsCache.current[index]
			const height = 'type' in post ? heightsCache.current[0] : (heightsCache.current[index] ?? 0)

			const top = columnHeights[col]
			columnHeights[col] += height

			const left = `${col * percent}%`

			return { ...post, top: `${top}px`, left, height: `${height}px` }
		})
		setStyledPostData(updated)

		if (columnHeights.length > 0) {
			const heightCol = Math.max(...columnHeights)

			setWrapperHeight(heightCol)
		}
	}, [articleWithAds, columns, percent, posts])

	useLayoutEffect(() => {
		recalcGrid()

		const observer = new ResizeObserver(elements => {
			elements.forEach(el => {
				const target = el.target as HTMLElement
				const index = articleRef.current.indexOf(target)

				if (index === -1) return

				heightsCache.current[index] = Math.floor(el.borderBoxSize[0].blockSize) || target.offsetHeight
			})
			recalcGrid()
		})

		articleRef.current.forEach(el => {
			if (el) observer.observe(el)
		})

		return () => {
			observer.disconnect()
		}
	}, [columns, percent, width, data, posts, recalcGrid])

	const handleImageLoad = (index: number) => {
		const el = articleRef.current[index]
		if (!el) return

		heightsCache.current[index] = el.offsetHeight
		recalcGrid()
	}

	const scrollSection = () => {
		if (pathname.startsWith('/categories')) {
			window.scrollTo({ top: 0, behavior: 'smooth' })
		} else {
			if (!sectionRef.current || !navRef.current) return
			window.scrollTo({
				behavior: 'smooth',
				top: sectionRef.current?.offsetTop - navRef?.current?.offsetHeight || 60,
			})
		}
	}

	useEffect(() => {
		Aos.init({
			duration: 600,
			once: false,
		})
	}, [])
	useEffect(() => {
		Aos.refresh()
	}, [columns, percent, width, styledPostData])
	return (
		<section ref={sectionRef} className={styles.postsContainer}>
			<div className={styles.articleContainer}>
				<div className={styles.articleWrapper} style={{ height: `${wrapperHeight}px` }}>
					<div className={styles.lines}>
						<span></span>
						<span></span>
						<span></span>
					</div>

					{styledPostData.map((item: ArticleBlock, index: number) => {
						if ('type' in item && item.type === 'ad' && item.left && item.top && wrapperHeight) {
							return (
								<GoogleAds
									style={{ position: 'absolute', left: item.left, top: item.top }}
									className={styles.articleAdd}
									key={pathname + index}
									client={item.client}
									slot={item.slot}
								/>
							)
						} else if ('mainImage' in item) {
							return (
								<Article
									onImageLoad={() => handleImageLoad(index)}
									articleRef={el => {
										articleRef.current[index] = el
									}}
									_id={item._id}
									key={item._id}
									mainImage={item.mainImage}
									title={item.title}
									categories={item.categories}
									author={item.author}
									introduction={item.introduction}
									left={item.left}
									top={item.top}
									seo={item.seo}
								/>
							)
						}
					})}
				</div>
			</div>

			<div className={styles.paginationContainer}>
				<button
					type="button"
					data-direction="prev"
					aria-label="Previous Page"
					className={`${styles.controlBtn} ${styles.paginationBtn}`}
					onClick={e => handlePageChange(e)}>
					Prev
				</button>
				<div className={styles.paginationButtons}>
					{paginationButtons.map((btn, index) => {
						return (
							<button
								type="button"
								key={index}
								aria-label={`Page ${btn}`}
								onClick={e => handleSetPage(e)}
								className={`${styles.paginationBtn} ${styles.paginationNumber} ${
									currentPage === btn ? styles.btnActive : ''
								}`}>
								{btn}
							</button>
						)
					})}
				</div>
				<button
					type="button"
					data-direction="next"
					aria-label="Next Page"
					className={`${styles.controlBtn} ${styles.paginationBtn}`}
					onClick={e => handlePageChange(e)}>
					Next
				</button>
			</div>
		</section>
	)
}

export default PostsContent
