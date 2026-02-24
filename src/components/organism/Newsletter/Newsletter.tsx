import { useEffect, useState } from 'react'
import styles from './Newsletter.module.scss'
import { FormProvider, useForm, useWatch, type SubmitHandler } from 'react-hook-form'
import {
	newsletterDefault,
	newsletterSchema,
	shippingDays,
	type newsletterTypes,
} from '../../../types/newsletterSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import WrapperBox from '../../atoms/WrapperBox/WrapperBox'
import RHFInput from '../../atoms/RHFInput/RHFInput'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import RHFTextArea from '../../atoms/RHFTextArea/RHFTextArea'
import RHFSelect from '../../atoms/RHFSelect/RHFSelect'
import { useFetchNewsletterCampaignQuery, useNewsletterCampaignMutation } from '../../../slices/api/newsletterApi'
import RHFCheckbox from '../../atoms/RHFCheckbox/RHFCheckbox'
import SwitchButton from '../../atoms/SwitchButton/SwitchButton'
const shippingDay: Record<number, string> = {
	0: 'Sunday',
	1: 'Monday',
	2: 'Tuesday',
	3: 'Wednesday',
	4: 'Thursday',
	5: 'Friday',
	6: 'Saturday',
}
const Newsletter = () => {
	const [successMessage, setSuccessMessage] = useState<string>('')
	const [createNewsletter] = useNewsletterCampaignMutation()
	const { data } = useFetchNewsletterCampaignQuery({})
	
	const methods = useForm<newsletterTypes>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		resolver: zodResolver(newsletterSchema),
		defaultValues: newsletterDefault,
	})

	const {
		control,
		handleSubmit,
		reset,
		setError,
		clearErrors,
		formState: { isSubmitting, errors, isDirty },
	} = methods
	const [shippingEnabled] = useWatch({ control, name: ['shippingEnabled'] })
	const onSubmit: SubmitHandler<newsletterTypes> = async data => {
		try {
			if (!data) return
			if (!isDirty) return

			const res = await createNewsletter({ newsletter: data }).unwrap()

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
		if (data)
			reset({
				newsletterTitle: data.newsletterTitle,
				newsletterMessage: data.newsletterMessage,
				shippingDay: shippingDay[data.shippingDay],
				shippingTime: data.shippingTime,
				shippingEnabled: data.shippingEnabled,
			})
	}, [reset, data])

	useEffect(() => {
		if (successMessage) {
			setTimeout(() => {
				setSuccessMessage('')
			}, 5000)
		}
	}, [successMessage])

	const handleResetFields = () => {
		reset(newsletterDefault)
	}

	return (
		<div className={styles.newsletterWrapper}>
			<FormProvider {...methods}>
				<WrapperBox>
					<h3 className={styles.boxTitle}>Newsletter</h3>

					<form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper} aria-busy={isSubmitting}>
						<RHFInput
							styles={styles}
							type="text"
							name="newsletterTitle"
							label="Newsletter Title"
							id="newsletterTitle"
							isSubmitting={isSubmitting}
						/>

						<RHFTextArea
							styles={styles}
							name="newsletterMessage"
							label="Newsletter Message"
							id="newsletterMessage"
							isSubmitting={isSubmitting}
							className={styles.disableMinimarkdown}
						/>
						<RHFSelect
							styles={styles}
							options={shippingDays}
							name="shippingDay"
							label="Shipping day"
							id="shippingDay"
							isSubmitting={isSubmitting}
						/>
						<RHFInput
							styles={styles}
							type="number"
							name="shippingTime"
							label="Shipping Hour"
							id="shippingTime"
							isSubmitting={isSubmitting}
						/>
						<div className={styles.shippingEnabled}>
							<RHFCheckbox
								name="shippingEnabled"
								id="shippingEnabled"
								label="Shipping Enable"
								styles={styles}
								isSubmitting={isSubmitting}>
								<SwitchButton switchButton={shippingEnabled} isSubmitting={isSubmitting} />
							</RHFCheckbox>
						</div>

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

export default Newsletter
