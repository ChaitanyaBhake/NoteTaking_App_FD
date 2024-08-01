// Sidebar.js
import  { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import GroupList from './GroupList';
import Shimmer from '../../components/common/ShimmerUI/GroupListShimmer/GroupListShimmer';
import styles from './Sidebar.module.css';

const Sidebar = (props) => {
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
  
    if(props.everyGroup){
      setIsLoading(false)
    }
  }, [props.everyGroup]);

  return (
    <section className={styles.leftSection}>
      {/* Top Heading */}
      <div className={styles.leftTopSection}>
        <h2 className={styles.heading}>Pocket Notes</h2>
      </div>
      
      <div className={styles.leftBottomSection}>
        {isLoading ? (
          <Shimmer /> 
        ) : (
          props.everyGroup &&
          props.everyGroup.map((group) => (
            <GroupList
              key={group._id}
              id={group._id}
              name={group.name}
              groupIconColor={group.color}
              isGroupSelected={props.isGroupSelected}
              setIsGroupSelected={props.setIsGroupSelected}
            />
          ))
        )}
        {/* Create New Group Button */}
        <button
          onClick={() => {
            props.openGroupPopUp(true);
          }}
          className={`${styles.btnStyle} ${styles.addGroupBtn}`}
        >
          <span className={styles.plus}>+</span>
        </button>
      </div>
    </section>
  );
};

export default Sidebar;

Sidebar.propTypes = {
  openGroupPopUp: PropTypes.func.isRequired,
  isGroupSelected: PropTypes.string,
  setIsGroupSelected: PropTypes.func,
  everyGroup: PropTypes.array,
};
