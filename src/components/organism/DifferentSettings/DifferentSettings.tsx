import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { FormProvider, useForm, useWatch, type SubmitHandler } from 'react-hook-form'
import { differentDefaults, differentSchema, type differentTypes } from '../../../types/settingsSchema'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import WrapperBox from '../../atoms/WrapperBox/WrapperBox'
import RHFCheckbox from '../../atoms/RHFCheckbox/RHFCheckbox'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import SwitchButton from '../../atoms/SwitchButton/SwitchButton'
import styles from './DifferentSettings.module.scss'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import { useUpdateDifferentSettingsMutation } from '../../../slices/api/settingsApi'
import useMenuContext from '../../../hooks/useMenuContext'


const DifferentSettings = () => {
	const [successMessage, setSuccessMessage] = useState<string>('')
	const [updateSettings] = useUpdateDifferentSettingsMutation()
	const { different } = useMenuContext()
	const methods = useForm<differentTypes>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		resolver: zodResolver(differentSchema),
		defaultValues: differentDefaults,
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

	const [searchEngine, contactForm,subscriptions] = useWatch({
		control,
		name: ['searchEngine', 'contactForm','subscriptions'],
	})

	const onSubmit: SubmitHandler<differentTypes> = async data => {
		try {
			if (!data) return
			if (!isDirty) return

			const res = await updateSettings({ different: data }).unwrap()

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
		Object.entries(differentDefaults).forEach(([key, value]) => {
			setValue(key as keyof differentTypes, value, {
				shouldDirty: true,
			})
		})
	}
	useEffect(() => {
		if (different) reset(different)
	}, [different, reset])

	useEffect(() => {
		if (errors.root?.message) {
			const timer = setTimeout(() => {
				clearErrors('root')
				reset(different)
			}, 5000)

			return () => clearTimeout(timer)
		}
		if (successMessage) {
			const timer = setTimeout(() => {
				setSuccessMessage('')
			}, 5000)

			return () => clearTimeout(timer)
		}
	}, [clearErrors, different, errors.root?.message, reset, successMessage])

	return (
		<FormProvider {...methods}>
			<WrapperBox>
				<p className={styles.boxTitle}>Different Settings</p>
				<form onSubmit={handleSubmit(onSubmit)} aria-busy={isSubmitting} className={styles.formWrapper}>
					<RHFCheckbox
						name="searchEngine"
						id="searchEngine"
						label="Search Engine"
						styles={styles}
						isSubmitting={isSubmitting}>
						<SwitchButton switchButton={searchEngine} isSubmitting={isSubmitting} />
					</RHFCheckbox>
					<RHFCheckbox
						name="contactForm"
						id="contactForm"
						label="Contact Form"
						styles={styles}
						isSubmitting={isSubmitting}>
						<SwitchButton switchButton={contactForm} isSubmitting={isSubmitting} />
					</RHFCheckbox>
					<RHFCheckbox
						name="subscriptions"
						id="subscriptions"
						label="Subscriptions"
						styles={styles}
						isSubmitting={isSubmitting}>
						<SwitchButton switchButton={subscriptions} isSubmitting={isSubmitting} />
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
	)
}

export default DifferentSettings
