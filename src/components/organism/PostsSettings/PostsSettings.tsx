import { useEffect, useState } from 'react'
import styles from './PostsSettings.module.scss'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import { postsDefaults, postsSchema, type postsTypes } from '../../../types/settingsSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import WrapperBox from '../../atoms/WrapperBox/WrapperBox'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import RHFInput from '../../atoms/RHFInput/RHFInput'
import { useUpdatePostsSettingsMutation } from '../../../slices/api/settingsApi'
import useGlobalContext from '../../../hooks/useGlobalContext'

const PostsSettings = () => {
	const [successMessage, setSuccessMessage] = useState<string>('')

	const [updateSettings] = useUpdatePostsSettingsMutation()
	const { posts } = useGlobalContext()
	const methods = useForm<postsTypes>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		resolver: zodResolver(postsSchema),
		defaultValues: posts ? posts : postsDefaults,
	})

	const {
		handleSubmit,
		reset,
		setError,
		clearErrors,
		formState: { isSubmitting, errors, isDirty },
	} = methods

	const onSubmit: SubmitHandler<postsTypes> = async data => {
		try {
			if (!data) return
			if (!isDirty) return
			const res = await updateSettings({ posts: data }).unwrap()

			if (res) {
				setSuccessMessage(res.message)
			}
			if (errors.root?.message) clearErrors('root')
		} catch (error) {
			if (typeof error === 'object' && error !== null) {
				const fetchError = error as FetchBaseQueryError
				const message =
					fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data
						? (fetchError.data.message as string)
						: 'An unexpected error has occured'

				setError('root', { message })
			} else {
				setError('root', { message: 'An unexpected error has occured' })
			}
		}
	}

	const handleResetFields = () => {
		reset(postsDefaults)
	}
	useEffect(() => {
		if (posts) reset(posts)
	}, [posts, reset])
	useEffect(() => {
		if (errors.root?.message) {
			const timer = setTimeout(() => {
				clearErrors('root')
				reset(posts)
			}, 5000)

			return () => clearTimeout(timer)
		}
		if (successMessage) {
			const timer = setTimeout(() => {
				setSuccessMessage('')
			}, 5000)

			return () => clearTimeout(timer)
		}
	}, [posts, clearErrors, errors.root?.message, reset, successMessage])

	return (
		<div className={styles.postSettingsWrapper}>
			<FormProvider {...methods}>
				<WrapperBox>
					<p className={styles.boxTitle}>Posts Settings</p>
					<form onSubmit={handleSubmit(onSubmit)} aria-busy={isSubmitting} className={styles.formWrapper}>
						<RHFInput
							type="number"
							name="heroPostLimit"
							id="heroPostLimit"
							label="Home Page Post Limit"
							
							isSubmitting={isSubmitting}
						/>
						<RHFInput
							type="number"
							name="postPerPage"
							id="postPerPage"
							label="Post Per Page"
							
							isSubmitting={isSubmitting}
						/>

						{(errors.root?.message || successMessage) && (
							<APIResponseMessage messageType={successMessage ? 'success' : 'error'}>
								{errors.root?.message ? errors.root.message : successMessage}
							</APIResponseMessage>
						)}
						<div className={styles.submitBtns}>
							<FormBtn type="submit" isSubmitting={isSubmitting} className={isDirty ? styles.saveSettings : ''}>
								{isSubmitting ? (
									<>
										Saving
										<span className={styles.animate1}>.</span>
										<span className={styles.animate2}>.</span>
										<span className={styles.animate3}>.</span>
									</>
								) : (
									'Save'
								)}
							</FormBtn>

							<FormBtn
								type="button"
								isSubmitting={isSubmitting}
								className={styles.clearButton}
								handleResetFields={handleResetFields}>
								Clear
							</FormBtn>
						</div>
					</form>
				</WrapperBox>
			</FormProvider>
		</div>
	)
}

export default PostsSettings
