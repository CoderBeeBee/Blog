import styles from './BasicSettings.module.scss'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'

import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import { basicDefaults, basicSchema, type basicTypes } from '../../../types/settingsSchema'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import WrapperBox from '../../atoms/WrapperBox/WrapperBox'
import RHFInput from '../../atoms/RHFInput/RHFInput'
import RHFAddFile from '../../atoms/RHFAddFile/RHFAddFile'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import { useCreateCloudinarySignatureMutation } from '../../../slices/api/cloudinaryApi'

import uploadToCloudinary from '../../../hooks/useUploadToCloudinary'
import useGlobalContext from '../../../hooks/useGlobalContext'
import { useBasicSettingsMutation } from '../../../slices/api/settingsApi'

const BasicSettings = () => {
	const uploadFolderLogo = import.meta.env.VITE_UPLOAD_LOGO
	const uploadFolderFavicon = import.meta.env.VITE_UPLOAD_FAVICON
	const [successMessage, setSuccessMessage] = useState<string>('')
	const fileRef = useRef<(HTMLInputElement | null)[]>([])
	const [createSignature] = useCreateCloudinarySignatureMutation()
	const [saveBasic] = useBasicSettingsMutation()
	const { basic } = useGlobalContext()

	const methods = useForm<basicTypes>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		resolver: zodResolver(basicSchema),
		defaultValues: basic ? basic : basicDefaults,
	})

	const {
		handleSubmit,
		reset,
		setError,
		clearErrors,
		formState: { isSubmitting, errors, isDirty },
	} = methods

	const onSubmit: SubmitHandler<basicTypes> = async data => {
		let logo = {}
		let favicon = {}
		try {
			if (!data) return
			if (!isDirty) return

			if (data.logo.src instanceof File) {
				const file = data.logo.src

				const options = data.logo.public_id
					? {
							file,
							publicId: data.logo.public_id,
							dataSignature: await createSignature({ publicId: data.logo.public_id }).unwrap(),
						}
					: {
							file,
							uploadFolder: uploadFolderLogo,
							dataSignature: await createSignature({ uploadFolder: uploadFolderLogo }).unwrap(),
						}
				const uploadFile = await uploadToCloudinary(options)
				logo = { src: uploadFile.secure_url, public_id: uploadFile.public_id }
			} else {
				logo = data.logo
			}

			if (data.favicon.src instanceof File) {
				const file = data.favicon.src
				const options = data.favicon.public_id
					? {
							file,
							publicId: data.favicon.public_id,
							dataSignature: await createSignature({ publicId: data.favicon.public_id }).unwrap(),
						}
					: {
							file,
							uploadFolder: uploadFolderFavicon,
							dataSignature: await createSignature({ uploadFolder: uploadFolderFavicon }).unwrap(),
						}

				const uploadFile = await uploadToCloudinary(options)
				favicon = { src: uploadFile.secure_url, public_id: uploadFile.public_id }
			} else {
				favicon = data.favicon
			}

			const basic = { ...data, logo, favicon }

			const res = await saveBasic({ basic }).unwrap()

			if (res) setSuccessMessage(res.message)
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
		if (fileRef.current) fileRef.current.forEach(el => el && (el.value = ''))
		reset(basicDefaults)
	}

	useEffect(() => {
		if (basic) {
			reset(basic)
		}
	}, [basic, reset])

	useEffect(() => {
		if (errors.root?.message) {
			const timer = setTimeout(() => {
				clearErrors('root')
				reset(basic)
			}, 5000)

			return () => clearTimeout(timer)
		}

		if (successMessage) {
			const timer = setTimeout(() => {
				setSuccessMessage('')
			}, 5000)

			return () => clearTimeout(timer)
		}
	}, [clearErrors, errors.root?.message, basic, reset, successMessage])
	return (
		<div className={styles.basicSettingsWrapper}>
			<FormProvider {...methods}>
				<WrapperBox>
					<p className={styles.boxTitle}>Basic Settings</p>
					<form onSubmit={handleSubmit(onSubmit)} aria-busy={isSubmitting} className={styles.formWrapper}>
						<RHFInput
							type="text"
							name="siteName"
							id="site-name"
							label="Site Name"
							styles={styles}
							isSubmitting={isSubmitting}
							placeholder="Enter site name"
						/>
						<RHFInput
							type="text"
							name="siteUrl"
							id="site-url"
							label="Site Url"
							styles={styles}
							isSubmitting={isSubmitting}
							placeholder="Enter site url"
						/>
						<RHFAddFile
							name="logo.src"
							id="logo"
							label="Logo"
							isSubmitting={isSubmitting}
							fileIndex={0}
							fileRef={fileRef}
							styles={styles}
						/>
						<RHFAddFile
							name="favicon.src"
							id="favicon"
							label="FavIcon"
							isSubmitting={isSubmitting}
							fileIndex={1}
							fileRef={fileRef}
							styles={styles}
							className={styles.favIcon}
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

export default BasicSettings
