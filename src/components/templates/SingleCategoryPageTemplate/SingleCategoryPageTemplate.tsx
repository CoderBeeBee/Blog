import { useEffect, useState } from 'react'
import HeaderText from '../../atoms/HeaderText/HeaderText'
import PostsContent from '../../organism/PostsContent/PostsContent'

import { useFetchPostsByCategoryQuery } from '../../../slices/api/postApi'
import { useParams } from 'react-router'
import Loader from '../../atoms/loader/Loader'

const SingleCategoryPageTemplate = ({ name }: { name: string }) => {
	const [currentPage, setCurrentPage] = useState<number>(1)
	const { categorySlug } = useParams()
	

	const { currentData } = useFetchPostsByCategoryQuery({ page: currentPage, category: categorySlug })
	
	useEffect(() => {
		setCurrentPage(1)
	}, [categorySlug])

	if (!currentData) return <Loader />
	return (
		<section className={` sectionPages`}>
			<HeaderText>
				<h1>{name}</h1>
			</HeaderText>
			<PostsContent data={currentData} currentPage={currentPage} setCurrentPage={setCurrentPage} />
		</section>
	)
}

export default SingleCategoryPageTemplate
