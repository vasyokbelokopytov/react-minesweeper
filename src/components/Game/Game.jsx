import React, { useState } from 'react';
import styles from './Game.module.css';

import Field from './Field/Field';

const Game = (props) => {
  const [flagsCount, setFlagsCount] = useState(props.bombs);
  const [isLosing, setIsLosing] = useState(false);
  const [isWinning, setIsWinning] = useState(false);
  const [time, setTime] = useState(0);
  const [timerId, setTimerId] = useState(null);

  const getRandomPosition = (field) => {
    const rowIndex = Math.floor(Math.random() * field.length);
    const row = field[rowIndex];

    const cellIndex = Math.floor(Math.random() * row.length);

    return [rowIndex, cellIndex];
  };

  const initBombs = (field) => {
    for (let i = 0; i < props.bombs; i++) {
      let [rowIndex, cellIndex] = getRandomPosition(field);

      while (field[rowIndex][cellIndex].value === '💣') {
        [rowIndex, cellIndex] = getRandomPosition(field);
      }

      field[rowIndex][cellIndex].value = '💣';
    }

    return field;
  };

  const countBombsAround = (field, i, j) => {
    let bombsAround = 0;
    if (i - 1 >= 0) {
      if (j - 1 >= 0 && field[i - 1][j - 1].value === '💣') {
        bombsAround += 1;
      }

      if (field[i - 1][j].value === '💣') {
        bombsAround += 1;
      }

      if (j + 1 < field[i].length && field[i - 1][j + 1].value === '💣') {
        bombsAround += 1;
      }
    }

    if (i + 1 < field.length) {
      if (j - 1 >= 0 && field[i + 1][j - 1].value === '💣') {
        bombsAround += 1;
      }

      if (field[i + 1][j].value === '💣') {
        bombsAround += 1;
      }

      if (j + 1 < field[i].length && field[i + 1][j + 1].value === '💣') {
        bombsAround += 1;
      }
    }

    if (j - 1 >= 0 && field[i][j - 1].value === '💣') {
      bombsAround += 1;
    }

    if (j + 1 < field[i].length && field[i][j + 1].value === '💣') {
      bombsAround += 1;
    }

    return bombsAround === 0 ? null : bombsAround;
  };

  const initNumbers = (field) => {
    for (let i = 0; i < field.length; i++) {
      for (let j = 0; j < field[i].length; j++) {
        if (field[i][j].value !== '💣') {
          const bombsAround = countBombsAround(field, i, j);
          field[i][j].value = bombsAround === 0 ? null : bombsAround;
        }
      }
    }

    return field;
  };

  const initField = () => {
    let field = Array.from(Array(props.rows), () =>
      Array.from(Array(props.columns), () => ({
        value: null,
        isOpened: false,
        isFlagged: false,
        isSelected: false,
      }))
    );

    field = initBombs(field);
    field = initNumbers(field);
    return field;
  };

  const [field, setField] = useState(initField());

  const retry = () => {
    setFlagsCount(props.bombs);
    setIsLosing(false);
    setIsWinning(false);
    setTime(0);
    setTimerId(null);
    setField(initField());
  };

  const startTimer = () => {
    setTimerId(
      setInterval(() => {
        setTime((time) => time + 1);
      }, 1000)
    );
  };

  const formatTime = (time) => {
    if (time < 10) {
      return `00${time}`;
    }

    if (time < 100) {
      return `0${time}`;
    }

    if (time > 999) {
      return 999;
    }

    return time;
  };

  return (
    <div className={styles.game}>
      <header className={styles.header}>
        <div className={styles.flagsCounter}>Flags remaining: {flagsCount}</div>
        <div className={styles.counter}>{formatTime(time)}</div>
      </header>

      <Field
        field={field}
        setField={setField}
        flags={flagsCount}
        setFlagsCount={setFlagsCount}
        setIsWinning={setIsWinning}
        setIsLosing={setIsLosing}
        timerId={timerId}
        startTimer={startTimer}
      />

      {isLosing || isWinning ? (
        <div className={styles.modalBox}>
          <div className={styles.messageBox}>
            <h1 className={styles.message}>
              {isWinning ? 'You Win' : 'You Lose'}
            </h1>
            <button className={styles.button} onClick={retry}>
              Play again
            </button>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Game;
