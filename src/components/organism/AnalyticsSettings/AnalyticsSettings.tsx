import { FormProvider, useForm, useWatch, type SubmitHandler } from 'react-hook-form'
import { analyticsDefaults, analyticsSchema, type analyticsTypes } from '../../../types/settingsSchema'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import WrapperBox from '../../atoms/WrapperBox/WrapperBox'
import styles from './AnalyticsSettings.module.scss'
import RHFCheckbox from '../../atoms/RHFCheckbox/RHFCheckbox'
import SwitchButton from '../../atoms/SwitchButton/SwitchButton'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import { useUpdateAnalyticsSettingsMutation } from '../../../slices/api/settingsApi'
import useGlobalContext from '../../../hooks/useGlobalContext'
const AnalyticsSettings = () => {
	const [successMessage, setSuccessMessage] = useState<string>('')
	const [updateSettings] = useUpdateAnalyticsSettingsMutation()
	const { analytics } = useGlobalContext()
	const methods = useForm<analyticsTypes>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		resolver: zodResolver(analyticsSchema),
		defaultValues: analyticsDefaults,
	})

	const {
		control,
		handleSubmit,
		reset,
		setError,
		setValue,
		clearErrors,
		formState: { isSubmitting, errors, isDirty },
	} = methods

	const [analyticsEnabled] = useWatch({
		control,
		name: ['analyticsEnabled'],
	})

	const onSubmit: SubmitHandler<analyticsTypes> = async data => {
		try {
			if (!data) return
			if (!isDirty) return

			const res = await updateSettings({ analytics: data }).unwrap()

			if (res) {
				setSuccessMessage(res.message)
				reset(data)
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
		Object.entries(analyticsDefaults).forEach(([key, value]) => {
			setValue(key as keyof analyticsTypes, value, {
				shouldDirty: true,
			})
		})
	}
	useEffect(() => {
		if (analytics) reset(analytics)
	}, [analytics, reset])

	useEffect(() => {
		if (errors.root?.message) {
			const timer = setTimeout(() => {
				clearErrors('root')
				reset(analytics)
			}, 5000)

			return () => clearTimeout(timer)
		}
		if (successMessage) {
			const timer = setTimeout(() => {
				setSuccessMessage('')
			}, 5000)

			return () => clearTimeout(timer)
		}
	}, [analytics, clearErrors, errors.root?.message, reset, successMessage])
	return (
		<div className={styles.analyticsSettingsWrapper}>
			<FormProvider {...methods}>
				<WrapperBox>
					<p className={styles.boxTitle}>Analytics Settings</p>
					<form onSubmit={handleSubmit(onSubmit)} aria-busy={isSubmitting} className={styles.formWrapper}>
						<RHFCheckbox
							name="analyticsEnabled"
							id="analytics"
							label="Analytics"
							
							isSubmitting={isSubmitting}>
							<SwitchButton switchButton={analyticsEnabled} isSubmitting={isSubmitting} />
						</RHFCheckbox>

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

export default AnalyticsSettings
