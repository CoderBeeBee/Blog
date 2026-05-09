import z from 'zod'
import styles from './TestSMTP.module.scss'
import { useEffect, useState } from 'react'
import { useTestSMTPMutation } from '../../../slices/api/emailApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import RHFInput from '../../atoms/RHFInput/RHFInput'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import { CheckSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'

const testSMTPSchema = z.object({
	email: z.email().trim(),
})

type testSMTPTypes = z.infer<typeof testSMTPSchema>

const TestSMTP = () => {
	const [successMessage, setSuccessMessage] = useState<string>('')
	const [testSMTP, { isSuccess }] = useTestSMTPMutation()

	const methods = useForm<testSMTPTypes>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		resolver: zodResolver(testSMTPSchema),
		defaultValues: {
			email: '',
		},
	})
	const {
		handleSubmit,
		reset,
		setError,
		clearErrors,
		formState: { isSubmitting, errors, isDirty },
	} = methods

	const onSubmit: SubmitHandler<testSMTPTypes> = async data => {
		try {
			if (!data) return
			if (!isDirty) return
			const res = await testSMTP(data.email).unwrap()

			if (res) {
				setSuccessMessage(res.message)
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
		if (isSuccess) {
			reset()

			const timer = setTimeout(() => {
				setSuccessMessage('')
			}, 5000)

			return () => clearTimeout(timer)
		}
	}, [isSuccess, reset])

	return (
		<div className={styles.testWrapper}>
			<FormProvider {...methods}>
				<h3 className={styles.boxTitle}>Email Test</h3>
				<form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper} aria-busy={isSubmitting}>
					<RHFInput
						type="email"
						name="email"
						label="Email"
						id="email"
						placeholder="email@example.com"
						isSubmitting={isSubmitting}
						tipMessage="Enter the email address to test it "
					/>

					{(errors.root?.message || successMessage) && (
						<APIResponseMessage className={styles.testMessage} messageType={successMessage ? 'succes' : 'error'}>
							{errors.root?.message ? errors.root.message : successMessage}
						</APIResponseMessage>
					)}
					<div className={styles.submitBtns}>
						<FormBtn
							type="submit"
							isSubmitting={isSubmitting}
							ariaLabel={`${isSubmitting ? 'Checking' : 'Check'}`}
							className={`${styles.submitBtn} ${isSubmitting ? styles.isSubmitting : ''} ${isDirty ? styles.checkTest : ''}`}>
							{' '}
							<CheckSVG />{' '}
							{isSubmitting ? (
								<>
									Checking
									<span className={styles.animate1}>.</span>
									<span className={styles.animate2}>.</span>
									<span className={styles.animate3}>.</span>
								</>
							) : (
								'Check'
							)}
						</FormBtn>
					</div>
				</form>
			</FormProvider>
		</div>
	)
}

export default TestSMTP
