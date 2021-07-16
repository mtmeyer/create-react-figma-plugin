import React from 'react';

import styles from './Button.module.scss';

interface ComponentProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: JSX.Element | string;
}
const Button = ({ onClick, children }: ComponentProps) => {
  return (
    <button onClick={onClick} className={styles.button}>
      {children}
    </button>
  );
};

export default Button;
