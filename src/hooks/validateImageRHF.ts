import type z from 'zod'
import getImageDimensions from './getImageDimensions'

type ImageValidatorOptions = {
	required?: boolean
	maxSizeMB: number
	maxWidth?: number
	minWidth?: number
	minHeight?: number
	maxHeight?: number
}

const validateImageRHF =
	({ required = true, maxSizeMB, minWidth, maxWidth, minHeight, maxHeight }: ImageValidatorOptions) =>
	async (v: File | string | null, ctx: z.RefinementCtx) => {
		
		if (v === null) {
			if (required) {
				ctx.addIssue({
					code: 'custom',
					message: 'File is required',
				})
			}
			return
		}

		// istniejący URL
		if (typeof v === 'string') return

		if (v.size / 1024 / 1024 > maxSizeMB) {
			ctx.addIssue({
				code: 'custom',
				message: `File must be smaller than ${maxSizeMB} MB`,
			})
			return
		}

		if (minWidth || maxWidth) {
			const { width, height } = await getImageDimensions(v)

			if (minWidth && maxWidth && (width < minWidth || width > maxWidth)) {
				ctx.addIssue({
					code: 'custom',
					message: `Width must be between ${minWidth}–${maxWidth}px`,
				})
			}

			if (minHeight && maxHeight && (height < minHeight || height > maxHeight)) {
				ctx.addIssue({
					code: 'custom',
					message: `Height must be between ${minHeight}–${maxHeight}px`,
				})
			}
		}
	}

export default validateImageRHF
