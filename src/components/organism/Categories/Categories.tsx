import Breadcrumbs from '../../atoms/Breadcrumbs/Breadcrumbs'
import AddCategoryForm from '../../modules/AddCategoryForm/AddCategoryForm'
import CategoriesList from '../../modules/CategoriesList/CategoriesList'
import styles from './Categories.module.scss'
const Categories = () => {
	return (
		<div className={styles.categoriesWrapper}>
			<Breadcrumbs />
			<div className={styles.categoriesBox}>
				<AddCategoryForm />
				<CategoriesList />
			</div>
		</div>
	)
}

export default Categories
