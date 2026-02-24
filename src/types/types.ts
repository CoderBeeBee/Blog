import type { JSX, ReactNode } from 'react'

export interface Size {
	width: number
	height: number
}

// export type MenuElement = (data: MenuTypes, id: number, key: number) => JSX.Element

export interface SearchProps {
	isOpen?: boolean
	handleIsOpen?: () => void
}

export type SocialProps = {
	name?: string
	url: string
	icon: ReactNode
	ariaLabel?: string | undefined
}

export interface ArticleContentProps {
	_id: string
	title: string
	introduction: string
	mainImage: { src: string; alt: string; caption: string; public_id?: string }
	author: { name: string; avatar: { src: string; public_id: string } }
	articleContent?: [
		{ type: 'title' | 'text' | 'completion' | 'callToAction' | 'add'; value: string },

		{ type: 'image'; value: { src: string; alt: string; caption: string } },
	]
	categories: string[]
	id?: string
	seo?: { slug: string; metaTitle: string; metaDescription: string }
	status?: string
	href?: string
	left?: string
	top?: string
	articleRef?: React.Ref<HTMLElement>
	styles?: { [key: string]: string }
	onImageLoad?: () => void
}

export type ExtendedArticleContentProps = {
	createdAt: string
	publishedAt: string
	postViews: string
	commentsCount: string
} & ArticleContentProps

export interface CommentsDataProps {
	_id: string
	postId: string | null
	parentId: string | null
	author: {
		_id: string
		name: string
		avatar: {
			src: string
			public_id: string
		}
	}
	status?: string
	deletedAt?: null
	comment: string
	createdAt: string
	children?: CommentsDataProps[]
}

export interface sideBarLinksProps {
	title: string
	icon?: ReactNode
	href: string
	children?: sideBarLinksProps[]
}

export interface UsersProps {
	_id: string
	name: string
	email: string
	avatar: {
		src: string
		public_id: string
	}
	role: string
	isVerified: boolean
	createdAt: string
	updatedAt: string
	commentsCount: number
	postCount?: number
	lastLogin: string
	lastLogout: string
}
export interface UserProps {
	name: string
	email: string
	avatar: {
		src: string
		public_id: string
	}
	role: string
}
export interface CommentsProps {
	_id: string
	comment: string
	createdAt: string
	title: string
	postId: string
	categories: string[]
	author: {
		_id: string
		name: string
	}
	seo?: { slug: string; metaTitle: string; metaDescription: string }
}

export interface CategoryProps {
	name: string
	slug: string
	_id: string
	id: string
}
export interface StatCardProps {
	title: string
	stats: Stat
	icon: JSX.Element
	style: string
}
export interface Stat {
	total: number
	lastSeven: number
	lastThirty: number
	growthSeven: number
	growthThirty: number
}

export interface TopRatedStatsTypes {
	categories: string[]
	postId: string
	title: string
	totalViews: number
	commentsCount: number
	postlikes: number
	image: string
	seo: {
		slug: string
		metaDescription: string
		metaTitle: string
	}
}

export interface NotificationsTypes {
	action: string
	role: string
	entityType: 'User' | 'Post' | 'Comment' | 'Like'
	name: string
	avatar: string
	createdAt: string
	changes: Record<string, string>
}

export interface latestCommentsTypes {
	comment: string
	author: string
	avatar: string
	postTitle: string
	postId: string
	categories: string[]
	seo: { slug: string; metaTitle: string; metaDescription: string }
}
export interface FullStatsTypes {
	commentsStats: Stat
	postsStats: Stat
	usersStats: Stat
	likesStats: Stat
	pageViews: Stat
	chartStats: { today: number; increase: number }
	dayStats: { date: string; views: number }[]
	topRated: TopRatedStatsTypes[]
	notifications: NotificationsTypes[]
	latestComments: latestCommentsTypes[]
}

export const MobileMenuState = {
	CLOSED: 'CLOSED',
	OPENING: 'OPENING',
	OPEN: 'OPEN',
	CLOSING: 'CLOSING',
} as const
export type MobileMenuTypes = (typeof MobileMenuState)[keyof typeof MobileMenuState]
