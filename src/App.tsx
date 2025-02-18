/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import {
  deleteTodoApi,
  getTodos,
  USER_ID,
  addTodo,
  toggleTodo,
} from './api/todos';
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

  const focusInput = () => {
    const inputElement = document.querySelector<HTMLInputElement>(
      'input.todoapp__new-todo',
    );

    inputElement?.focus();
  };

  useEffect(() => {
    if (!USER_ID) {
      setErrorMessage('USER_ID is not set');

      return;
    }

    getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
        setErrorMessage(null);
        focusInput();
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
      focusInput();
    }
  };

  const handleToggleTodo = async (id: number) => {
    try {
      setLoadingTodo(id);
      const toggledTodo = await toggleTodo(todos.find(todo => todo.id === id)!);

      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? toggledTodo : todo)),
      );
      setErrorMessage(null);
    } catch {
      setErrorMessage('Unable to toggle todo');
    } finally {
      setLoadingTodo(null);
      focusInput();
    }
  };

  const clearCompleted = async () => {
    const completedTodo = todos.filter(todo => todo.completed);

    if (completedTodo.length === 0) {
      return;
    }

    try {
      const results = await Promise.allSettled(
        completedTodo.map(todo => deleteTodoApi(todo.id)),
      );

      const successfullyDeletedIds = completedTodo
        .filter((_, index) => results[index].status === 'fulfilled')
        .map(todo => todo.id);

      setTodos(prevTodos =>
        prevTodos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
      );

      if (results.some(result => result.status === 'rejected')) {
        setErrorMessage('Unable to delete a todo');
      } else {
        setErrorMessage(null);
      }
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      focusInput();
    }
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
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoadingTodo(null);
      focusInput();
    }
  };

  const handleErrorClose = () => {
    setErrorMessage(null);
    focusInput();
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodoForm onAddTodo={handleAddTodo} setErrorMessage={setErrorMessage} />

      <div className="todo__content">
        <TodoList
          todos={filteredTodos}
          onDeleteTodo={handleDeleteTodo}
          onToggleTodo={handleToggleTodo}
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

      <Error errorMessage={errorMessage} setErrorMessage={handleErrorClose} />
    </div>
  );
};
