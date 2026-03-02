import { useParams } from 'react-router'
import Seo from '../../../utils/seo'
import SingleCategoryPageTemplate from '../../templates/SingleCategoryPageTemplate/SingleCategoryPageTemplate'
import { useFetchSingleCategoryQuery } from '../../../slices/api/categoriesApi'

const SingleCategoryPage = () => {
	const { categorySlug } = useParams()

	const { data: category } = useFetchSingleCategoryQuery(categorySlug!)
	
	

	if (!category) return
	return (
		<>
			<Seo
				title={category.name}
				description={`Posty i artykuły z kategorii ${category.name}`}
				canonicalUrl={`${import.meta.env.VITE_SITE_URL}/categories/${categorySlug}`}
				type="website"
			/>
			<SingleCategoryPageTemplate name={category.name} />
		</>
	)
}

export default SingleCategoryPage
