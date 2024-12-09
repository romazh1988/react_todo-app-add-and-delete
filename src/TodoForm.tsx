import React, { useEffect, useRef, useState } from 'react';

interface Props {
  onAddTodo: (title: string) => Promise<void>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

export const TodoForm: React.FC<Props> = ({ onAddTodo, setErrorMessage }) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim() === '') {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsSubmitting(true);
    try {
      await onAddTodo(title.trim());
      setTitle('');
    } catch (error) {
      setErrorMessage('Unable to add a todoo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={isSubmitting}
      />
    </form>
  );
};
