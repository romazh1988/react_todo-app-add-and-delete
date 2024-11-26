import React, { useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';

interface Props {
  onAddTodo: (newTodo: Todo) => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

export const TodoForm: React.FC<Props> = ({ onAddTodo, setErrorMessage }) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim() === '') {
      setErrorMessage('Title should be not empty');

      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      userId: 0,
      title: title.trim(),
      completed: false,
    };

    onAddTodo(newTodo);
    setTitle('');
    setErrorMessage(null);
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
      />
    </form>
  );
};
