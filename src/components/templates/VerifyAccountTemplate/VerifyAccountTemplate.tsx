import styles from './VerifyAccountTemplate.module.scss'
import VerifyAccount from '../../organism/VerifyAccount/VerifyAccount'
const VerifyAccountTemplate = () => {
	return (
        <div className={styles.verifyAccountContainer}>
            <VerifyAccount/>
        </div>
    )
}

export default VerifyAccountTemplate
