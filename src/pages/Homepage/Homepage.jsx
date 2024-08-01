/* eslint-disable no-unused-vars */
import styles from './Homepage.module.css';
import { useEffect, useRef, useState } from 'react';
import RightHero from '../../components/RightHero/RightHero';
import SideBar from '../../components/Sidebar/Sidebar';
import { defaultColorOptions } from '../../constants/data';
import closeIcon from '/icons8-close.svg';

const Homepage = () => {
  const [createGroupPopUp, setCreateGroupPopup] = useState(false);
  const [pickColor, setPickColors] = useState(defaultColorOptions);
  const [error, setError] = useState(false);
  const [error2, setError2] = useState(false);
  const [isGroupSelected, setIsGroupSelected] = useState(null);
  const nameReference = useRef('');
  const [everyGroup, setEveryGroup] = useState(null);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch groups from Backend
  const fetchGroups = async () => {
    try {
      const response = await fetch(`${baseUrl}/group/getGroups`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed To fetch Groups');
      }

      const data = await response.json();

      console.log(data);

      if (data && data.groups) {
        setEveryGroup(data.groups);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  //Function to create group
  const addGroupList = async () => {
    const colorPicked = Object.keys(pickColor).find(
      (key) => pickColor[key] === true
    );

    if (nameReference.current.value.trim() === '') {
      setError(true);
      return;
    }

    if (colorPicked === undefined) {
      setError2(true);
      return;
    }

    const newGroup = {
      name: nameReference.current.value,
      color: colorPicked,
    };

    // API call to createGroup
    try {
      const response = await fetch(`${baseUrl}/group/createGroup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGroup),
      });

      if (!response.ok) {
        throw new Error('Failed To Create Group');
      }

      const data = await response.json();

      setEveryGroup([...everyGroup, data.newGroup]);

      setPickColors(defaultColorOptions);
      setCreateGroupPopup(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className={styles.sideBarDiv}>
        <SideBar
          openGroupPopUp={setCreateGroupPopup}
          everyGroup={everyGroup}
          isGroupSelected={isGroupSelected}
          setIsGroupSelected={setIsGroupSelected}
        />
      </div>

      <div className={styles.rightHeroDiv}>
        <RightHero
          isGroupSelected={isGroupSelected}
          setIsGroupSelected={setIsGroupSelected}
          everyGroup={everyGroup}
        />
      </div>

      {/* Show popup once user click + button */}
      {createGroupPopUp && (
        <div className={styles.newGroupBox}>
          <div className={styles.grpForm}>
            {/* Heading and Close Button */}
            <span className={styles.show}>
              <h2 className={styles.createGrpHeading}>Create New Group</h2>
              <button
                className={styles.backBtn}
                onClick={() => {
                  setCreateGroupPopup(false);
                  setError(false);
                  setError2(false);
                }}
              >
                <img
                  className={styles.backButton}
                  src={closeIcon}
                  alt="Close"
                />
              </button>
            </span>

            {/* Group Name and Group Name Input */}
            <div className={styles.inputContainer}>
              <span className={styles.grpInputStyle}>
                <label className={styles.grpName}>Group Name</label>
                <input
                  ref={nameReference}
                  className={styles.grpInput}
                  type="text"
                  placeholder="Enter Group Name"
                />
              </span>
              {error && (
                <p style={{ color: 'red', marginLeft: '7rem' }}>
                  Group Name Required!
                </p>
              )}

              {/* Choose Color */}
              <span className={styles.grpInputStyle}>
                <label className={styles.chooseColor}>Choose Colour</label>

                <div className={styles.colorsContainer}>
                  {Object.entries(pickColor).map(
                    ([colorHexCode, isSelected]) => (
                      <span
                        key={colorHexCode}
                        onClick={() => {
                          const updatedColors = Object.fromEntries(
                            Object.entries(pickColor).map(
                              ([color, selected]) => [
                                color,
                                color === colorHexCode,
                              ]
                            )
                          );

                          //Example Output
                          //   {
                          //     "#B38BFA": false,
                          //     "#FF79F2": false,
                          //     "#43E6FC": false,
                          //     "#F19576": false,
                          //     "#0047FF": true,
                          //     "#6691FF": false
                          // }
                          setPickColors(updatedColors);
                        }}
                        style={
                          !isSelected
                            ? { background: colorHexCode }
                            : {
                                border: 'solid 3px grey',
                                background: colorHexCode,
                              }
                        }
                        className={styles.pickColor}
                      />
                    )
                  )}
                </div>
              </span>
              {error2 && (
                <p
                  style={{
                    color: 'red',
                    marginLeft: '7rem',
                    marginBottom: '4rem',
                  }}
                >
                  Pick a color!
                </p>
              )}
            </div>

            {/* Create Button */}
            <div className={styles.createBtnDiv}>
              <button onClick={addGroupList} className={styles.createBtn}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Homepage;
