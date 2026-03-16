import { useDispatch } from 'react-redux'
import { useAdminLoginMutation} from '../../../slices/api/userApi'
import styles from './AdminLogin.module.scss'
import { useNavigate } from 'react-router'
import { FormProvider, useForm, useWatch, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { setData, setLogin } from '../../../slices/authSlice'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import z from 'zod'
import AnchorLink from '../../atoms/AnchorLink/AnchorLink'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import RHFInput from '../../atoms/RHFInput/RHFInput'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import Logo from '../../atoms/logo/Logo'
import { GlobalProvider } from '../../../context/globalContext'

const adminloginSchema = z.object({
	email: z.email(),
	password: z.string().min(8, { message: 'Min 8 characters' }),
})

type adminloginFields = z.infer<typeof adminloginSchema>

const AdminLogin = () => {
	const [adminLogin, { isSuccess }] = useAdminLoginMutation()

	const dispatch = useDispatch()

	const navigate = useNavigate()

	const methods = useForm<adminloginFields>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		resolver: zodResolver(adminloginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const {
		control,
		handleSubmit,
		setError,
		clearErrors,
		formState: { isSubmitting, errors },
	} = methods

	const [password, email] = useWatch({
		control,
		name: ['password', 'email'],
	})

	const onSubmit: SubmitHandler<adminloginFields> = async data => {
		try {
			if (!data) return

			const res = await adminLogin({ email: data.email, password: data.password }).unwrap()

			if (res) {
				dispatch(setLogin(true))
				dispatch(setData(res))
			}
			if (errors.root?.message) clearErrors('root')
		} catch (error) {
			if (typeof error === 'object' && error !== null) {
				const fetchError = error as FetchBaseQueryError
				const messageError =
					fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data
						? (fetchError.data.message as string)
						: 'An unexpected error has occured'
				setError('root', { message: messageError })
			} else {
				setError('root', { message: 'An unexpected error has occured' })
			}
		}
	}
	useEffect(() => {
		if (password || email) {
			clearErrors('root')
		}
	}, [clearErrors, email, password])

	useEffect(() => {
		if (isSuccess) {
			navigate('/admin')
		}
	}, [isSuccess, navigate])
	return (
		<GlobalProvider>
			<FormProvider {...methods}>
				<div className={styles.loginWrapper}>
					<Logo styles={styles} />
					<div className={styles.formContainer}>
						<h1>Sign In</h1>
						
						<form aria-busy={isSubmitting} onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
							<RHFInput
								type="email"
								name="email"
								id="email"
								styles={styles}
								placeholder="Enter your email"
								isSubmitting={isSubmitting}
							/>
							<RHFInput
								type="password"
								name="password"
								id="password"
								styles={styles}
								placeholder="Enter your password"
								isSubmitting={isSubmitting}
							/>
							<AnchorLink className={`${styles.forgotPassword}`} href={`/reset-password?email=${email}`}>
								Forgot Password?
							</AnchorLink>
							{errors.root?.message && (
								<APIResponseMessage messageType="error" className={styles.apiResponse}>
									{errors.root?.message}
								</APIResponseMessage>
							)}
							<FormBtn type="submit" className={styles.signInButton} isSubmitting={isSubmitting}>
								{isSubmitting ? 'Sign In...' : 'Sign In'}
							</FormBtn>
						</form>
					</div>
					
				</div>
			</FormProvider>
		</GlobalProvider>
	)
}

export default AdminLogin
