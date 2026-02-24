import z from 'zod'

export const newsletterSchema = z.object({
	newsletterTitle: z.string().trim().min(1, { message: 'Field is required' }),
	newsletterMessage: z.string().trim().min(1, { message: 'Field is required' }),
	shippingDay: z.string().trim().min(1, { message: 'Field is required' }),
	shippingTime: z
		.number({
			message: 'Field is required',
		})
		.int('Limit must be an integer')
		.min(0, 'Min 0')
		.max(23, 'Max 23'),
	shippingEnabled: z.boolean(),
})
export type newsletterTypes = z.infer<typeof newsletterSchema>

export const newsletterDefault: newsletterTypes = {
	newsletterTitle: '',
	newsletterMessage: '',
	shippingDay: '',
	shippingTime: 0,
	shippingEnabled: false,
}


export const shippingDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']