import React from 'react';
import styles from './Field.module.css';

import Row from './Row/Row';

class Field extends React.Component {
  state = {
    field: Array.from(Array(this.props.rows), () =>
      Array.from(Array(this.props.columns), () => ({
        value: null,
        isOpened: false,
      }))
    ),
  };

  componentDidMount() {
    this.setState(
      ({ field }) => {
        return this.initBombs(field);
      },
      () => {
        this.setState(({ field }) => {
          return this.initNumbers(field);
        });
      }
    );
  }

  getRandomPosition(field) {
    const rowIndex = Math.floor(Math.random() * field.length);
    const row = field[rowIndex];

    const cellIndex = Math.floor(Math.random() * row.length);

    return [rowIndex, cellIndex];
  }

  initBombs(field) {
    debugger;
    for (let i = 0; i < this.props.bombs; i++) {
      let [rowIndex, cellIndex] = this.getRandomPosition(field);

      while (field[rowIndex][cellIndex].value === '💣') {
        [rowIndex, cellIndex] = this.getRandomPosition(field);
      }

      field[rowIndex][cellIndex].value = '💣';
    }

    console.log(field);
    return field;
  }

  countBombsAround(field, i, j) {
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
  }

  initNumbers(field) {
    for (let i = 0; i < field.length; i++) {
      for (let j = 0; j < field[i].length; j++) {
        if (field[i][j] !== '💣') {
          const bombsAround = this.countBombsAround(field, i, j);
          field[i][j].value = bombsAround === 0 ? null : bombsAround;
        }
      }
    }

    return field;
  }

  render() {
    return (
      <div className={styles.game}>
        {this.state.field.map((row, index) => {
          return <Row key={index} cells={row} />;
        })}
      </div>
    );
  }
}

export default Field;
