import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import styles from './Ads.module.scss'
import { zodResolver } from '@hookform/resolvers/zod'
import WrapperBox from '../../atoms/WrapperBox/WrapperBox'
import { AD_SLOTS, adsSchema, defaultAds, type AdsTypes } from '../../../types/adsSchema'
import RHFInput from '../../atoms/RHFInput/RHFInput'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import { useEffect, useState } from 'react'

import AdSlot from '../../modules/AdSlot/AdSlot'
import { useCreateAdsMutation, useFetchAdsQuery } from '../../../slices/api/adApi'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

const Ads = () => {
	const [successMessage, setSuccessMessage] = useState<string>('')

	const [createAd] = useCreateAdsMutation()
	const { data } = useFetchAdsQuery({})
	
	const methods = useForm({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		resolver: zodResolver(adsSchema),
		defaultValues: defaultAds,
	})
	const {
		handleSubmit,
		reset,
		setError,
		formState: { isSubmitting, errors, isDirty },
	} = methods

	const onSubmit: SubmitHandler<AdsTypes> = async data => {
		try {
			if (!data) return

			const res = await createAd(data).unwrap()

			if (res) {
				setSuccessMessage(res.message)
			}
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
		if (data) reset(data)
	}, [data, reset])

	useEffect(() => {
		if (successMessage) {
			setTimeout(() => {
				setSuccessMessage('')
			}, 5000)
		}
	}, [successMessage])
	const handleResetFields = () => {
		reset(defaultAds)
	}

	return (
		<div className={styles.adsWrapper}>
			<FormProvider {...methods}>
				<WrapperBox>
					<h3 className={styles.boxTitle}>Advertisements</h3>

					<form aria-busy={isSubmitting} onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
						<RHFInput
							styles={styles}
							type="text"
							name="client"
							label="Client"
							id="client"
							isSubmitting={isSubmitting}
						/>

						{AD_SLOTS.map(slot => {
							return <AdSlot key={slot.key} slot={slot} styles={styles} isSubmitting={isSubmitting} />
						})}

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

export default Ads
