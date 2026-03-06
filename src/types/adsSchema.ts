import z from 'zod'
export const AD_SLOTS = [
	{
		key: 'postsSection',
		label: 'Posts section slot',
	},
	{
		key: 'singlePost',
		label: 'Single post slot',
	},
	// {
	// 	key: 'sidebar',
	// 	label: 'Sidebar slot',
	// },
] as const
export const slotSchema = z.object({
	slot: z.string().min(1, { message: 'Required' }),
	enableAd: z.boolean(),
})

export const adsSchema = z.object({
	client: z.string().min(1),
	slots: z.record(z.string(), slotSchema),
})

export type AdsTypes = z.infer<typeof adsSchema>

export const defaultAds: AdsTypes = {
	client: '',
	slots: Object.fromEntries(
		AD_SLOTS.map(slot => [
			slot.key,
			{
				slot: '',
				enableAd: false,
			},
		]),
	),
}
