import { zodResolver } from '@hookform/resolvers/zod'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useEffect, useState } from 'react'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import { socialLinksDefaults, socialLinksSchema, type socialTypes } from '../../../types/integrationsSchema'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import RHFInput from '../../atoms/RHFInput/RHFInput'
import styles from './IntegrationsSocialLinks.module.scss'
import WrapperBox from '../../atoms/WrapperBox/WrapperBox'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import { useUpdateIntegrationsSettingsMutation } from '../../../slices/api/settingsApi'
import useMenuContext from '../../../hooks/useMenuContext'
const IntegrationsSocialLinks = () => {
	const [successMessage, setSuccessMessage] = useState<string>('')
	const [updateIntegrations] = useUpdateIntegrationsSettingsMutation()
	const { integrations } = useMenuContext()
	const methods = useForm<socialTypes>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		resolver: zodResolver(socialLinksSchema),
		defaultValues: socialLinksDefaults,
	})

	const {
		handleSubmit,
		reset,
		setError,
		clearErrors,
		formState: { isSubmitting, errors, isDirty },
	} = methods

	const onSubmit: SubmitHandler<socialTypes> = async data => {
		try {
			if (!data) return
			if (!isDirty) return
			console.log(data)
			const res = await updateIntegrations({ integrations: data }).unwrap()

			if (res) {
				setSuccessMessage(res.message)
				reset(data)
			}
			if (errors) clearErrors()
		} catch (error) {
			if (typeof error === 'object' && error !== null) {
				const fetchError = error as FetchBaseQueryError
				const message =
					fetchError.data && typeof fetchError.data === 'object' && 'error' in fetchError.data
						? (fetchError.data.error as string)
						: 'An unexpected error has occured'

				setError('root', { message })
			} else {
				setError('root', { message: 'An unexpected error has occured' })
			}
		}
	}

	useEffect(() => {
		if (integrations) reset(integrations)
	}, [reset, integrations])

	useEffect(() => {
		if (successMessage) {
			setTimeout(() => {
				setSuccessMessage('')
			}, 5000)
		}
	}, [successMessage])

	const handleResetFields = () => {
		reset(socialLinksDefaults)
	}

	return (
		<div className={styles.socialLinksWrapper}>
			<FormProvider {...methods}>
				<WrapperBox>
					<h3 className={styles.boxTitle}>Social Links</h3>

					<form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper} aria-busy={isSubmitting}>
						<RHFInput
							styles={styles}
							type="text"
							name="facebook"
							label="Facebook"
							id="facebook"
							isSubmitting={isSubmitting}
						/>

						<RHFInput
							styles={styles}
							type="text"
							name="twitter"
							label="Twitter"
							id="twitter"
							isSubmitting={isSubmitting}
						/>
						<RHFInput
							styles={styles}
							type="text"
							name="instagram"
							label="Instagram"
							id="instagram"
							isSubmitting={isSubmitting}
						/>
						<RHFInput
							styles={styles}
							type="text"
							name="youTube"
							label="Youtube"
							id="youtube"
							isSubmitting={isSubmitting}
						/>

						{(errors.root?.message || successMessage) && (
							<APIResponseMessage messageType={successMessage ? 'success' : 'error'}>
								{errors.root?.message ? errors.root.message : successMessage}
							</APIResponseMessage>
						)}

						<div className={styles.submitBtns}>
							<FormBtn type="submit" isSubmitting={isSubmitting} className={isDirty ? styles.submitBtn : ''}>
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

export default IntegrationsSocialLinks
