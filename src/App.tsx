/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { addTodo, deleteTodoApi, getTodos, USER_ID } from './api/todos';
import { TodoList } from './TodoList';
import { Footer } from './Footer';
import { ErrorNotification } from './ErrorNotification';
import { TodoForm } from './TodoForm';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { FilterEnum } from './types/filterEnum';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterEnum>(FilterEnum.All);

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

  const handleAddTodo = async (title: string) => {
    const tempId = Date.now();
    const temporaryTodo: Todo = {
      id: tempId,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temporaryTodo);
    setTodos(current => [...current, temporaryTodo]);

    try {
      const newTodo = await addTodo(title);

      setTodos(current =>
        current.map(todo => (todo.id === tempId ? newTodo : todo)),
      );
      setTempTodo(null);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Unable to add a new todo');
      setTodos(current => current.filter(todo => todo.id !== tempId));
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodoApi(id);
      setTodos(todos.filter(todo => todo.id !== id));
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Unable to delete todo');
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

  return (
    <div className={`todoapp ${errorMessage ? 'has-error' : ''}`}>
      <h1 className="todoapp__title">todos</h1>

      <div className="todo__content">
        <TodoForm onAddTodo={handleAddTodo} setErrorMessage={setErrorMessage} />
        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          onDeleteTodo={handleDeleteTodo}
        />
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={clearCompleted}
          />
        )}
      </div>
      {!USER_ID && <UserWarning />}
    </div>
  );
};
