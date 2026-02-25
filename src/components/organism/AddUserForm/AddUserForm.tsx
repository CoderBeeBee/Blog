import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import styles from './AddUserForm.module.scss'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import RHFInput from '../../atoms/RHFInput/RHFInput'
import RHFSelect from '../../atoms/RHFSelect/RHFSelect'
import { role } from '../../../utils/data'
import { useAdminCreateUserMutation } from '../../../slices/api/userApi'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useEffect, useState } from 'react'
import WrapperBox from '../../atoms/WrapperBox/WrapperBox'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'

const userSchema = z.object({
	name: z.string().trim().min(4, { message: 'Min 4 characters' }),
	email: z.email().trim(),
	password: z.string().trim().min(8, { message: 'Min 8 characters' }),
	role: z.string().min(1, { message: 'Select Role' }),
})
type userSchemaTypes = z.infer<typeof userSchema>
const AddUserForm = () => {
	const [successMessage, setSuccessMessage] = useState<string>('')
	const [adminCreateUser] = useAdminCreateUserMutation()

	const methods = useForm<userSchemaTypes>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		resolver: zodResolver(userSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			role: '',
		},
	})
	const {
		handleSubmit,
		reset,
		setError,
		formState: { isSubmitting, isDirty, errors },
	} = methods

	const onSubmit: SubmitHandler<userSchemaTypes> = async (data: userSchemaTypes) => {
		try {
			if (!data) return

			const res = await adminCreateUser(data).unwrap()

			if (res) {
				setSuccessMessage(res.message)

				reset()
			}
		} catch (error) {
			if (typeof error === 'object' && error !== null) {
				const fetchError = error as FetchBaseQueryError
				const message =
					fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data
						? (fetchError.data.message as string)
						: 'An unexpected error has occurred'
				const type =
					fetchError.data && typeof fetchError.data === 'object' && 'type' in fetchError.data
						? (fetchError.data.type as string)
						: 'An unexpected error has occurred'
				const errorMessage =
					fetchError.data && typeof fetchError.data === 'object' && 'error' in fetchError.data
						? (fetchError.data.error as string)
						: 'An unexpected error has occurred'
				if (type === 'name') {
					setError('name', { message })
				} else if (type === 'email') {
					setError('email', { message })
				} else {
					setError('root', { message: errorMessage })
				}
			} else {
				setError('root', { message: 'An unexpected error has occurred' })
			}
		}
	}

	useEffect(() => {
		if (successMessage)
			setTimeout(() => {
				setSuccessMessage('')
			}, 5000)
	}, [successMessage])

	const handleResetFields = () => {
		reset()
	}
	return (
		<div className={styles.addUserWrapper}>
			<FormProvider {...methods}>
				<WrapperBox>
					<p className={styles.addUserTitle}>Add User</p>
					<form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
						<RHFInput type="text" name="name" label="Name" styles={styles} id="name" isSubmitting={isSubmitting} />
						<RHFInput type="email" name="email" label="Email" styles={styles} id="email" isSubmitting={isSubmitting} />
						<RHFInput
							type="password"
							name="password"
							label="Password"
							styles={styles}
							id="password"
							isSubmitting={isSubmitting}
						/>
						<RHFSelect name="role" id="role" label="Role" options={role} styles={styles} isSubmitting={isSubmitting} />

						{(errors.root?.message || successMessage) && (
							<APIResponseMessage messageType={successMessage ? 'success' : 'error'}>
								{errors.root?.message ? errors.root.message : successMessage}
							</APIResponseMessage>
						)}

						<div className={styles.submitBtns}>
							<FormBtn
								type="submit"
								isSubmitting={isSubmitting}
								className={`${styles.submitBtn} ${isDirty ? styles.save : ''}`}>
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

export default AddUserForm
