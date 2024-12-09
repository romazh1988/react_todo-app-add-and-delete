import React, { useState } from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from './types/Todo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo: (id: number) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo,
}) => {
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const handleDelete = async (id: number) => {
    setLoadingIds(prevIds => [...prevIds, id]);
    await onDeleteTodo(id);
    setLoadingIds(prevIds => prevIds.filter(loadingId => loadingId !== id));
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onDelete={() => []}
          loadingIds={[]}
          isTemporary
        />
      )}
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={handleDelete}
          loadingIds={loadingIds}
        />
      ))}
    </section>
  );
};
