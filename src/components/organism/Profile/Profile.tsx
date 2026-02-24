import styles from './Profile.module.scss'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { FormProvider, useForm, useWatch, type SubmitHandler } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateCloudinarySignatureMutation } from '../../../slices/api/cloudinaryApi'
import { useFetchUserProfileQuery, useUpdateProfileMutation } from '../../../slices/api/userApi'
import WrapperBox from '../../atoms/WrapperBox/WrapperBox'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import { UploadSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import { setData } from '../../../slices/authSlice'
import uploadToCloudinary from '../../../hooks/useUploadToCloudinary'

import RHFInput from '../../atoms/RHFInput/RHFInput'

const profileSchema = z.object({
	name: z.string().trim().min(1, { message: 'Field is required' }),
	avatar: z
		.instanceof(File)
		.or(z.string())
		.nullable()
		.refine(v => v !== null, { message: 'Please upload a file' }),
})
type profileTypes = z.infer<typeof profileSchema>

const Profile = () => {
	const uploadFolder = import.meta.env.VITE_UPLOAD_AVATARS
	const [updateProfile] = useUpdateProfileMutation()
	const [createSignature] = useCreateCloudinarySignatureMutation()
	const dispatch = useDispatch()
	const [showImage, setShowImage] = useState<boolean>(false)
	
	const fileInputRef = useRef<HTMLInputElement>(null)
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
		control,
		handleSubmit,
		register,
		
		setValue,
		reset,
		formState: { isSubmitting, isDirty },
	} = methods

	const [ avatar] = useWatch({ control, name: [ 'avatar'] })

	const onChangeInputProfile = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e.currentTarget
		console.log('ok')
		const { type } = target

		if (type === 'file') {
			const file = target.files?.[0]
			if (!file) return

			const maxSizeMB = 3
			if (file.size / 1024 / 1024 > maxSizeMB) {
				setProfileErrorMessage(`Plik musi być mniejszy niż ${maxSizeMB} MB`)
				setValue('avatar', profileData.avatar?.src)
				if (fileInputRef.current) fileInputRef.current.value = ''
				return
			}

			const objectUrl = URL.createObjectURL(file)
			const img = new Image()
			img.src = objectUrl
			img.onload = () => {
				const { width, height } = img

				// Przykładowa walidacja
				if (width < 128 || height < 128) {
					setProfileErrorMessage('Obraz jest za mały! Minimum 128x128 px')
					setValue('avatar', profileData.avatar?.src)

					if (fileInputRef.current) fileInputRef.current.value = ''
					return
				}
				if (width > 256 || height > 256) {
					setProfileErrorMessage('Obraz jest za duży! Maksimum 256x256 px')
					setValue('avatar', profileData.avatar?.src)

					if (fileInputRef.current) fileInputRef.current.value = ''
					return
				}
			}
			setValue('avatar', file, { shouldValidate: true })
		}
		
	}

	const onSubmit: SubmitHandler<profileTypes> = async data => {
		let updatedAvatar = {}

		console.log(data)
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
			<WrapperBox>
				<p className={styles.boxTitle}>Profile</p>

				<form
					aria-busy={isSubmitting}
					onSubmit={handleSubmit(onSubmit)}
					className={`${styles.formWrapper} ${profileSuccessMessage || profileErrorMessage ? '' : styles.topDistance}`}>
					<div className={styles.profileBox}>
						{(profileSuccessMessage || profileErrorMessage) && (
							<APIResponseMessage messageType={profileSuccessMessage ? 'succes' : 'error'}>
								{profileSuccessMessage ? profileSuccessMessage : <>{profileErrorMessage}</>}
							</APIResponseMessage>
						)}
						<label
							htmlFor="avatar"
							className={`${styles.avatarBox} ${!avatar ? styles.avatarShadow : ''}`}
							onMouseEnter={() => setShowImage(true)}
							onMouseLeave={() => setShowImage(false)}>
							<input
								type="file"
								id="avatar"
								disabled={isSubmitting}
								aria-readonly={isSubmitting}
								{...register('avatar', {
									onChange: e => {
										onChangeInputProfile(e)
									},
								})}
							/>

							{typeof avatar === 'string' ? (
								<img src={avatar} alt="User Avatar" />
							) : (
								avatar instanceof File && <img src={URL.createObjectURL(avatar)} alt="User Avatar" />
							)}

							{(!avatar || showImage) && (
								<div className={`${styles.image} `}>
									<UploadSVG className={styles.uploadSVG} />
								</div>
							)}
						</label>
					</div>
					<RHFInput
						name="name"
						id="name"
						label="Name"
						type="text"
						styles={styles}
						isSubmitting={isSubmitting}
						
					/>

					<FormBtn
						type="submit"
						isSubmitting={isSubmitting}
						className={`${styles.saveChanges} ${(isDirty && !isSubmitting) ? styles.enabledChanges : ''}`}>
						Save Changes
					</FormBtn>
				</form>
			</WrapperBox>
		</FormProvider>
	)
}

export default Profile
