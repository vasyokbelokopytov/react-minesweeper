import React from 'react';
import styles from './Field.module.css';

import Row from './Row/Row';

const Field = (props) => {
  const checkWin = ([i, j]) => {
    return !props.field.some((row, rowIndex) =>
      row.some((cell, cellIndex) => {
        if (
          rowIndex === i &&
          cellIndex === j &&
          cell.value !== '💣' &&
          cell.value !== null
        ) {
          return false;
        }

        return cell.value !== '💣' && !cell.isOpened;
      })
    );
  };

  const winGame = () => {
    const timeout = setTimeout(() => {
      clearInterval(props.timerId);
      props.setIsWinning(true);
      clearTimeout(timeout);
    }, 500);
  };

  const openCell = ([i, j]) => {
    if (checkWin([i, j])) {
      winGame();
    }

    props.setField(
      props.field.map((row, rowIndex) =>
        row.map((cell, cellIndex) => {
          return rowIndex === i && cellIndex === j
            ? { ...cell, isOpened: true }
            : cell;
        })
      )
    );
  };

  const openBlank = ([i, j]) => {
    const fieldCopy = props.field.map((row) => row.map((cell) => cell));
    fieldCopy[i][j].isOpened = true;
    let flagsToRemove = 0;

    openNeighbours([i, j]);
    props.setFlagsCount(props.flags + flagsToRemove);
    props.setField(fieldCopy);

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

  const openAll = (field) => {
    return field.map((row) => row.map((cell) => ({ ...cell, isOpened: true })));
  };

  const selectCell = (field, [i, j]) => {
    return field.map((row, rowIndex) =>
      row.map((cell, cellIndex) =>
        i === rowIndex && j === cellIndex ? { ...cell, isSelected: true } : cell
      )
    );
  };

  const loseGame = ([i, j]) => {
    clearInterval(props.timerId);
    let fieldCopy = props.field.map((row) => row.map((cell) => cell));
    fieldCopy = openAll(fieldCopy);
    fieldCopy = selectCell(fieldCopy, [i, j]);
    props.setField(fieldCopy);

    const timeout = setTimeout(() => {
      props.setIsLosing(true);
      clearTimeout(timeout);
    }, 1000);
  };

  const setFlag = ([i, j]) => {
    if (props.flags > 0) {
      props.setField(
        props.field.map((row, rowIndex) => {
          return row.map((cell, cellIndex) => {
            return i === rowIndex && j === cellIndex
              ? { ...cell, isFlagged: true }
              : cell;
          });
        })
      );

      props.setFlagsCount(props.flags - 1);
    }
  };

  const removeFlag = ([i, j]) => {
    props.setField(
      props.field.map((row, rowIndex) =>
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
      {props.field.map((row, index) => {
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
            timerId={props.timerId}
            startTimer={props.startTimer}
          />
        );
      })}
    </div>
  );
};

export default Field;
