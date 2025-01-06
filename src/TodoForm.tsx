import React, { useEffect, useRef, useState } from 'react';

interface Props {
  onAddTodo: (title: string) => Promise<void>;
  setErrorMessage: (message: string | null) => void;
}

export const TodoForm: React.FC<Props> = ({ onAddTodo, setErrorMessage }) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const intputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    intputRef.current?.focus();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim() === '') {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await onAddTodo(title.trim());
    } catch (error) {
      setErrorMessage('Error adding todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isSubmitting) {
      setTitle('');
    }
  }, [isSubmitting]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={intputRef}
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
