import styles from './InteractionsSettings.module.scss'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { FormProvider, useForm, useWatch, type SubmitHandler } from 'react-hook-form'
import { interactionsDefaults, interactionSchema, type interactionTypes } from '../../../types/settingsSchema'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import WrapperBox from '../../atoms/WrapperBox/WrapperBox'
import SwitchButton from '../../atoms/SwitchButton/SwitchButton'
import RHFCheckbox from '../../atoms/RHFCheckbox/RHFCheckbox'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import { useUpdateInteractionSettingsMutation } from '../../../slices/api/settingsApi'
import useGlobalContext from '../../../hooks/useGlobalContext'

const InteractionsSettings = () => {
	const [successMessage, setSuccessMessage] = useState<string>('')

	const [updateSettings] = useUpdateInteractionSettingsMutation()

	const { interactions } = useGlobalContext()

	const methods = useForm<interactionTypes>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		resolver: zodResolver(interactionSchema),
		defaultValues: interactionsDefaults,
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

	const [commentsEnabled, moderation, likesEnabled] = useWatch({
		control,
		name: ['commentsEnabled', 'moderation', 'likesEnabled'],
	})

	const onSubmit: SubmitHandler<interactionTypes> = async data => {
		try {
			if (!data) return
			if (!isDirty) return
			const res = await updateSettings({ interactions: data }).unwrap()

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
		Object.entries(interactionsDefaults).forEach(([key, value]) => {
			setValue(key as keyof interactionTypes, value, {
				shouldDirty: true,
			})
		})
	}

	useEffect(() => {
		if (interactions) reset(interactions)
	}, [interactions, reset])

	useEffect(() => {
		if (errors.root?.message) {
			const timer = setTimeout(() => {
				clearErrors('root')
				reset(interactions)
			}, 5000)

			return () => clearTimeout(timer)
		}
		if (successMessage) {
			const timer = setTimeout(() => {
				setSuccessMessage('')
			}, 5000)

			return () => clearTimeout(timer)
		}
	}, [clearErrors, interactions, errors.root?.message, reset, successMessage])

	return (
		<div className={styles.interactionsSettingsWrapper}>
			<FormProvider {...methods}>
				<WrapperBox>
					<p className={styles.boxTitle}>Interaction Settings</p>
					<form onSubmit={handleSubmit(onSubmit)} aria-busy={isSubmitting} className={styles.formWrapper}>
						<RHFCheckbox
							name="commentsEnabled"
							id="comments"
							label="Comments"
							styles={styles}
							isSubmitting={isSubmitting}>
							<SwitchButton switchButton={commentsEnabled} isSubmitting={isSubmitting} />
						</RHFCheckbox>

						<RHFCheckbox
							name="moderation"
							id="moderation"
							label="Comments moderation"
							styles={styles}
							isSubmitting={isSubmitting}>
							<SwitchButton switchButton={moderation} isSubmitting={isSubmitting} />
						</RHFCheckbox>
						<RHFCheckbox name="likesEnabled" id="likes" label="Likes" styles={styles} isSubmitting={isSubmitting}>
							<SwitchButton switchButton={likesEnabled} isSubmitting={isSubmitting} />
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

export default InteractionsSettings
