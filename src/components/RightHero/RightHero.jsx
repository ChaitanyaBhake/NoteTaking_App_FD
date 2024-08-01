import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import NoteShimmer from '../../components/common/ShimmerUI/GroupNotesShimmer/GroupNotesShimmer'; 
import styles from './RightHero.module.css';
import SingleNote from './SingleNote';
import sendArrowBlue from '/blue-arrow.jpg';
import sendArrowGrey from '/grey-arrow.jpg';
import heroImg from '/image-removebg-preview.svg';
import lockIcon from '/lock.svg';

const RightHero = (props) => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const [arrowColor, setArrowColor] = useState();
  const [notes, setNote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);

  let selectedGroupName = props.everyGroup?.find(
    (selGrp) => selGrp._id === props.isGroupSelected
  );

  let noteInputRef = useRef(null);

  
  const handleInputChange = () => {
    setArrowColor(noteInputRef.current.value);
  };

  const fetchNotes = async () => {
    if (!selectedGroupName) return;

    setLoading(true);

    try {
      const response = await fetch(
        `${baseUrl}/note/${selectedGroupName._id}/getNotes`
      );

      if (!response.ok) {
        throw new Error('Failed to Fetch Notes');
      }

      const data = await response.json();
      setNote(data.groupNotes || []);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isGroupSelected, setNote]);

  //Submit Function
  const submitNote = async () => {
    if (noteInputRef.current.value.trim() === '') {
      alert('Cannot save empty message');
      return;
    }

    try {
      const response = isEditing
        ? await fetch(
            `${baseUrl}/note/${selectedGroupName._id}/${editNoteId}/editNote`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                text: noteInputRef.current.value,
              }),
            }
          )
        : await fetch(`${baseUrl}/note/${selectedGroupName._id}/createNote`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: noteInputRef.current.value,
            }),
          });

      if (!response.ok) {
        throw new Error(
          isEditing ? 'Failed to Edit Note' : 'Failed to Create Note'
        );
      }

      const data = await response.json();
      setNote(data.group.notes || []); // Ensure we set an empty array if no notes

      if (noteInputRef.current) {
        noteInputRef.current.value = '';
      }

      setArrowColor('');
      setIsEditing(false);
      setEditNoteId(null);
    } catch (error) {
      console.log(error.message);
    }
  };

  //Edit Function
  const startEditing = (noteId, noteText) => {
    setIsEditing(true);
    setEditNoteId(noteId);
    noteInputRef.current.value = noteText;
    setArrowColor(noteText);
  };

  return (
    <section className={styles.rightSection}>
      {!props.isGroupSelected ? (

        //1.Show default image when no group is selected.
        <div className={styles.defaultSection}>
          <div className={styles.defaultMessageWrapper}>
            <img className={styles.heroImg} src={heroImg} alt="Hero" />
            <h1 className={styles.rightHeading}>Pocket Notes</h1>
            <p>
              Send and receive messages without keeping your phone online.
              <br />
              Use Pocket Notes on up to 4 linked devices and 1 mobile phone
            </p>
          </div>
          <div className={styles.encryptMsg}>
            <p>
              <img className={styles.lockIcon} src={lockIcon} alt="Lock Icon" />
              end-to-end encrypted
            </p>
          </div>
        </div>
      ) : (
        //2. Show Group Details if group is selected
        <div className={styles.displayNotesContainer}>
          <div className={styles.notesHeading}>
           
            <div
              className={styles.navGroupIcon}
              style={{ background: selectedGroupName.color }}
            >
              {selectedGroupName.name &&
                selectedGroupName.name.slice(0, 2).toUpperCase()}
            </div>

            {/* Show Selected Group Name */}
            <div className={styles.groupNameRightSide}>
              {selectedGroupName.name}
            </div>
          </div>

          {/* Loading screen , till fetching api */}
          <div className={styles.showAllNotes}>
            {loading ? (
              <NoteShimmer />
            ) : notes.length === 0 ? (
              <p style={{ textAlign: 'center', fontSize: '1.5rem' }}>
                No notes available.
              </p>
            ) : (
              notes.map((note) => (
                <SingleNote
                  key={note._id}
                  date={note.createdAt}
                  note={note.text}
                  groupId={selectedGroupName._id}
                  noteId={note._id}
                  fetchNotes={fetchNotes}
                  startEditing={startEditing}
                />
              ))
            )}
          </div>

          {/* Text Area and Submit */}
          <div className={styles.userInputContainer}>
            <textarea
              ref={noteInputRef}
              className={`${styles.textInput} ${styles.textInputPlaceholder}`}
              placeholder="Enter your text here.... "
              onInput={handleInputChange}
            ></textarea>
            <img
              onClick={submitNote}
              src={arrowColor ? sendArrowBlue : sendArrowGrey}
              className={styles.sendArrow}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default RightHero;

RightHero.propTypes = {
  isGroupSelected: PropTypes.string,
  everyGroup: PropTypes.array,
};
