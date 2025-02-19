import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from './types/Todo';

interface Props {
  todos: Todo[];
  onDeleteTodo: (id: number) => Promise<void>;
  onToggleTodo: (id: number) => void;
  loadingTodo: number | null;
  loadingIds: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  onToggleTodo,
  loadingIds,
  // loadingTodo,
}) => {
  const handleDelete = async (id: number) => {
    await onDeleteTodo(id);
  };

  const handleToggle = async (id: number) => {
    onToggleTodo(id);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={handleDelete}
          onToggle={handleToggle}
          loadingIds={loadingIds}
        />
      ))}
    </section>
  );
};
