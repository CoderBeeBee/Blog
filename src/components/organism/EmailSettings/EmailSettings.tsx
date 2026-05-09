import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import styles from './EmailSettings.module.scss'
import RHFInput from '../../atoms/RHFInput/RHFInput'
import { zodResolver } from '@hookform/resolvers/zod'
import RHFSelect from '../../atoms/RHFSelect/RHFSelect'
import { useEffect, useState } from 'react'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import { useCreateSMTPMutation, useFetchSMTPQuery } from '../../../slices/api/emailApi'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'

import { smtpDefaults, smtpSchema, type smtpTypes } from '../../../types/emailSchema'
import Breadcrumbs from '../../atoms/Breadcrumbs/Breadcrumbs'
import { ClearSVG, SaveSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import TestSMTP from '../../modules/TestSMTP/TestSMTP'

const EmailSettings = () => {
	const options = [{ name: 'true' }, { name: 'false' }]
	
	const [successMessage, setSuccessMessage] = useState<string>('')
	
	const { data: smtp } = useFetchSMTPQuery({})

	const [createSMTP] = useCreateSMTPMutation()
	
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
		if (smtp) reset({ ...smtp, secure: smtp.secure ? 'true' : 'false' })
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

	
	return (
		<div className={styles.emailSettingsWrapper}>
			<Breadcrumbs />
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
							tipMessage="Enter your email provider name, e.g. Gmail, Outlook, Zoho"
						/>
						<RHFInput
							type="text"
							name="host"
							label="Host"
							id="post"
							isSubmitting={isSubmitting}
							tipMessage="Enter your SMTP host address, e.g. smtp.gmail.com"
						/>
						<RHFInput
							type="number"
							name="port"
							label="Port"
							id="port"
							isSubmitting={isSubmitting}
							tipMessage="Enter your SMTP port, usually 465 (SSL) or 587 (TLS)"
						/>
						<RHFSelect
							name="secure"
							id="secure"
							label="Secure"
							options={options}
							isSubmitting={isSubmitting}
							tipMessage={`If port is 465 select "True", if port is 587 select "False"`}
						/>
						<RHFInput
							type="text"
							name="user"
							label="User"
							id="user"
							isSubmitting={isSubmitting}
							tipMessage="Enter your SMTP username or email address"
						/>
						<RHFInput
							type="password"
							name="password"
							label="Password"
							id="password"
							isSubmitting={isSubmitting}
							tipMessage="Enter your SMTP password or app password"
						/>

						<h3 className={styles.boxTitle}>Email sending settings </h3>
						<RHFInput
							type="text"
							name="fromName"
							label="Company Name"
							id="fromName"
							placeholder="company name"
							isSubmitting={isSubmitting}
							tipMessage="This name will appear as the email sender"
						/>
						<RHFInput
							type="text"
							name="fromEmail"
							label="Company Email"
							id="fromEmail"
							placeholder="company@example.com"
							isSubmitting={isSubmitting}
							tipMessage="Enter the email address used to send emails"
						/>
						<RHFInput
							type="text"
							name="replyTo"
							label="Reply to"
							id="replyTo"
							placeholder="support@example.com"
							isSubmitting={isSubmitting}
							tipMessage="Replies from recipients will be sent to this address"
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
								ariaLabel={`${isSubmitting ? 'Saving' : 'Save'}`}
								className={`${styles.submitBtn} ${isSubmitting ? styles.isSubmitting : ''} ${isDirty ? styles.save : ''}`}>
								{' '}
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
								ariaLabel="Clear"
								className={`${styles.submitBtn} ${styles.clearButton}`}
								handleResetFields={handleResetFields}>
								<ClearSVG /> Clear
							</FormBtn>
						</div>
					</form>
				</FormProvider>
			</div>

			<TestSMTP/>
		</div>
	)
}

export default EmailSettings
