import styles from './RightHero.module.css';
import dotImage from '/dot.svg';
import iconClose from '/icons8-close.svg';
import editImage from "/edit.svg"
import PropTypes from "prop-types"

const SingleNote = (props) => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  //Delete Note function
  const deleteNote = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/note/${props.groupId}/${props.noteId}/deleteNote`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete');
      }
      props.fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };
  
  let date = new Date(props.date);

  const formattedDate = `${date.getDate()} ${date.toLocaleString('en-US', {
    month: 'short',
  })} ${date.getFullYear()}`;
  const formattedTime = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={styles.noteDiv}>
      <div className={styles.dateContainer}>
        <p className={styles.dateStyle}>
          {formattedDate}
          <img className={styles.dotImg} src={dotImage} alt="dot" />
          {formattedTime}
        </p>
      </div>
      <div className={styles.note}>
        {props.note}

        {/* Delete and Edit Buttons */}
        <div style={{display:"flex",gap:"2rem",marginLeft:"1rem" , cursor:"pointer"}}>
          <img
            onClick={() => props.startEditing(props.noteId, props.note)}
            style={{ width: 25, height: 25 }}
            src={editImage}
            alt="Edit"
          />

          <img
            onClick={deleteNote}
            style={{ width: 25, height: 25 }}
            src={iconClose}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default SingleNote;

SingleNote.propTypes = {
    startEditing: PropTypes.func,
    noteId : PropTypes.string,
    groupId: PropTypes.string,
    note: PropTypes.string,
    date: PropTypes.string,
    fetchNotes: PropTypes.func,
}
