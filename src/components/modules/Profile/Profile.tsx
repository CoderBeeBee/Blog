import styles from './Profile.module.scss'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateCloudinarySignatureMutation } from '../../../slices/api/cloudinaryApi'
import { useFetchUserProfileQuery, useUpdateProfileMutation } from '../../../slices/api/userApi'

import FormBtn from '../../atoms/FormBtn/FormBtn'
import { setData } from '../../../slices/authSlice'
import uploadToCloudinary from '../../../hooks/useUploadToCloudinary'

import RHFInput from '../../atoms/RHFInput/RHFInput'
import RHFAddFile from '../../atoms/RHFAddFile/RHFAddFile'
import validateImageRHF from '../../../hooks/validateImageRHF'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import { SaveSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'

const profileSchema = z.object({
	name: z
		.string()
		.trim()
		.min(4, { message: 'Name must have at least 4 characters' })
		.max(32, { message: 'The name is too long. Max 32 characters' }),
	avatar: z
		.instanceof(File)
		.or(z.string())
		.nullable()
		.superRefine(validateImageRHF({ maxSizeMB: 1, minWidth: 128, minHeight: 128, maxWidth: 256, maxHeight: 256 })),
})
type profileTypes = z.infer<typeof profileSchema>

const Profile = () => {
	const uploadFolder = import.meta.env.VITE_UPLOAD_AVATARS
	const [updateProfile] = useUpdateProfileMutation()
	const [createSignature] = useCreateCloudinarySignatureMutation()
	const dispatch = useDispatch()
	const [profileErrorMessage, setProfileErrorMessage] = useState<string>('')
	const [profileSuccessMessage, setProfileSuccessMessage] = useState<string>('')

	const { data: profileData } = useFetchUserProfileQuery({})

	const methods = useForm<profileTypes>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: '',
			avatar: null,
		},
	})
	const {
		handleSubmit,
		reset,
		formState: { isSubmitting, isDirty },
	} = methods

	// const [avatar] = useWatch({ control, name: ['avatar'] })

	const onSubmit: SubmitHandler<profileTypes> = async data => {
		let updatedAvatar = {}

		try {
			if (!isDirty) return
			if (data.avatar instanceof File) {
				const file = data.avatar

				const dataSignature = await createSignature({ uploadFolder }).unwrap()

				const uploadFile = await uploadToCloudinary({
					file,
					uploadFolder,
					dataSignature,
				})
				updatedAvatar = { src: uploadFile.secure_url, public_id: uploadFile.public_id }
			} else {
				updatedAvatar = profileData.avatar
			}

			const res = await updateProfile({ name: data.name, updatedAvatar }).unwrap()

			if (res) setProfileSuccessMessage(res.message)

			dispatch(setData(res))
		} catch (error) {
			if (typeof error === 'object' && error !== null) {
				const fetchError = error as FetchBaseQueryError
				const message =
					fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data
						? (fetchError.data.message as string)
						: 'An unexpected error has occured'

				setProfileErrorMessage(message)
				setProfileSuccessMessage('')
			} else {
				setProfileErrorMessage('An unexpected error has occured')
			}
		}
	}
	useEffect(() => {
		if (profileData) {
			reset({
				name: profileData.name ?? '',
				avatar: profileData.avatar?.src ?? null,
			})
		}
	}, [profileData, reset])

	useEffect(() => {
		if (profileSuccessMessage) {
			const timer = setTimeout(() => {
				setProfileSuccessMessage('')
			}, 3000)

			return () => clearTimeout(timer)
		}

		if (profileErrorMessage) {
			const timer = setTimeout(() => {
				setProfileErrorMessage('')
			}, 3000)

			return () => clearTimeout(timer)
		}
	}, [profileErrorMessage, profileSuccessMessage])

	return (
		<FormProvider {...methods}>
			<form
				aria-busy={isSubmitting}
				onSubmit={handleSubmit(onSubmit)}
				className={`${styles.formWrapper} ${profileSuccessMessage || profileErrorMessage ? '' : styles.topDistance}`}>
				<div className={styles.profileBox}>
					<div className={styles.avatarWrapper}>
						<RHFAddFile
							name="avatar"
							id="avatar"
							

							fileIndex={-1}
							isSubmitting={isSubmitting}
							required={false}
							tip={false}
						/>
					</div>
					<RHFInput name="name" id="name" label="Name" type="text" isSubmitting={isSubmitting} required={false} tipMessage='At least 4 characters. Max 32 characters'/>
				</div>
				{(profileSuccessMessage || profileErrorMessage) && (
					<APIResponseMessage messageType={profileSuccessMessage ? 'success' : 'error'}>
						{profileSuccessMessage ? profileSuccessMessage : <>{profileErrorMessage}</>}
					</APIResponseMessage>
				)}

				<FormBtn
					type="submit"
					isSubmitting={isSubmitting}
					
					className={`${styles.submitBtn} ${isSubmitting ? styles.isSubmitting : ''} ${isDirty ? styles.save : ''}`}>
					<SaveSVG />
					{isSubmitting ? (
						<>
							Saving
							<span className={styles.animate1}>.</span>
							<span className={styles.animate2}>.</span>
							<span className={styles.animate3}>.</span>
						</>
					) : (
						'Save Changes'
					)}
				</FormBtn>
			</form>
		</FormProvider>
	)
}

export default Profile
