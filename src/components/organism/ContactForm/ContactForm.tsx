import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm, useWatch, type SubmitHandler } from 'react-hook-form'
import z from 'zod'
import styles from './ContactForm.module.scss'
import RHFInput from '../../atoms/RHFInput/RHFInput'
import RHFTextArea from '../../atoms/RHFTextArea/RHFTextArea'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import { useContactEmailMutation } from '../../../slices/api/emailApi'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import { useEffect, useState } from 'react'
import RHFCheckbox from '../../atoms/RHFCheckbox/RHFCheckbox'
import AnchorLink from '../../atoms/AnchorLink/AnchorLink'
import CheckMark from '../../atoms/Checkmark/CheckMark'
import useGlobalContext from '../../../hooks/useGlobalContext'
import SocialLinks from '../../modules/SocialLinks/SocialLinks'

const contactSchema = z.object({
	firstName: z.string().trim().min(1, { message: 'First name is required' }),
	lastName: z.string().trim().min(1, { message: 'Last name is required' }),
	email: z.email(),
	subject: z.string().trim().min(1, { message: 'Subject is required' }),
	message: z.string().trim().min(1, { message: 'Message is required' }),
	policy: z.boolean().refine(val => val === true, {
		message: 'You must accept the Privacy Policy',
	}),
})
type contactTypes = z.infer<typeof contactSchema>
const ContactForm = () => {
	const [successMessage, setSuccessMessage] = useState<string>('')
	const [sendEmail] = useContactEmailMutation()
	const { basic } = useGlobalContext()
	const faviconSrc = typeof basic?.favicon?.src === 'string' ? basic.favicon.src : undefined
	const methods = useForm<contactTypes>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		resolver: zodResolver(contactSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			subject: '',
			message: '',
			policy: false,
		},
	})

	const {
		control,
		handleSubmit,
		reset,
		setError,
		formState: { isSubmitting, errors },
	} = methods

	const policy = useWatch({ control, name: 'policy' })

	const onSubmit: SubmitHandler<contactTypes> = async data => {
		try {
			if (!data) return

			const { firstName, lastName, email, subject, message, policy } = data

			if (!policy) return
			const res = await sendEmail({ firstName, lastName, email, subject, message }).unwrap()

			if (res) {
				setSuccessMessage(res.message)
				reset()
			}
			setError('root', { message: '' })
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

	useEffect(() => {
		if (successMessage) {
			const timer = setTimeout(() => {
				setSuccessMessage('')
			}, 5000)

			return () => clearTimeout(timer)
		}
	}, [successMessage])

	return (
		<FormProvider {...methods}>
			<div className={styles.contactContainer}>
				<div className={styles.contactInfo}>
					<img src={faviconSrc} className={styles.favIcon} alt="FavIcon" />
					<p className={styles.companyInfo}>
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam sunt quos sed! Eaque porro libero debitis
						architecto, cum quos suscipit!
					</p>
					<h3 className={styles.subTitle}>Our Office</h3>
					<span className={styles.companyAddress}>00-000 Unknow St. Unknown, Unknow</span>
					<div className={styles.socialWrapper}>
						<p className={styles.followUs}>Follow us:</p>
						<div className={styles.linksBox}>
							<SocialLinks />
						</div>
					</div>
				</div>
				<form onSubmit={handleSubmit(onSubmit)} aria-busy={isSubmitting} className={styles.contactForm}>
					<div className={styles.senderName}>
						<RHFInput
							type="text"
							name="firstName"
							id="firstName"
							label="First Name"
							placeholder="Enter your First Name"
							isSubmitting={isSubmitting}
							tip={false}
							/>
						<RHFInput
							type="text"
							name="lastName"
							id="lastName"
							label="Last Name"
							isSubmitting={isSubmitting}
							placeholder="Enter your Last Name"
							tip={false}
							/>
					</div>
					<RHFInput
						type="email"
						name="email"
						label="Adress email"
						id="email"
						isSubmitting={isSubmitting}
						placeholder="Enter a valid email address"
						tip={false}
						/>
					<RHFInput
						type="text"
						name="subject"
						label="Subject"
						id="subject"
						isSubmitting={isSubmitting}
						placeholder="Enter subject"
						tip={false}
						/>
					<RHFTextArea
						name="message"
						id="message"
						label="Message"
						isSubmitting={isSubmitting}
						placeholder="Enter your message"
						markdown={false}
						tip={false}
					/>
					<div className={styles.checkbox}>
						<RHFCheckbox name="policy" id="policy" styles={styles} isSubmitting={isSubmitting}>
							<>
								<CheckMark isChecked={policy} className={styles.checkMark} />
								<span>
									I have read and understood the <AnchorLink href="/privacy-policy">Privacy Policy</AnchorLink> and{' '}
									<AnchorLink href="/terms-and-conditions">Terms and Conditions</AnchorLink>
								</span>
							</>
						</RHFCheckbox>
					</div>

					{(errors.root?.message || successMessage) && (
						<APIResponseMessage messageType={successMessage ? 'success' : 'error'}>
							{errors.root?.message ? errors.root.message : successMessage}
						</APIResponseMessage>
					)}

					<FormBtn type="submit" isSubmitting={isSubmitting} className={styles.sendMessage}>
						Send
					</FormBtn>
				</form>
			</div>
		</FormProvider>
	)
}

export default ContactForm
