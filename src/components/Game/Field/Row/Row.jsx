import React from 'react';
import Cell from './Cell/Cell';

const Row = (props) => {
  return (
    <>
      {props.cells.map((cell, index) => {
        return (
          <Cell
            key={index}
            position={[props.index, index]}
            value={cell.value}
            isOpened={cell.isOpened}
            isFlagged={cell.isFlagged}
            isSelected={cell.isSelected}
            openCell={props.openCell}
            openBlank={props.openBlank}
            loseGame={props.loseGame}
            setFlag={props.setFlag}
            removeFlag={props.removeFlag}
            timerId={props.timerId}
            startTimer={props.startTimer}
          />
        );
      })}
    </>
  );
};

export default Row;
