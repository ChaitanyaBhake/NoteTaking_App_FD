import styles from "./GroupNotesShimmer.module.css"

const GroupNotesShimmer = () => {
  return (
    <div className={styles.shimmerWrapper}>
    <div className={styles.shimmerItem}></div>
    <div className={styles.shimmerItem}></div>
    <div className={styles.shimmerItem}></div>
  </div>
  )
}

export default GroupNotesShimmer