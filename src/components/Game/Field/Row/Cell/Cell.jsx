import React from 'react';
import styles from './Cell.module.css';
import bomb from '../../../../../assets/img/bomb.svg';
import flag from '../../../../../assets/img/flag.svg';

const Cell = (props) => {
  const clickHandler = () => {
    if (!props.isOpened && !props.isFlagged) {
      if (props.value === null) {
        if (!props.timerId) {
          props.startTimer();
        }
        props.openBlank(props.position);
        return;
      }

      if (props.value === '💣') {
        props.loseGame(props.position);
        return;
      }

      props.openCell(props.position);
      if (!props.timerId) {
        props.startTimer();
      }
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
        <img
          className={styles.flag}
          style={props.isFlagged ? {} : { display: 'none' }}
          src={flag}
          alt="flag"
        />
      </div>
      <div
        className={styles.back}
        style={props.isSelected ? { backgroundColor: 'red' } : {}}
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
