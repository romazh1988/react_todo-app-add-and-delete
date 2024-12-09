/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';
import { Todo } from './types/Todo';

interface Props {
  todo: Todo;
  onDelete: (id: number) => void;
  loadingIds: number[];
  isTemporary?: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  loadingIds,
  isTemporary = false,
}) => {
  const isLoading = Array.isArray(loadingIds) && loadingIds.includes(todo.id);

  const shouldShowLoader = isLoading && !todo.completed;

  return (
    <div
      className={`todo ${todo.completed ? 'completed' : ''} `}
      data-cy="Todo"
    >
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={`todo-${todo.id}`}
          checked={todo.completed}
          readOnly
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
        disabled={isLoading}
      >
        x
      </button>

      {shouldShowLoader && (
        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}

      {isTemporary && <div className="overlay" />}
    </div>
  );
};
