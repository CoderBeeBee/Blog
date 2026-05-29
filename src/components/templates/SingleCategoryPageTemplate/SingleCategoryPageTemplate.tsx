import { useEffect, useState } from 'react'
import HeaderText from '../../atoms/HeaderText/HeaderText'
import PostsContent from '../../organism/PostsContent/PostsContent'

import { useFetchPostsByCategoryQuery } from '../../../slices/api/postApi'
import { useParams } from 'react-router'
import Loader from '../../atoms/loader/Loader'

interface CategoryProps {
	name: string
	image: string
	description: string
}

const SingleCategoryPageTemplate = ({ name, image, description }: CategoryProps) => {
	const [currentPage, setCurrentPage] = useState<number>(1)
	const { categorySlug, childSlug } = useParams()

	const category = childSlug ? childSlug : categorySlug
	const { currentData } = useFetchPostsByCategoryQuery({ page: currentPage, category })

	useEffect(() => {
		setCurrentPage(1)
	}, [categorySlug])

	if (!currentData) return <Loader />
	return (
		<section >
			<HeaderText name={name} image={image} description={description} />
			<PostsContent data={currentData} currentPage={currentPage} setCurrentPage={setCurrentPage} />
		</section>
	)
}

export default SingleCategoryPageTemplate
