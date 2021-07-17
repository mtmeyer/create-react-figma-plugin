import React from 'react';
import styles from './ui.module.scss';

import Button from './components/Button';

const UI = ({}) => {
  const textbox = React.useRef(undefined);

  const countRef = React.useCallback((element) => {
    if (element) element.value = '5';
    textbox.current = element;
  }, []);

  const onCreate = () => {
    const count = parseInt(textbox.current.value, 10);
    parent.postMessage({ pluginMessage: { type: 'create-rectangles', count } }, '*');
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  };

  React.useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === 'create-rectangles') {
        console.log(`Figma Says: ${message}`);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <h2>Rectangle Creator</h2>
      <p>
        Count: <input ref={countRef} />
      </p>
      <div className={styles.buttonContainer}>
        <Button onClick={onCreate}>Create</Button>
        <Button onClick={onCancel} secondary>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default UI;
