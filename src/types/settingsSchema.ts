import z from 'zod'
import validateImageRHF from '../hooks/validateImageRHF'

const imageSrcSchema = z.instanceof(File).or(z.string()).nullable()

export const generalSchema = z.object({
	siteName: z.string().trim().min(1, { message: 'Field is required' }),
	siteUrl: z.string().trim().min(1, { message: 'Field is required' }),
	logo: z.object({
		src: imageSrcSchema.superRefine(
			validateImageRHF({
				maxSizeMB: 3,
				minWidth: 400,
				minHeight: 160,
				maxWidth: 400,
				maxHeight: 160,
			}),
		),
		public_id: z.string(),
	}),
	favicon: z.object({
		src: imageSrcSchema.superRefine(
			validateImageRHF({
				maxSizeMB: 3,
				minWidth: 512,
				minHeight: 512,
				maxWidth: 512,
				maxHeight: 512,
			}),
		),
		public_id: z.string().optional(),
	}),
})

export const securitySchema = z.object({
	registrationEnabled: z.boolean(),
	loginEnabled: z.boolean(),
	maintenanceMode: z.object({
		maintenance: z.boolean(),

		breakUntil: z
			.date()
			.nullable()
			.refine(d => d === null || d > new Date(), 'The date must be in the future.'),
	}),
})

export const postsSchema = z.object({
	heroPostLimit: z
		.number({
			message: 'Field is required',
		})
		.int('Limit must be an integer')
		.min(1, 'Limit must be greater than 0')
		.max(8, 'Limit must be less than 8'),
	postPerPage: z
		.number({
			message: 'Field is required',
		})
		.int('Limit must be an integer')
		.min(1, 'Limit must be greater than 0')
		.max(30, 'Limit must be less than 30'),
})

export const interactionSchema = z.object({
	commentsEnabled: z.boolean(),
	moderation: z.boolean(),
	likesEnabled: z.boolean(),
})

export const analyticsSchema = z.object({
	analyticsEnabled: z.boolean(),
})

export const differentSchema = z.object({
	searchEngine: z.boolean(),
	contactForm: z.boolean(),
	subscriptions:z.boolean()
})

export type generalTypes = z.infer<typeof generalSchema>
export type securityTypes = z.infer<typeof securitySchema>
export type postsTypes = z.infer<typeof postsSchema>
export type interactionTypes = z.infer<typeof interactionSchema>
export type analyticsTypes = z.infer<typeof analyticsSchema>
export type differentTypes = z.infer<typeof differentSchema>

export const generalDefaults: generalTypes = {
	siteName: '',
	siteUrl: '',
	logo: {
		src: null,
		public_id: '',
	},
	favicon: {
		src: null,
		public_id: '',
	},
}
export const analyticsDefaults: analyticsTypes = {
	analyticsEnabled: false,
}
export const differentDefaults: differentTypes = {
	searchEngine: false,
	contactForm: false,
	subscriptions:false
}
export const postsDefaults: postsTypes = {
	heroPostLimit: 0,
	postPerPage: 0,
}
export const interactionsDefaults: interactionTypes = {
	commentsEnabled: false,
	moderation: false,
	likesEnabled: false,
}
export const securityDefaults: securityTypes = {
	registrationEnabled: false,
	loginEnabled: false,
	maintenanceMode: {
		maintenance: false,
		breakUntil: null,
	},
}
