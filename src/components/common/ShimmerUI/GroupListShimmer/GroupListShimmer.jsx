// GroupListShimmer.js

import styles from './GroupListShimmer.module.css'; 

const GroupListShimmer = () => {
  return (
    <div className={styles.shimmerWrapper}>
      <div className={styles.shimmerItem}></div>
      <div className={styles.shimmerItem}></div>
      <div className={styles.shimmerItem}></div>
      <div className={styles.shimmerItem}></div>
    </div>
  );
};

export default GroupListShimmer;
