import React from 'react';

import styles from './Button.module.scss';

const Button = ({ onClick, children, secondary = false }) => {
  const buttonType = secondary ? styles.secondary : styles.primary;

  return (
    <button onClick={onClick} className={`${styles.base} ${buttonType}`}>
      {children}
    </button>
  );
};

export default Button;
