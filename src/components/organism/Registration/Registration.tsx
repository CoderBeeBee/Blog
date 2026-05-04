import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import z from 'zod'
import { useCreateAccountMutation } from '../../../slices/api/userApi'
import { FormProvider, useForm, useWatch, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import styles from './Registration.module.scss'
import AnchorLink from '../../atoms/AnchorLink/AnchorLink'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import RHFInput from '../../atoms/RHFInput/RHFInput'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import RHFCheckbox from '../../atoms/RHFCheckbox/RHFCheckbox'
import CheckMark from '../../atoms/Checkmark/CheckMark'
import Logo from '../../atoms/logo/Logo'
import SocialLinks from '../../modules/SocialLinks/SocialLinks'

const registrationSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(4, { message: 'Name must have at least 4 characters' })
			.max(32, { message: 'The name is too long. Max 32 characters' }),
		email: z.email().trim(),
		password: z
			.string()
			.trim()
			.min(8, { message: 'Password must have at least 8 characters' })
			.max(32, { message: 'Password is too long' }),
		repeatPassword: z.string().trim(),
		consents: z.boolean().refine(v => v === true, { message: 'You must accept the Terms and Privacy Policy.' }),
	})
	.refine(data => data.password === data.repeatPassword, {
		message: 'Passwords do not match',
		path: ['repeatPassword'],
	})

type registrationFields = z.infer<typeof registrationSchema>

const Registration = () => {
	const [createAccount, { isSuccess }] = useCreateAccountMutation()

	const [successMessage, setSuccessMessage] = useState<string>('')

	const navigate = useNavigate()
	const methods = useForm<registrationFields>({
		mode: 'onChange',
		reValidateMode: 'onChange',
		resolver: zodResolver(registrationSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			repeatPassword: '',
			consents: false,
		},
	})
	const {
		control,
		handleSubmit,
		setError,
		reset,
		clearErrors,
		formState: { isSubmitting, errors },
	} = methods

	const [name, email, password, repeatPassword, consents] = useWatch({
		control,
		name: ['name', 'email', 'password', 'repeatPassword', 'consents'],
	})

	const onSubmit: SubmitHandler<registrationFields> = async data => {
		try {
			if (!data) return

			const res = await createAccount({
				name: data.name,
				email: data.email,
				password: data.password,
				consents: data.consents,
			}).unwrap()

			if (res) {
				setSuccessMessage(res.message)
				reset()
			}
		} catch (error) {
			if (typeof error === 'object' && error !== null) {
				const fetchError = error as FetchBaseQueryError
				const messageError =
					fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data
						? (fetchError.data.message as string)
						: 'An unexpected error has occurred'
				setError('root', { message: messageError })
			} else {
				setError('root', { message: 'An unexpected error has occurred' })
			}
		}
	}

	useEffect(() => {
		if (name || email || password || repeatPassword) {
			clearErrors('root')
		}
	}, [clearErrors, email, name, password, repeatPassword])

	useEffect(() => {
		if (isSuccess) {
			const timer = setTimeout(() => {
				navigate('/')
			}, 3000)

			return () => clearTimeout(timer)
		}
	}, [isSuccess, navigate])
	return (
		<FormProvider {...methods}>
			<div className={styles.registrationWrapper}>
				<Logo styles={styles} />
				<div className={styles.formContainer}>
					<h1>Create an account</h1>
					<p>
						Already have an account ? <AnchorLink href="/login">Sign In</AnchorLink>
					</p>
					<form aria-busy={isSubmitting} onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
						<RHFInput
							type="text"
							name="name"
							id="name"
							label="Name"
							placeholder="Enter your name"
							isSubmitting={isSubmitting}
							tip={false}
							/>
						<RHFInput
							type="email"
							name="email"
							id="email"
							label="Email"
							placeholder="Enter your valid email address"
							isSubmitting={isSubmitting}
							tip={false}
							/>
						<RHFInput
							type="password"
							name="password"
							id="password"
							label="Password"
							placeholder="Enter your password"
							isSubmitting={isSubmitting}
							tip={false}
							/>
						<RHFInput
							type="password"
							name="repeatPassword"
							id="repeatPassword"
							label="Repeat Password"
							placeholder="Repeat your password"
							isSubmitting={isSubmitting}
							tip={false}
						/>
						<div className={styles.checkbox}>
							<RHFCheckbox name="consents" id="consents" isSubmitting={isSubmitting} >
								<>
									<CheckMark isChecked={consents} className={styles.checkMark} />
									<span>
										I have read and understood the <AnchorLink href="/terms-and-conditions">Terms</AnchorLink> and{' '}
										<AnchorLink href="/privacy-policy">Privacy Policy</AnchorLink>
									</span>
								</>
							</RHFCheckbox>
						</div>
						{(errors.root?.message || successMessage) && (
							<APIResponseMessage messageType={successMessage ? 'success' : 'error'} className={styles.apiResponse}>
								{errors.root?.message ? errors.root?.message : successMessage}
							</APIResponseMessage>
						)}
						<FormBtn isSubmitting={isSubmitting} type="submit" className={styles.signInButton}>
							{isSubmitting ? 'Creating...' : 'Create account'}
						</FormBtn>
					</form>
				</div>
				<div className={styles.socialWrapper}>
					<p className={styles.followUs}>Follow us:</p>
					<div className={styles.linksBox}>
						<SocialLinks />
					</div>
				</div>
			</div>
		</FormProvider>
	)
}

export default Registration
