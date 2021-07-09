import React, { useState } from 'react';
import styles from './Game.module.css';

import Field from './Field/Field';

const Game = (props) => {
  const [flagsCount, setFlagsCount] = useState(10);
  const [isLosing, setIsLosing] = useState(false);
  const [isWinning, setIsWinning] = useState(false);

  const retry = () => {
    setFlagsCount(10);
    setIsLosing(false);
    setIsWinning(false);
  };

  return (
    <div className={styles.game}>
      <header className={styles.header}>
        <div className={styles.flagsCounter}>Flags remaining: {flagsCount}</div>
        <div className={styles.counter}>000</div>
      </header>

      <Field
        rows={8}
        columns={10}
        bombs={10}
        flags={flagsCount}
        setFlagsCount={setFlagsCount}
        setIsWinning={setIsWinning}
        setIsLosing={setIsLosing}
      />

      {isLosing || isWinning ? (
        <div className={styles.messageBox}>
          <h1 className={styles.message}>
            {isWinning ? 'You Win' : 'You Lose'}
          </h1>
          <button className={styles.button} onClick={retry}>
            Play again
          </button>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Game;
