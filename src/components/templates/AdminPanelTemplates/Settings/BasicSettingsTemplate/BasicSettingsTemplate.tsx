
import BasicSettings from '../../../../organism/BasicSettings/BasicSettings'
import DifferentSettings from '../../../../organism/DifferentSettings/DifferentSettings'
import styles from './BasicSettingsTemplate.module.scss'

const GeneralSettingsTemplate = () => {
	return (
		<div className={styles.basicSettingsTemplateContainer}>
			<BasicSettings />
			<DifferentSettings />
		</div>
	)
}

export default GeneralSettingsTemplate
