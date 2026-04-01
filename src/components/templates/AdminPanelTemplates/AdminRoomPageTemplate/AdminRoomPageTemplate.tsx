
import AdminList from '../../../organism/AdminList/AdminList'
import styles from './AdminRoomPage.module.scss'

const AdminRoomPageTemplate = () => {
  return (
    <div className={styles.adminConatiner}>
      <AdminList />
    </div>
  )
}

export default AdminRoomPageTemplate