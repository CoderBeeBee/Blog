interface createURLProps {
	slug: string | undefined
	_id: string
}
const createUrl = ({ slug, _id }: createURLProps) => {
	
	
	return `${slug}?id=${_id}`
}

export default createUrl
