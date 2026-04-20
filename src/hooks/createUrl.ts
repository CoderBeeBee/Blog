interface createURLProps {
	slug: string | undefined
	_id: string
}
const createUrl = ({ slug, _id }: createURLProps) => {
	// const categorySlugs = categories
	// 	?.map(cat => cat)
	// 	.filter(Boolean) // usuwa undefined/null
	// 	.map(slug => slugify(slug, { lower: true, strict: true }))
	// console.log(seo?.slug)

	// if (categorySlugs && categorySlugs.length > 1) {
	// 	return `/post/${categorySlugs.join('/')}/${seo?.slug.toLowerCase().replace(/\s+/g, '-')}?id=${_id}`
	// } else {
	// 	return `/post/${categorySlugs}/${seo?.slug.toLowerCase().replace(/\s+/g, '-')}?id=${_id}`
	// }
	return `${slug}?id=${_id}`
}

export default createUrl
