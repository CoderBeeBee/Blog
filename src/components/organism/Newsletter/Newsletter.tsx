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

import RHFInput from '../../atoms/RHFInput/RHFInput'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import RHFTextArea from '../../atoms/RHFTextArea/RHFTextArea'
import RHFSelect from '../../atoms/RHFSelect/RHFSelect'
import { useFetchNewsletterCampaignQuery, useNewsletterCampaignMutation } from '../../../slices/api/newsletterApi'
import RHFCheckbox from '../../atoms/RHFCheckbox/RHFCheckbox'
import SwitchButton from '../../atoms/SwitchButton/SwitchButton'
import { ClearSVG, SaveSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import Breadcrumbs from '../../atoms/Breadcrumbs/Breadcrumbs'


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
		if (data) {
			
			
			reset(data)
		}
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
			<Breadcrumbs />
			<FormProvider {...methods}>
				<form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper} aria-busy={isSubmitting}>
					<RHFInput
						type="text"
						name="newsletterTitle"
						label="Title"
						id="newsletterTitle"
						isSubmitting={isSubmitting}
						tipMessage="Enter newsletter title"
					/>

					<RHFTextArea
						name="newsletterMessage"
						label="Message"
						id="newsletterMessage"
						isSubmitting={isSubmitting}
						className={styles.disableMinimarkdown}
						tipMessage="Enter newsletter message"
					/>
					<RHFSelect
						options={shippingDays}
						name="shippingDay"
						label="Shipping day"
						id="shippingDay"
						isSubmitting={isSubmitting}
						tipMessage="Enter the shipping day. The order will be shipped on that day."
					/>
					<RHFInput
						type="number"
						name="shippingTime"
						label="Shipping Hour"
						id="shippingTime"
						isSubmitting={isSubmitting}
						tipMessage="Enter the hour (from 0 to 23). The shipment will be processed at that time."
					/>
					<div className={styles.shippingEnabled}>
						<RHFCheckbox
							name="shippingEnabled"
							id="shippingEnabled"
							label="Shipping Enable"
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
							isSubmitting={isSubmitting || !isDirty}
							ariaLabel={`${isSubmitting ? 'Saving' : 'Save'}`}
							className={`${styles.submitBtn} ${isSubmitting ? styles.isSubmitting : ''} ${isDirty ? styles.save : ''}`}>
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
							className={`${styles.submitBtn} ${styles.clearButton}`}
							handleResetFields={handleResetFields}>
							<ClearSVG />
							Clear
						</FormBtn>
					</div>
				</form>
			</FormProvider>
		</div>
	)
}

export default Newsletter
