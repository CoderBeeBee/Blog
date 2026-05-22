import type { JSX } from 'react'
import {
	CalendarSVG,
	CommentsSVG,
	HeartSVG,
	PostsSVG,
	TagSVG,
	UsersSVG,
} from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'

import styles from './Notifications.module.scss'

import type { NotificationsTypes } from '../../../types/types'
import { notificationHelper, timeAgo } from '../../../hooks/notificationHelper'

type EntityType = 'User' | 'Post' | 'Comment' | 'Like' | 'Tag'

interface NotificationsProps {
	notifications: NotificationsTypes[]
}

const Notifications = ({ notifications }: NotificationsProps) => {
	return (
		<div className={styles.notificationsContainer}>
			<h3 className={styles.notificationsTitle}>Notifications</h3>

			{notifications.map((notif, index) => {
				
				const iconsMap: Record<EntityType, JSX.Element> = {
					User: <UsersSVG className={styles.user} />,
					Post: <PostsSVG className={styles.post} />,
					Comment: <CommentsSVG className={styles.comment} />,
					Like: <HeartSVG className={styles.like} />,
					Tag: <TagSVG className={styles.tag} />,
				}

				const icon = iconsMap[notif.entityType]

				return (
					<div key={index} className={styles.notificationsWrapper}>
						<div className={styles.notificationsImages}>
							<div className={`${styles.notificationsIcon} ${styles[notif.entityType]}`}>{icon}</div>
							<div className={styles.notificationsAvatar}>
								<img src={notif.avatar} alt="User" />
							</div>
						</div>

						<div className={styles.notificationsInfo}>
							<span className={styles.notificationAuthor}>{notif.name}</span>
							<p className={styles.notificationsAction}>
								{notificationHelper({ notif, className: styles.notifActionURL })}
							</p>
						</div>
						<div className={styles.notificationsDate}>
							<CalendarSVG />
							<span className={styles.date}>{timeAgo({ createdAt: notif.createdAt })}</span>
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default Notifications
