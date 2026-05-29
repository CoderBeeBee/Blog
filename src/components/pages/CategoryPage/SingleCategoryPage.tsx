import { useParams } from 'react-router'
import Seo from '../../../utils/seo'
import SingleCategoryPageTemplate from '../../templates/SingleCategoryPageTemplate/SingleCategoryPageTemplate'
import { useFetchSingleCategoryQuery } from '../../../slices/api/categoriesApi'

const SingleCategoryPage = () => {
	const { categorySlug, childSlug } = useParams()

	const slug = childSlug ? childSlug : categorySlug

	const { data: category } = useFetchSingleCategoryQuery(slug!, { skip: !slug })
	const canonicalUrl = childSlug 
	? `${import.meta.env.VITE_SITE_URL}/categories/${categorySlug}/${childSlug}`
	: `${import.meta.env.VITE_SITE_URL}/categories/${categorySlug}`
	
	if (!category) return
	return (
		<>
			<Seo
				title={category.metaTitle}
				description={category.metaDescription}
				canonicalUrl={canonicalUrl}
				type="website"
				
				favIcon={category.metaImage.src}
			/>
			<SingleCategoryPageTemplate name={category.name} image={category.image.src} description={category.description}/>
		</>
	)
}

export default SingleCategoryPage
