import React, { useState } from 'react';
import styles from './Cell.module.css';
import bomb from '../../../../../assets/img/bomb.svg';
import flag from '../../../../../assets/img/flag.svg';

const Cell = (props) => {
  const [isBomb, setIsBomb] = useState(false);

  const clickHandler = () => {
    if (!props.isOpened && !props.isFlagged) {
      if (props.value === null) {
        props.openBlank(props.position);
        return;
      }

      if (props.value === '💣') {
        setIsBomb(true);
        props.loseGame();
        return;
      }

      props.openCell(props.position);
    }
  };

  const contextMenuHandler = (e) => {
    e.preventDefault();
    if (!props.isOpened) {
      if (props.isFlagged) {
        props.removeFlag(props.position);
        return;
      }

      props.setFlag(props.position);
    }
  };

  return (
    <div
      className={
        props.isOpened ? `${styles.cell} ${styles.opened}` : styles.cell
      }
      onClick={clickHandler}
      onContextMenu={contextMenuHandler}
    >
      <div className={styles.front}>
        {props.isFlagged ? (
          <img className={styles.flag} src={flag} alt="flag" />
        ) : (
          ''
        )}
      </div>
      <div
        className={styles.back}
        style={isBomb ? { backgroundColor: 'red' } : {}}
      >
        {props.value === '💣' ? (
          <img className={styles.bomb} src={bomb} alt="bomb" />
        ) : (
          props.value
        )}
      </div>
    </div>
  );
};

export default Cell;
