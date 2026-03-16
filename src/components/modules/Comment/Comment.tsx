import { useEffect, useRef, useState, type MouseEvent } from 'react'
import type { CommentsDataProps } from '../../../types/types'
import styles from './Comment.module.scss'
import TextArea from '../../atoms/TextArea/TextArea'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../store'
import AnchorLink from '../../atoms/AnchorLink/AnchorLink'

import { useDeleteCommentMutation } from '../../../slices/api/commentsApi'

const Comment = ({ _id, postId, parentId, author, comment, createdAt, children }: CommentsDataProps) => {
	const { role } = useSelector((state: RootState) => state.auth)
	const comRef = useRef<HTMLDivElement | null>(null)
	const { isLogged, id } = useSelector((state: RootState) => state.auth)
	const [showReply, setShowReply] = useState<boolean>(false)
	const [isUpdating, setIsUpdating] = useState<boolean>(false)
	const [updatingText, setUpdatingText] = useState<string | null | undefined>('')
	// const [resMessage, setResMessage] = useState<string>('')
	
	const [deleteComment] = useDeleteCommentMutation()
	const aRef = useRef<HTMLAnchorElement | null>(null)
	const crudRef = useRef<HTMLDivElement | null>(null)
	const textRef = useRef<HTMLDivElement | null>(null)
	const authorPost = id === author._id
	
	const handleReply = (e: MouseEvent<HTMLButtonElement>) => {
		const target = e.target as HTMLButtonElement
		const logIn = target.nextElementSibling

		const crud = document.querySelectorAll(`.${styles.deleteUpdateBtns}`)

		if (crud) {
			crud.forEach(item => item.classList.remove(styles.showCrud))
		}

		if (!isLogged) {
			if (logIn) logIn.classList.add(styles.commentLogInShow)
		} else {
			setShowReply(true)
		}
	}
	const handleShowCrud = (e: MouseEvent<HTMLSpanElement>) => {
		const target = e.target as HTMLSpanElement

		const sibling = target.nextElementSibling

		const crud = document.querySelectorAll(`.${styles.deleteUpdateBtns}`)
		if (crud && !sibling?.classList.contains(styles.showCrud)) {
			crud.forEach(item => item.classList.remove(styles.showCrud))
		}

		if (!sibling?.classList.contains(styles.showCrud)) {
			sibling?.classList.add(styles.showCrud)
		} else {
			sibling?.classList.remove(styles.showCrud)
		}
	}

	const dataMessage = new Date(createdAt).toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	})
	useEffect(() => {
		if (isLogged && aRef.current) {
			aRef.current.classList.remove(styles.commentLogInShow)
		}
	}, [isLogged])

	useEffect(() => {
		const globalHideCrud = (e: globalThis.MouseEvent) => {
			const el = crudRef.current
			const target = e.target as HTMLElement

			if (
				!el?.contains(target) &&
				el?.classList.contains(styles.showCrud) &&
				!target.classList.contains(styles.deleteUpdateMenu)
			) {
				el?.classList.remove(styles.showCrud)
			}
		}
		window.addEventListener('click', globalHideCrud)

		return () => window.removeEventListener('click', globalHideCrud)
	}, [])
	const handleDeleteComment = async () => {
		try {
			await deleteComment({ commentId: _id }).unwrap()

			// setResMessage(res?.message)

			
		} catch (error: unknown) {
			if (typeof error === 'object' && error !== null) {
				// const fetchError = error as FetchBaseQueryError
				// const errorMessage =
				// 	fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data
				// 		? (fetchError.data.message as string)
				// 		: 'Something goes wrong'
				// setResMessage(errorMessage)
			}
		}
	}
	return (
		<div ref={comRef} className={styles.commentContainer} id={`${_id}`} data-postid={postId} data-parentid={parentId}>
			<div className={styles.commentAvatar}>
				<img src={author.avatar?.src} alt="" className={styles.authorAvatar} />
			</div>
			<div className={`${styles.commentContent} ${parentId ? styles.commentLeft : ''}`}>
				<div className={styles.commentInfo}>
					<div className={styles.commentAuthor}>{author.name}</div>
					<div className={styles.commentMeta}>
						<div className={styles.commentTime}>{dataMessage}</div>
						<div className={styles.commentCrud}>
							<div className={styles.commentReply}>
								{!showReply ? (
									<button className={styles.commentReplybButton} onClick={e => handleReply(e)}>
										Reply
									</button>
								) : (
									<span
										className={styles.commentHideButton}
										onClick={() => {
											setShowReply(false)
											setIsUpdating(false)
										}}></span>
								)}
								<AnchorLink ref={aRef} href="/login" className={styles.commentLogIn}>
									Log In to Reply
								</AnchorLink>
							</div>
							{isLogged && (authorPost || role === 'Admin' || role === 'Moderator') && !showReply && (
								<div className={styles.deleteUpdateContainer}>
									<span
										className={styles.deleteUpdateMenu}
										onClick={e => {
											handleShowCrud(e)
										}}>
										...
									</span>
									<div ref={crudRef} className={styles.deleteUpdateBtns}>
										<button
											className={styles.editBtn}
											onClick={() => {
												setShowReply(true)
												setIsUpdating(true)
												setUpdatingText(textRef?.current?.textContent)
											}}>
											edit
										</button>
										<button className={styles.deleteBtn} onClick={() => handleDeleteComment()}>
											delete
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
				<div ref={textRef} className={styles.commentText}>
					<p>{comment}</p>
				</div>
				{showReply && (
					<TextArea
						styles={styles}
						parentId={_id}
						postId={postId}
						setShowReply={setShowReply}
						comRef={comRef}
						isUpdating={isUpdating}
						updatingText={updatingText || null || undefined}
						setIsUpdating={setIsUpdating}
					/>
				)}
				{children && children.length > 0 && (
					<div>
						{children.map(({ _id, parentId, author, comment, createdAt, children }) => (
							<Comment
								key={_id}
								_id={_id}
								postId={postId}
								parentId={parentId}
								author={author}
								comment={comment}
								createdAt={createdAt}
								children={children}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default Comment
