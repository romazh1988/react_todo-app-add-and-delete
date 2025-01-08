/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { deleteTodoApi, getTodos, USER_ID, addTodo } from './api/todos';
import { TodoList } from './TodoList';
import { Footer } from './Footer';
import { Error } from './ErrorNotification';
import { TodoForm } from './TodoForm';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { FilterEnum } from './types/filterEnum';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterEnum>(FilterEnum.All);
  const [loadingTodo, setLoadingTodo] = useState<number | null>(null);

  useEffect(() => {
    if (!USER_ID) {
      setErrorMessage('USER_ID is not set');

      return;
    }

    getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
        setErrorMessage(null);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const handleAddTodo = async (
    title: string,
    setIsSubmitting: (value: boolean) => void,
    resetForm: () => void,
  ): Promise<void> => {
    const tempTodo: Todo = {
      id: Date.now(),
      userId: USER_ID,
      title,
      completed: false,
    };

    setTodos(prevTodos => [...prevTodos, tempTodo]);
    setLoadingTodo(tempTodo.id);

    try {
      const newTodo = await addTodo(title);

      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === tempTodo.id ? newTodo : todo)),
      );
      resetForm();
    } catch {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== tempTodo.id));
      setErrorMessage('Unable to add a todo');
    } finally {
      setLoadingTodo(null);
      setIsSubmitting(false);
    }
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case FilterEnum.Active:
        return !todo.completed;
      case FilterEnum.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleDeleteTodo = async (id: number) => {
    try {
      setLoadingTodo(id);
      await deleteTodoApi(id);
      setTodos(todos.filter(todo => todo.id !== id));
      setErrorMessage(null);
    } catch {
      setLoadingTodo(null);
      setErrorMessage('Unable to delete todo');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodoForm onAddTodo={handleAddTodo} setErrorMessage={setErrorMessage} />

      <div className="todo__content">
        <TodoList
          todos={filteredTodos}
          onDeleteTodo={handleDeleteTodo}
          loadingTodo={loadingTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={clearCompleted}
            loadingTodo={loadingTodo}
          />
        )}
      </div>

      {!USER_ID && <UserWarning />}

      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
