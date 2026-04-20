import useResponsiveCloudinaryImage from '../../../hooks/useResponsiveCloudinaryImage'
import type { ArticleContentProps } from '../../../types/types'
import AnchorLink from '../AnchorLink/AnchorLink'
import createUrl from '../../../hooks/createUrl'

interface SliderListProps {
	styles: { [key: string]: string }
	data: ArticleContentProps
	index: number
	number: number
}

const SliderList = ({ styles, data, index, number }: SliderListProps) => {
	const mainImageSrc = data.mainImage.src
	const responsiveImage = useResponsiveCloudinaryImage({ mainImageSrc })

	
	const url = createUrl({ slug: data.seo?.slug, _id: data._id })
	
	const isActive = number === index

	return (
		<div className={styles.heroSlide}>
			<div
				style={{ opacity: isActive ? 1 : 0, zIndex: isActive ? 999 : 998, left: `${index * -100}%` }}
				data-slick-index={index}
				className={`${styles.heroSlideBox}  `}>
				<div className={styles.heroImageWrapper}>
					<img
						loading={index === 0 ? 'eager' : 'lazy'}
						src={responsiveImage}
						fetchPriority={index === 0 ? 'high' : 'auto'}
						alt={data.mainImage.alt}
					/>
				</div>
				<div className={`row ${styles.heroContent} ${number === index ? styles.animated : ''}`}>
					<div className={styles.heroText}>
						<h1 className={styles.heroTitle}>
							<AnchorLink href={url}>{data.title}</AnchorLink>
							
						</h1>
						<div className={styles.heroMeta}>
							<span className={styles.heroCategories}>
								{data.categories.map((item, index) => {
									const slug = item.split(' ').join('-').toLowerCase()
									const url = `/categories/${slug}`

									return (
										<AnchorLink key={index} href={`${url}`}>
											{item}
										</AnchorLink>
									)
								})}
							</span>
							<span className={styles.heroPostedBy}>
								Posted by <span className={styles.heroAuthor}>{data.author.name}</span>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SliderList
