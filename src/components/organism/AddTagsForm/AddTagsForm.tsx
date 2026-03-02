import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm, useWatch, type SubmitHandler } from 'react-hook-form'
import z from 'zod'
import styles from './AddTagsForm.module.scss'
import RHFInput from '../../atoms/RHFInput/RHFInput'
import FormBtn from '../../atoms/FormBtn/FormBtn'

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useEffect, useState } from 'react'
import WrapperBox from '../../atoms/WrapperBox/WrapperBox'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import { useCreateTagMutation } from '../../../slices/api/tagsApi'
const tagSchema = z.object({
	tag: z.string().trim().min(4, { message: 'Min 4 characters' }),
})

type tagTypes = z.infer<typeof tagSchema>

const AddTagsForm = () => {
	const [successMessage, setSuccessMessage] = useState<string>('')
	const [createTag] = useCreateTagMutation()

	const methods = useForm<tagTypes>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		resolver: zodResolver(tagSchema),
		defaultValues: {
			tag: '',
		},
	})

	const {
		control,
		handleSubmit,
		reset,
		setError,

		formState: { isSubmitting, errors, isDirty },
	} = methods

	const watch = useWatch({ control, name: 'tag' })
	const onSubmit: SubmitHandler<tagTypes> = async (data: tagTypes) => {
		try {
			if (!data) return
			 const {tag} = data
			const res = await createTag({ tag }).unwrap()

			if (res) setSuccessMessage(res.message)

			reset()
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
		if (watch) {
			setSuccessMessage('')
		}
		if (successMessage) {
			setTimeout(() => {
				setSuccessMessage('')
			}, 5000)
		}
	}, [successMessage, watch])
	useEffect(() => {
		setError('root', { message: '' })
	}, [watch, setError])

	const handleResetFields = () => {
		reset()
	}
	return (
		<div className={styles.addTagsWrapper}>
			<FormProvider {...methods}>
				<WrapperBox>
					<h3 className={styles.addTagsTitle}>Add Tag</h3>
					<form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
						<div className={styles.formWrapper}>
							<RHFInput
								name="tag"
								type="text"
								styles={styles}
								label="Tag Name"
								id="tag"
								isSubmitting={isSubmitting}
							/>
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
				</WrapperBox>
			</FormProvider>
		</div>
	)
}

export default AddTagsForm
