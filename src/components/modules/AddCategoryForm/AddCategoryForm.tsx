import { useEffect, useMemo, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm, useWatch, type SubmitHandler } from 'react-hook-form'

import styles from './AddCategoryForm.module.scss'
import RHFInput from '../../atoms/RHFInput/RHFInput'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import {
	useCreateCategoryMutation,
	useFetchAllCategoriesQuery,
	useUpdateCategoryMutation,
} from '../../../slices/api/categoriesApi'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import { categorySchema, defaultCategory, statusOption, type categoryTypes } from '../../../types/categoriesSchema'
import RHFTextArea from '../../atoms/RHFTextArea/RHFTextArea'
import RHFSelect from '../../atoms/RHFSelect/RHFSelect'
import RHFAddFile from '../../atoms/RHFAddFile/RHFAddFile'
import { useCreateCloudinarySignatureMutation } from '../../../slices/api/cloudinaryApi'
import uploadToCloudinary from '../../../hooks/useUploadToCloudinary'
import useGlobalContext from '../../../hooks/useGlobalContext'

const AddCategoryForm = () => {
	const [successMessage, setSuccessMessage] = useState<string>('')
	const uploadFolder = import.meta.env.VITE_UPLOAD_CATEGORIES
	const [addCategory] = useCreateCategoryMutation()
	const { data } = useFetchAllCategoriesQuery()
	const [createSignature] = useCreateCloudinarySignatureMutation()
	const [updateCategory] = useUpdateCategoryMutation()
	const { editContext } = useGlobalContext()
	const { editCategory, catId, successDeleteMessage, handleSetCategory } = editContext

	const fileRef = useRef<(HTMLInputElement | null)[]>([])
	const options = useMemo(() => {
		return data
			? data
					.filter(f => !f.parent)
					.map(el => {
						return { name: el.name, id: el._id }
					})
			: []
	}, [data])
	const optionsMap = useMemo(() => {
		const map = new Map()
		data?.forEach(el => {
			map.set(el._id, el)
		})
		return map
	}, [data])
	const methods = useForm<categoryTypes>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		resolver: zodResolver(categorySchema),
		defaultValues: editCategory ? editCategory : defaultCategory,
	})

	const {
		control,
		handleSubmit,
		reset,
		setError,

		setValue,
		formState: { isSubmitting, errors, isDirty },
	} = methods

	const [name, parent] = useWatch({ control, name: ['name', 'parent'] })

	const onSubmit: SubmitHandler<categoryTypes> = async (data: categoryTypes) => {
		try {
			if (!data) return
			if (!isDirty) return

			const filesToUpload: { file: File; type: 'main' | 'seo'; publicId?: string }[] = []

			if (data.image.src instanceof File) {
				filesToUpload.push({ file: data.image.src, type: 'main', publicId: data.image.public_id })
			}
			if (data.metaImage.src instanceof File) {
				filesToUpload.push({ file: data.metaImage.src, type: 'seo', publicId: data.metaImage.public_id })
			}

			const uploadedFiles: { image: typeof data.image; metaImage: typeof data.metaImage } = {
				image: data.image,
				metaImage: data.metaImage,
			}

			for (const file of filesToUpload) {
				const dataSignature = file.publicId
					? await createSignature({ publicId: file.publicId }).unwrap()
					: await createSignature({ uploadFolder }).unwrap()

				const uploadedData = await uploadToCloudinary({
					file: file.file,
					publicId: file.publicId,
					uploadFolder: !file.publicId ? uploadFolder : undefined,
					dataSignature,
				})

				if (file.type === 'main') {
					uploadedFiles.image = {
						...uploadedFiles.image,
						src: uploadedData.secure_url,
						public_id: uploadedData.public_id,
					}
				} else if (file.type === 'seo') {
					uploadedFiles.metaImage = {
						...uploadedFiles.metaImage,
						src: uploadedData.secure_url,
						public_id: uploadedData.public_id,
					}
				}
			}

			const params = new URL(data.slug)
			const { pathname } = params

			const uploadedData = {
				...data,
				image: uploadedFiles.image,
				metaImage: uploadedFiles.metaImage,
				slug: pathname,
			}

			let res
			if (editCategory) {
				res = await updateCategory(uploadedData).unwrap()

				handleSetCategory('')
			} else {
				res = await addCategory(uploadedData).unwrap()
			}
			if (res) {
				setSuccessMessage(res.message)
				fileRef.current.forEach(el => el && (el.value = ''))
				reset()
			}
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
	useEffect(() => {
		if (catId) {
			reset(editCategory)
		} else {
			reset(defaultCategory)
		}
	}, [catId, editCategory, reset])

	useEffect(() => {
		if (successDeleteMessage) {
			setSuccessMessage(successDeleteMessage)
			reset(defaultCategory)
		}
	}, [reset, successDeleteMessage])

	useEffect(() => {
		const origin = window.location.origin
		const slug = name.toLowerCase().replace(/\s+/g, '-')

		const parentName = optionsMap.get(parent)?.name || ''
		const parentSlug = parentName.toLowerCase().replace(/\s+/g, '-')

		const parentCategory = parentSlug ? `${parentSlug}/` : ''
		const permalink = `${origin}/categories/${parentCategory}${slug}`

		setValue('slug', permalink)
	}, [name, optionsMap, parent, setValue])

	useEffect(() => {
		if (!successMessage) return

		const timeout = setTimeout(() => {
			setSuccessMessage('')
			reset(defaultCategory)
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}, 5000)

		return () => clearTimeout(timeout)
	}, [reset, successMessage])

	useEffect(() => {
		setError('root', { message: '' })
	}, [name, setError])

	const handleResetFields = () => {
		reset(defaultCategory)

		handleSetCategory('')
	}

	return (
		<div className={styles.addCategoryWrapper}>
			<FormProvider {...methods}>
				<h3 className={styles.addCategoryTitle}>Create Category</h3>
				<form aria-busy={isSubmitting} onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
					<div className={styles.formWrapper}>
						<RHFInput
							name="name"
							type="text"
							label="Name"
							id="name"
							isSubmitting={isSubmitting}
							placeholder="Name"
							tipMessage="Min 4 characters. Max 50 characters"
						/>
						<RHFInput
							name="slug"
							type="text"
							label="Permalink"
							id="slug"
							isSubmitting={isSubmitting}
							tipMessage="Category link view. Min 4 characters. Max 100 characters"
						/>
						<RHFSelect
							name="parent"
							id="parent"
							label="Parent"
							isSubmitting={isSubmitting}
							tipMessage="You can assign a new category as a subcategory of a given category"
							options={options}
							required={false}
						/>
						<RHFTextArea
							name="description"
							id="description"
							label="Description"
							placeholder="Short description"
							isSubmitting={isSubmitting}
							markdown={false}
							tipMessage="This description will apear under the category name. Min 50 characters. Max 300 characters"
							required={false}
						/>
						<RHFSelect
							name="status"
							id="status"
							label="Status"
							options={statusOption}
							required={false}
							isSubmitting={isSubmitting}
							tipMessage="You can publish categories or save them as drafts"
						/>
						<RHFAddFile
							name="image.src"
							id="image"
							label="Image"
							fileIndex={1}
							fileRef={fileRef}
							required={false}
							isSubmitting={isSubmitting}
							tipMessage="Recommended size: 1200x630px.This image will apear as the category background"
						/>

						<div className={`${styles.seoWrapper}`}>
							<h3 className={`${styles.seoTitle}`}>Search Engine Optimize</h3>
							<p className={`${styles.seoText}`}>
								Setup meta title & description to make your site easy to discovered on search engines such as Google
							</p>
							<RHFInput
								name="metaTitle"
								id="metaTitle"
								type="text"
								label="Seo Name"
								isSubmitting={isSubmitting}
								placeholder="Seo Name"
								tipMessage="Optimal length: 50-60 characters. This appears as the clickable headline in search results."
							/>
							<RHFTextArea
								name="metaDescription"
								id="metaDescription"
								label="Seo Description"
								placeholder="Short description"
								isSubmitting={isSubmitting}
								markdown={false}
								tipMessage="Optimal length: 120-160 characters. This appears below the title in search results and should entice users to click."
							/>
							<RHFAddFile
								name="metaImage.src"
								id="metaImage"
								label="Seo Image"
								fileIndex={2}
								fileRef={fileRef}
								isSubmitting={isSubmitting}
								tipMessage="Recommended size: 1200x630px. This image appears when your page is shared on social media platforms."
							/>
						</div>
					</div>

					{(errors.root?.message || successMessage) && (
						<APIResponseMessage messageType={successMessage ? 'success' : 'error'}>
							{errors.root?.message ? errors.root.message : successMessage}
						</APIResponseMessage>
					)}

					<div className={styles.submitBtns}>
						<FormBtn
							type="submit"
							isSubmitting={isSubmitting}
							className={`${styles.submitBtn} ${isDirty ? styles.save : ''}`}>
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
			</FormProvider>
		</div>
	)
}

export default AddCategoryForm
