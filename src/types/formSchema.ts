import z from 'zod'
import validateImageRHF from '../hooks/validateImageRHF'

const imageSrcSchema = z.instanceof(File).or(z.string()).nullable()

export const postSchema = z.object({
	title: z
		.string()
		.trim()
		.min(4, { message: 'The Title is too short. At least 4 characters' })
		.max(160, { message: 'The Title is too long. Up to 160 characters' }),
	introduction: z.string().trim().min(100, { message: 'Please fill introduction' }),

	mainImage: z.object({
		src: imageSrcSchema.superRefine(
			validateImageRHF({
				maxSizeMB: 5,
				minWidth: 1600,
				minHeight: 900,
				maxWidth: 2800,
				maxHeight: 1575,
			}),
		),
		alt: z
			.string()
			.trim()
			.min(10, { message: 'The alt is too short. At least 10 characters' })
			.max(100, { message: 'The alt is too long. Up to 100 characters' }),
		description: z
			.string()
			.trim()
			.min(10, { message: 'The description is too short. At least 10 characters' })
			.max(100, { message: 'The description is too long. Up to 100 characters' }),
		public_id: z.string(),
	}),

	articleContent: z.array(
		z.discriminatedUnion('type', [
			z.object({
				type: z.literal('text'),
				value: z.string().min(1, 'Please fill field'),
			}),

			z.object({
				type: z.literal('image'),
				value: z.object({
					src: imageSrcSchema.superRefine(
						validateImageRHF({
							maxSizeMB: 5,
							minWidth: 1600,
							minHeight: 900,
							maxWidth: 2800,
							maxHeight: 1575,
						}),
					),
					alt: z
						.string()
						.trim()
						.min(10, { message: 'The alt is too short. At least 10 characters' })
						.max(100, { message: 'The alt is too long. Up to 100 characters' }),
					description: z
						.string()
						.trim()
						.min(10, { message: 'The description is too short. At least 10 characters' })
						.max(100, { message: 'The description is too long. Up to 100 characters' }),

					public_id: z.string(),
				}),
			}),
		]),
	),

	categories: z
		.array(z.string())
		.min(1, { message: 'You must select min 1 category' })
		.max(2, { message: 'Too many categories. Max 2 categories' }),
	tags: z.array(z.string()).min(1, { message: 'You must select min 1 tag' }),

	seo: z.object({
		slug: z
			.string()
			.min(4, { message: 'The permalink is too short. Min 4 characters' })
			.max(100, { message: 'The permalink is too long. Max 150 characters' }),
		metaTitle: z
			.string()
			.min(50, { message: 'The seo title is too short. Min 50 characters' })
			.max(60, { message: 'The seo title is too long. Max 60 characters' }),
		metaDescription: z
			.string()
			.min(120, { message: 'The seo description is too short. Min 120 characters' })
			.max(160, { message: 'The seo description is too long. Max 160 characters' }),
	}),
	status: z.string(),

	scheduledAt: z
		.date()
		.nullable()
		.refine(d => d === null || d >= new Date(), 'The date must be in the future.'),
})

export type postSchemaTypes = z.infer<typeof postSchema>

export const defaultValues: postSchemaTypes = {
	title: '',
	introduction: '',
	mainImage: {
		src: null,
		alt: '',
		description: '',
		public_id: '',
	},
	articleContent: [],

	categories: [],
	tags: [],
	seo: {
		slug: '',
		metaTitle: '',
		metaDescription: '',
	},
	status: 'Draft',
	scheduledAt: null,
}
