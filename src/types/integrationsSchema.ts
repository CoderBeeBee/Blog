import z from 'zod'

export const socialLinksSchema = z.object({
    facebook: z.string().trim().min(1, { message: 'Field is required' }),
    twitter: z.string().trim().min(1, { message: 'Field is required' }),
    instagram: z.string().trim().min(1, { message: 'Field is required' }),
    youTube: z.string().trim().min(1, { message: 'Field is required' }),
})
export type socialTypes = z.infer<typeof socialLinksSchema>

export const socialLinksDefaults: socialTypes = {
    facebook:'',
    twitter:'',
    instagram:'',
    youTube:''

}