import z from 'zod'
import validateImageRHF from '../hooks/validateImageRHF'

export const categorySchema = z.object({
	name: z
		.string()
		.trim()
		.min(4, { message: 'The name is too short. Min 4 characters' })
		.max(50, { message: 'The name is too long. Max 50 characters' }),
	slug: z
		.string()
		.trim()
		.min(4, { message: 'The permalink is too short.Min 4 characters' })
		.max(100, { message: 'The permalink is too long. Max 100 characters' }),
	description: z
		.string()
		.trim()
		.min(50, { message: 'The description is too short. Min 50 characters' })
		.max(300, { message: 'The description is too long. Max 300 characters' }),

	image: z.object({
		src: z
			.instanceof(File)
			.or(z.string())
			.nullable()
			.superRefine(validateImageRHF({ maxSizeMB: 1, minWidth: 1100, minHeight: 600, maxWidth: 1200, maxHeight: 700 })),
		public_id: z.string(),
	}),

	metaTitle: z
		.string()
		.trim()
		.min(50, { message: 'The seo title is too short. Min 50 characters' })
		.max(60, { message: 'The seo title is too long. Max 60 characters' }),
	metaDescription: z
		.string()
		.trim()
		.min(120, { message: 'The seo description is too short. Min 120 characters' })
		.max(160, { message: 'The seo description is too long. Max 160 characters' }),
	metaImage: z.object({
		src: z
			.instanceof(File)
			.or(z.string())
			.nullable()
			.superRefine(validateImageRHF({ maxSizeMB: 1, minWidth: 1100, minHeight: 600, maxWidth: 1200, maxHeight: 700 })),
		public_id: z.string(),
	}),

	parent: z.string().nullable(),
	status: z.string().min(1, { message: 'Select status' }),
})

export type categoryTypes = z.infer<typeof categorySchema>

export const defaultCategory: categoryTypes = {
	name: '',
	slug: '',
	description: '',
	parent: null,
	status: 'Draft',
	image: {
		src: null,
		public_id: '',
	},
	metaTitle: '',
	metaDescription: '',
	metaImage: {
		src: null,
		public_id: '',
	},
}

export const statusOption = [
	{
		name: 'Draft',
	},
	{
		name: 'Published',
	},
]
