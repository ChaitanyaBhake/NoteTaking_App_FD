import PropTypes from 'prop-types';
import styles from './Sidebar.module.css';

const GroupList = (props) => {
  return (
    <>
      {/* Highlighting div with grey color which is selected */}
      <div
        style={
          props.id == props.isGroupSelected
            ? { background: '#2F2F2F2B', width: '100%' }
            : { background: 'white' }
        }
        className={styles.individualGroup}
        onClick={() => {
          props.setIsGroupSelected(props.id);
        }}
      >
        <div
          className={styles.groupIcon}
          style={{ background: props.groupIconColor }}
        >
          {props.name.slice(0, 2).toUpperCase()}
        </div>

        <div className={styles.groupName}>{props.name}</div>
      </div>
    </>
  );
};

GroupList.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  groupIconColor: PropTypes.string.isRequired,
  isGroupSelected: PropTypes.string,
  setIsGroupSelected: PropTypes.func,
};

export default GroupList;
