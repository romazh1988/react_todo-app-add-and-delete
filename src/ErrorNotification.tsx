import React, { useEffect } from 'react';
import classNames from 'classnames';

import './styles/index.scss';

interface Props {
  errorMessage: string | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [errorMessage, setErrorMessage]);

  const handleHideError = () => {
    setErrorMessage(null);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleHideError}
      />
      {errorMessage}
    </div>
  );
};
