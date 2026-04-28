import type { JSX, ReactNode } from 'react'
import type { categoryTypes } from './categoriesSchema'

export interface Size {
	width: number
	height: number
}

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
	mainImage: { src: string; alt: string; description: string; public_id?: string }
	author: { name: string; avatar: { src: string; public_id: string }; createdAt: string }
	articleContent?: [
		{ type: 'text' | 'add'; value: string },

		{ type: 'image'; value: { src: string; alt: string; description: string } },
	]
	categories: string[]
	tags?: string[]
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
	scheduledAt: string
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

export type CategoryProps = {
	_id: string
	children?: CategoryProps[]
} & categoryTypes
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

export interface attemptsProps {
	_id: string
	action: string
	result: string
	user: Record<string, string>
	createdAt: string
	ipAddress: string
	location: string
	userAgent: {
		device: string
		os: string
		browser: string
	}
	source: string
	metadata?: Record<string, string>
}
export interface auditlogsProps {
	_id: string
	action: string
	performedBy: string
	createdAt: string
	role: string
	changes: Record<string, string>
	source: string
	metadata?: Record<string, string>
}
