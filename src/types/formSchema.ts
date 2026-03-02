import z from 'zod'
import validateImageRHF from '../hooks/validateImageRHF'

const imageSrcSchema = z.instanceof(File).or(z.string()).nullable()

export const postSchema = z.object({
	title: z.string().trim().min(1, { message: 'Please fill title' }),
	introduction: z.string().trim().min(1, { message: 'Please fill introduction' }),

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
		alt: z.string().trim().min(1, { message: 'Please fill alt' }),
		caption: z.string().trim().min(1, { message: 'Please fill caption' }),
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
					alt: z.string().min(1, 'Please fill alt'),
					caption: z.string().min(1, 'Please fill caption'),
					public_id: z.string(),
				}),
			}),
		]),
	),

	categories: z.array(z.string()).min(1, { message: 'Min 1 Category' }).max(2, { message: 'Max 2 Categories' }),
	tags: z.array(z.string()).min(1, { message: 'Min 1 Tag' }),
	
	seo: z.object({
		slug: z.string().min(1, { message: 'Please fill field' }),
		metaTitle: z.string().min(1, { message: 'Please fill field' }),
		metaDescription: z.string().min(1, { message: 'Please fill field' }),
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
		caption: '',
		public_id: '',
	},
	articleContent: [
		
	],

	categories: [],
	tags:[],
	seo: {
		slug: '',
		metaTitle: '',
		metaDescription: '',
	},
	status: 'Draft',
	scheduledAt: null,
}
