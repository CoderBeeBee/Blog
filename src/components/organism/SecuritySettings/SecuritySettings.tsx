import { FormProvider, useForm, useWatch, type SubmitHandler } from 'react-hook-form'
import styles from './SecuritySettings.module.scss'
import { securityDefaults, securitySchema, type securityTypes } from '../../../types/settingsSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import WrapperBox from '../../atoms/WrapperBox/WrapperBox'
import RHFCheckbox from '../../atoms/RHFCheckbox/RHFCheckbox'
import SwitchButton from '../../atoms/SwitchButton/SwitchButton'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import { useUpdateSecuritySettingsMutation } from '../../../slices/api/settingsApi'
import useGlobalContext from '../../../hooks/useGlobalContext'
import RHFInput from '../../atoms/RHFInput/RHFInput'

const SecuritySettings = () => {
	const [successMessage, setSuccessMessage] = useState<string>('')

	const [updateSettings] = useUpdateSecuritySettingsMutation()
	const { security } = useGlobalContext()
	const methods = useForm<securityTypes>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		resolver: zodResolver(securitySchema),
		defaultValues: securityDefaults,
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

	const [registrationEnabled, loginEnabled, maintenanceMode] = useWatch({
		control,
		name: ['registrationEnabled', 'loginEnabled', 'maintenanceMode'],
	})

	const onSubmit: SubmitHandler<securityTypes> = async data => {
		try {
			if (!data) return
			if (!isDirty) return
			const res = await updateSettings({ security: data }).unwrap()

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
		Object.entries(securityDefaults).forEach(([key, value]) => {
			setValue(key as keyof securityTypes, value, {
				shouldDirty: true,
			})
		})
	}

	useEffect(() => {
		if (!maintenanceMode.maintenance && maintenanceMode.breakUntil !== null) {
			setValue('maintenanceMode.breakUntil', null)
		}
	}, [maintenanceMode.breakUntil, maintenanceMode.maintenance, setValue])

	useEffect(() => {
		if (security) {
			reset(security)
		}
	}, [reset, security])
	useEffect(() => {
		if (errors.root?.message) {
			const timer = setTimeout(() => {
				clearErrors('root')
				reset(security)
			}, 5000)

			return () => clearTimeout(timer)
		}
		if (successMessage) {
			const timer = setTimeout(() => {
				setSuccessMessage('')
			}, 5000)

			return () => clearTimeout(timer)
		}
	}, [clearErrors, errors.root?.message, reset, security, successMessage])
	return (
		<div className={styles.securityWrapper}>
			<FormProvider {...methods}>
				<WrapperBox>
					<p className={styles.boxTitle}>Security Settings</p>
					<form onSubmit={handleSubmit(onSubmit)} aria-busy={isSubmitting} className={styles.formWrapper}>
						<RHFCheckbox
							name="registrationEnabled"
							id="registration"
							label="Registration"
							styles={styles}
							isSubmitting={isSubmitting}>
							<SwitchButton switchButton={registrationEnabled} isSubmitting={isSubmitting} />
						</RHFCheckbox>
						<RHFCheckbox name="loginEnabled" id="login" label="Login" styles={styles} isSubmitting={isSubmitting}>
							<SwitchButton switchButton={loginEnabled} isSubmitting={isSubmitting} />
						</RHFCheckbox>
						<RHFCheckbox
							name="maintenanceMode.maintenance"
							id="maintenance"
							label="Maintenance"
							styles={styles}
							isSubmitting={isSubmitting}>
							<SwitchButton switchButton={maintenanceMode.maintenance} isSubmitting={isSubmitting} />
						</RHFCheckbox>
						<RHFInput
							type="datetime-local"
							name="maintenanceMode.breakUntil"
							id="breakUntil"
							label="Break until"
							isSubmitting={isSubmitting}
							styles={styles}
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

export default SecuritySettings
