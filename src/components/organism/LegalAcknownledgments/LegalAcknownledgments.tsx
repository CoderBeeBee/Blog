import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import styles from './LegalAcknownledgments.module.scss'
import { zodResolver } from '@hookform/resolvers/zod'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import { useEffect, useState } from 'react'
import { legalDefaults, legalSchema, type legalTypes } from '../../../types/legalSchema'
import { useCreateLegalDocumentsMutation, useFetchLegalDocumentsQuery } from '../../../slices/api/legalDocumentsApi'
import RHFInput from '../../atoms/RHFInput/RHFInput'
import RHFTextArea from '../../atoms/RHFTextArea/RHFTextArea'
import Breadcrumbs from '../../atoms/Breadcrumbs/Breadcrumbs'
import { RestoreSVG, SaveSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'

const LegalAcknownledgments = () => {
	const [successMessage, setSuccessMessage] = useState<string>('')
	const [createLegalDocument] = useCreateLegalDocumentsMutation()
	const { data } = useFetchLegalDocumentsQuery({ type: 'acknowledgments' })
	const methods = useForm<legalTypes>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		resolver: zodResolver(legalSchema),
		defaultValues: legalDefaults,
	})

	const {
		handleSubmit,
		reset,
		setError,
		clearErrors,
		formState: { isSubmitting, errors, isDirty },
	} = methods

	const onSubmit: SubmitHandler<legalTypes> = async data => {
		try {
			if (!data) return
			if (!isDirty) return

			const res = await createLegalDocument({
				type: 'acknowledgments',
				language: data.language,
				version: data.version,
				content: data.content,
			}).unwrap()

			if (res) {
				setSuccessMessage(res.message)
				reset()
			}
			if (errors) clearErrors()
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
		reset(data)
	}

	useEffect(() => {
		if (data) {
			reset(data)
		}
	}, [data, reset])

	useEffect(() => {
		if (successMessage) {
			const timer = setTimeout(() => {
				setSuccessMessage('')
			}, 4000)

			return () => clearTimeout(timer)
		}

		if (errors.root?.message) {
			const timer = setTimeout(() => {
				clearErrors()
			}, 4000)

			return () => clearTimeout(timer)
		}
	}, [clearErrors, errors.root?.message, successMessage])

	return (
		<div className={styles.legalAcknowledgmentsWrapper}>
			<Breadcrumbs />

			<FormProvider {...methods}>
				<form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper} aria-busy={isSubmitting}>
					<RHFInput
						type="text"
						name="version"
						label="Version"
						id="version"
						placeholder="ex. 0.1"
						isSubmitting={isSubmitting}
					/>
					<RHFInput
						type="text"
						name="language"
						label="Language"
						id="language"
						placeholder="ex. en"
						isSubmitting={isSubmitting}
					/>
					<RHFTextArea name="content" id="content" label="Content" isSubmitting={isSubmitting} />

					{(errors.root?.message || successMessage) && (
						<APIResponseMessage messageType={successMessage ? 'success' : 'error'}>
							{errors.root?.message ? errors.root.message : successMessage}
						</APIResponseMessage>
					)}

					<div className={styles.submitBtns}>
						<FormBtn
							type="submit"
							isSubmitting={isSubmitting}
							ariaLabel="Save"
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
								'Save'
							)}
						</FormBtn>

						<FormBtn
							type="button"
							isSubmitting={isSubmitting}
							ariaLabel="Reset"
							className={`${styles.submitBtn} ${styles.clearButton}`}
							handleResetFields={handleResetFields}>
							<RestoreSVG />
							Reset
						</FormBtn>
					</div>
				</form>
			</FormProvider>
		</div>
	)
}
export default LegalAcknownledgments
