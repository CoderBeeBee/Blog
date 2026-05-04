import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import styles from './EmailSettings.module.scss'
import RHFInput from '../../atoms/RHFInput/RHFInput'
import { zodResolver } from '@hookform/resolvers/zod'
import RHFSelect from '../../atoms/RHFSelect/RHFSelect'
import { useEffect, useState } from 'react'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import { useCreateSMTPMutation, useFetchSMTPQuery, useTestSMTPMutation } from '../../../slices/api/emailApi'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'

import WrapperBox from '../../atoms/WrapperBox/WrapperBox'
import { smtpDefaults, smtpSchema, type smtpTypes } from '../../../types/emailSchema'

const EmailSettings = () => {
	const options = [{name:'true'},{name:'false'}]
	const [email, setEmail] = useState<string>('')
	const [successMessage, setSuccessMessage] = useState<string>('')
	const [testMessage, setTestMessage] = useState<string>('')
	const [errorTestMessage, setErrorTestMessage] = useState<string>('')
	const { data: smtp } = useFetchSMTPQuery({})

	const [createSMTP] = useCreateSMTPMutation()
	const [testSMTP, { isLoading }] = useTestSMTPMutation()
	const methods = useForm<smtpTypes>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		resolver: zodResolver(smtpSchema),
		defaultValues: smtpDefaults,
	})

	const {
		handleSubmit,
		reset,
		setError,
		clearErrors,
		formState: { isSubmitting, errors, isDirty },
	} = methods

	const onSubmit: SubmitHandler<smtpTypes> = async data => {
		try {
			if (!data) return
			if (!isDirty) return
			const res = await createSMTP(data).unwrap()

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
		if (smtp) reset(smtp)
	}, [reset, smtp])

	useEffect(() => {
		if (successMessage) {
			setTimeout(() => {
				setSuccessMessage('')
			}, 5000)
		}
	}, [successMessage])

	const handleResetFields = () => {
		reset(smtpDefaults)
	}

	const handleTestSMTP = async () => {
		try {
			if (!email) return setErrorTestMessage('Enter valid email address')
			const res = await testSMTP(email).unwrap()
			if (res) {
				setTestMessage(res.message)
				setEmail('')
			}
		} catch (error) {
			if (typeof error === 'object' && error !== null) {
				const fetchError = error as FetchBaseQueryError
				const message =
					fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data
						? (fetchError.data.message as string)
						: 'An unexpected error has occured'

				setErrorTestMessage(message)
			} else {
				setErrorTestMessage('An unexpected error has occured')
			}
		}
	}
	useEffect(() => {
		if (testMessage) {
			const timer = setTimeout(() => {
				setTestMessage('')
			}, 5000)

			return () => clearTimeout(timer)
		}
		if (errorTestMessage) {
			const timer = setTimeout(() => {
				setErrorTestMessage('')
			}, 5000)

			return () => clearTimeout(timer)
		}
	}, [errorTestMessage, testMessage])
	return (
		<div className={styles.emailSettingsWrapper}>
			<WrapperBox>
				<div className={styles.smtpWrapper}>
					<h3 className={styles.boxTitle}>SMTP</h3>

					<FormProvider {...methods}>
						<form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper} aria-busy={isSubmitting}>
							<RHFInput
								
								type="text"
								name="provider"
								label="Provider"
								id="provider"
								placeholder="ex. Gmail"
								isSubmitting={isSubmitting}
							/>
							<RHFInput  type="text" name="host" label="Host" id="post" isSubmitting={isSubmitting} />
							<RHFInput  type="number" name="port" label="Port" id="port" isSubmitting={isSubmitting} />
							<RHFSelect name="secure" id='secure' label="Secure" options={options}  isSubmitting={isSubmitting} />
							<RHFInput  type="text" name="user" label="User" id="user" isSubmitting={isSubmitting} />
							<RHFInput
								
								type="password"
								name="password"
								label="Password"
								id="password"
								isSubmitting={isSubmitting}
							/>

							<h3 className={styles.boxTitle}>Email sending settings </h3>
							<RHFInput
						
								type="text"
								name="fromName"
								label="Company Name"
								id="fromName"
								placeholder="company name"
								isSubmitting={isSubmitting}
							/>
							<RHFInput
								
								type="text"
								name="fromEmail"
								label="Company Email"
								id="fromEmail"
								placeholder="company@example.com"
								isSubmitting={isSubmitting}
							/>
							<RHFInput
								
								type="text"
								name="replyTo"
								label="Reply to"
								id="replyTo"
								placeholder="support@example.com"
								isSubmitting={isSubmitting}
							/>

							{(errors.root?.message || successMessage) && (
								<APIResponseMessage messageType={successMessage ? 'success' : 'error'}>
									{errors.root?.message ? errors.root.message : successMessage}
								</APIResponseMessage>
							)}

							<div className={styles.submitBtns}>
								<FormBtn
									type="submit"
									isSubmitting={isSubmitting}
									className={`${styles.submitBtn} ${isDirty && !isSubmitting ? styles.save : ''}`}>
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
			</WrapperBox>
			<WrapperBox>
				<div className={styles.testWrapper}>
					<label htmlFor="email" className={styles.boxTitle}>
						Email Test
					</label>

					<input
						type="email"
						name="Email"
						id="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						className={styles.testEmail}
						placeholder="example@example.com"
						readOnly={isLoading}
						aria-readonly={isLoading}
					/>

					{(testMessage || errorTestMessage) && (
						<APIResponseMessage className={styles.testMessage} messageType={testMessage ? 'succes' : 'error'}>
							{testMessage ? testMessage : <>{errorTestMessage}</>}
						</APIResponseMessage>
					)}
					<FormBtn
						type="button"
						isSubmitting={isLoading}
						className={`${email ? styles.testBtn : ''}`}
						handleResetFields={() => handleTestSMTP()}>
						Test
					</FormBtn>
				</div>
			</WrapperBox>
		</div>
	)
}

export default EmailSettings
