import AnchorLink from '../components/atoms/AnchorLink/AnchorLink'
import createUrl from './createUrl'

interface notificationHelperProps {
	notif: {
		action: string
		role: string
		entityType: 'User' | 'Post' | 'Comment' | 'Like'
		name: string
		avatar: string
		createdAt: string
		changes: Record<string, string>
		categories?: string[]
		seo?: {
			slug: string
			metaTitle: string
			metaDescription: string
		}
	}
	className?: string
}
const notificationTemplates: Record<string, (title: string) => string> = {
	'New post': title => `New post „${title}” has been added`,
	'Post updated': title => `Post „${title}” has been updated`,
	'Post deleted': title => `Post „${title}” has been deleted`,
	'Post published': title => `New post „${title}” has been published`,
	'New comment': title => `New comment on post „${title}”`,
	'Comment updated': title => `Updated comment in post „${title}”`,
	'Comment deleted': title => `Comment removed from post „${title}”`,
	'Post liked': title => `New post like: „${title}”`,
	'Post unliked': title => `Unliked post: „${title}”`,
}

const renderNotification = (action: string, title?: string, url?: string, className?: string) => {
	if (!title) return action

	const template = notificationTemplates[action]
	if (!template) return action

	const text = template(title)

	const [before, after] = text.split(`„${title}”`)

	return (
		<>
			{before}„
			<AnchorLink className={className} href={url ?? '#'}>
				{title}
			</AnchorLink>
			”{after}
		</>
	)
}

const notificationHelper = ({ notif, className }: notificationHelperProps) => {
	const title = notif.changes?.postTitle
	const postId = notif.changes?.postId
	const url =
		postId && notif.categories && notif.seo
			? createUrl({
					_id: postId,
					slug: notif.seo.slug,
				})
			: '#'

	return renderNotification(notif.action as string, title, url, className)
}

const timeAgo = ({ createdAt }: { createdAt: string }) => {
	const currentTime = Date.now()
	const createdTime = new Date(createdAt).getTime()
	const diffTime = currentTime - createdTime

	const seconds = Math.floor(diffTime / 1000)
	const minutes = Math.floor(seconds / 60)
	const hours = Math.floor(minutes / 60)
	const days = Math.floor(hours / 24)

	let timeAgo = ''
	if (seconds < 60) {
		timeAgo = `${seconds} s ago`
	} else if (minutes < 60) {
		timeAgo = `${minutes} min ago`
	} else if (hours < 24) {
		timeAgo = `${hours} hr ago`
	} else if (days < 7) {
		timeAgo = `${days} d ago`
	} else if (days < 14) {
		timeAgo = 'Last week'
	} else {
		timeAgo = `${new Date(createdAt).toLocaleDateString()}`
	}

	return timeAgo
}

export { notificationHelper, timeAgo }
