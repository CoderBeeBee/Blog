import z from 'zod'

export const newsletterSchema = z.object({
	newsletterTitle: z.string().trim().min(1, { message: 'Newsletter title is required' }),
	newsletterMessage: z.string().trim().min(1, { message: 'Newsletter message is required' }),
	shippingDay: z.string().trim().min(1, { message: 'Shipping day is required' }),
	shippingTime: z
		.number({
			message: 'Shipping time is required',
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


export const shippingDays: { id: number; name: string }[] = [
	{ id: 0, name: 'Sunday' },
	{ id: 1, name: 'Monday' },
	{ id: 2, name: 'Tuesday' },
	{ id: 3, name: 'Wednesday' },
	{ id: 4, name: 'Thursday' },
	{ id: 5, name: 'Friday' },
	{ id: 6, name: 'Saturday' },
]
