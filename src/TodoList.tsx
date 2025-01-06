import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from './types/Todo';

interface Props {
  todos: Todo[];
  onDeleteTodo: (id: number) => Promise<void>;
  loadingTodo: number | null;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  loadingTodo,
}) => {
  const handleDelete = async (id: number) => {
    await onDeleteTodo(id);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={handleDelete}
          loadingIds={loadingTodo === todo.id ? [todo.id] : []}
        />
      ))}
    </section>
  );
};
