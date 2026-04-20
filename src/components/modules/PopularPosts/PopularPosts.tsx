import styles from './PopularPosts.module.scss'

import { CommentsSVG, HeartSVG, ViewsSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import AnchorLink from '../../atoms/AnchorLink/AnchorLink'

import createUrl from '../../../hooks/createUrl'
import type { TopRatedStatsTypes } from '../../../types/types'
import CreateButton from '../../atoms/CreateButton/CreateButton'

interface PopularPostsProps {
	topRated: TopRatedStatsTypes[]
}

const PopularPosts = ({ topRated }: PopularPostsProps) => {
	return (
		<div className={styles.popularPostsContainer}>
			<div className={styles.popularPostHeader}>
				<h3 className={styles.popularPostsContainerTitle}>Popular Posts</h3>

				<CreateButton href="/admin/blog/addpost" ariaLabel="Create new post" className={styles.createNewPost} />
			</div>
			{topRated?.map((post, index) => {
				const url = createUrl({ slug: post.seo.slug, _id: post.postId })

				return (
					<div key={index} className={styles.popularPostWrapper}>
						<div className={styles.popularPostImageBox}>
							<img src={post.image} alt="" />
						</div>
						<div className={styles.popularPostInfo}>
							<AnchorLink href={url} className={styles.popularPostInfoTitle}>
								„{post.title}”
							</AnchorLink>

							<div className={styles.popularPostStatsBox}>
								<div className={styles.popularPostStats}>
									<div className={styles.popularViewsSVG}>
										<ViewsSVG className={styles.showViews} />
									</div>
									<span>{post.totalViews} Views</span>
								</div>
								<div className={styles.popularPostStats}>
									<div className={styles.popularViewsSVG}>
										<HeartSVG className={styles.heartSVG} />
									</div>
									<span>{post.postlikes} Likes</span>
								</div>
								<div className={styles.popularPostStats}>
									<div className={styles.popularViewsSVG}>
										<CommentsSVG className={styles.commentsSvg} />
									</div>
									<span>{post.commentsCount} Comments</span>
								</div>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default PopularPosts
