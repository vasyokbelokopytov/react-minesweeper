import React, { useState } from 'react';
import styles from './Field.module.css';

import Row from './Row/Row';

const Field = (props) => {
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
      }))
    );

    field = initBombs(field);
    field = initNumbers(field);
    return field;
  };

  const [field, setField] = useState(initField());

  const checkWin = ([i, j]) => {
    debugger;
    return !field.some((row, rowIndex) =>
      row.some((cell, cellIndex) => {
        if (rowIndex === i && cellIndex === j) {
          return false;
        }

        return cell.value !== '💣' && !cell.isOpened;
      })
    );
  };

  const openCell = ([i, j]) => {
    if (checkWin([i, j])) {
      winGame();
    }

    setField(
      field.map((row, rowIndex) =>
        row.map((cell, cellIndex) => {
          return rowIndex === i && cellIndex === j
            ? { ...cell, isOpened: true }
            : cell;
        })
      )
    );
  };

  const openBlank = ([i, j]) => {
    const fieldCopy = field.map((row) => row.map((cell) => cell));
    fieldCopy[i][j].isOpened = true;
    let flagsToRemove = 0;

    openNeighbours([i, j]);
    props.setFlagsCount(props.flags + flagsToRemove);
    setField(fieldCopy);

    function openNeighbours([i, j]) {
      const directions = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];

      for (let [x, y] of directions) {
        if (
          i + y < 0 ||
          i + y >= fieldCopy.length ||
          j + x < 0 ||
          j + x >= fieldCopy[i].length ||
          fieldCopy[i + y][j + x].isOpened
        ) {
          continue;
        }

        switch (fieldCopy[i + y][j + x].value) {
          case null:
            if (fieldCopy[i + y][j + x].isFlagged) {
              flagsToRemove += 1;
              fieldCopy[i + y][j + x].isFlagged = false;
            }

            fieldCopy[i + y][j + x].isOpened = true;
            openNeighbours([i + y, j + x]);
            break;

          case '💣':
            continue;

          default:
            if (fieldCopy[i + y][j + x].isFlagged) {
              flagsToRemove += 1;
              fieldCopy[i + y][j + x].isFlagged = false;
            }

            fieldCopy[i + y][j + x].isOpened = true;
            break;
        }
      }
    }
  };

  const openAll = () => {
    setField(
      field.map((row) => row.map((cell) => ({ ...cell, isOpened: true })))
    );
  };

  const loseGame = () => {
    openAll();
    const timeout = setTimeout(() => {
      props.setIsLosing(true);
      clearTimeout(timeout);
    }, 1000);
  };

  const winGame = () => {
    const timeout = setTimeout(() => {
      props.setIsWinning(true);
      clearTimeout(timeout);
    }, 500);
  };

  const setFlag = ([i, j]) => {
    setField(
      field.map((row, rowIndex) => {
        return row.map((cell, cellIndex) => {
          return i === rowIndex && j === cellIndex
            ? { ...cell, isFlagged: true }
            : cell;
        });
      })
    );

    props.setFlagsCount(props.flags - 1);
  };

  const removeFlag = ([i, j]) => {
    setField(
      field.map((row, rowIndex) =>
        row.map((cell, cellIndex) =>
          i === rowIndex && j === cellIndex
            ? { ...cell, isFlagged: false }
            : cell
        )
      )
    );
    props.setFlagsCount(props.flags + 1);
  };

  return (
    <div className={styles.field}>
      {field.map((row, index) => {
        return (
          <Row
            key={index}
            index={index}
            cells={row}
            openCell={openCell}
            openBlank={openBlank}
            loseGame={loseGame}
            setFlag={setFlag}
            removeFlag={removeFlag}
          />
        );
      })}
    </div>
  );
};

export default Field;
