import {
  RecoilRoot,
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { useState } from "react";

function App() {
  return (
    <RecoilRoot>
      <div className="container-fluid mt-2">
        <TodoFilter />
        <ItemCreator />
        <TodoList />
      </div>
    </RecoilRoot>
  );
}

let idUnico = 0;

const todoListState = atom({
  key: "todoListState",
  default: [],
});

function ItemCreator() {
  const [text, setText] = useState("");
  const setNewTodo = useSetRecoilState(todoListState);

  const onChangeText = (event) => {
    setText(event.target.value);
  };

  const onClick = () => {
    setNewTodo((oldTodoList) => {
      return [
        ...oldTodoList,
        {
          id: idUnico++,
          text,
          isCompleted: false,
        },
      ];
    });
    setText("");
  };

  return (
    <div className="row mt-3">
      <div className="col-sm-4">
        <input
          value={text}
          onChange={onChangeText}
          placeholder="Escriba algo"
          className="form-control col"
        />
      </div>
      <div className="col-sm-2 text-center">
        <button className="btn btn-primary col" onClick={onClick}>
          Agregar
        </button>
      </div>
    </div>
  );
}

// const todos = [
//   { id: 1, text: "Todo 1", isCompleted: false },
//   { id: 2, text: "Todo 2", isCompleted: false },
//   { id: 3, text: "Todo 3", isCompleted: true },
// ];

function TodoList() {
  const todos = useRecoilValue(todoListState);
  return (
    <div className="container-fluid mt-5">
      {todos.map((item) => (
        <TodoItem key={item.id} {...item} />
      ))}
    </div>
  );
}

function changeItem(id, todoList, changedItem) {
  const index = todoList.findIndex((item) => item.id === id);
  return [
    ...todoList.slice(0, index),
    changedItem,
    ...todoList.slice(index + 1, todoList.length),
  ];
}

function deleteItem(id, todoList) {
  const index = todoList.findIndex((item) => item.id === id);
  return [
    ...todoList.slice(0, index),
    ...todoList.slice(index + 1, todoList.length),
  ];
}

function TodoItem({ id, text, isCompleted }) {
  // const [todoList, setTodoList] = useSetRecoilState(todoListState)
  const [todoList, setTodoList] = useRecoilState(todoListState);

  const onChangeTodoItem = (event) => {
    const textValue = event.target.value;
    const changedItem = {
      id,
      text: textValue,
      isCompleted,
    };
    setTodoList(changeItem(id, todoList, changedItem));
  };

  const onToggleCompleted = (event) => {
    const changedItem = {
      id,
      text,
      isCompleted: !isCompleted,
    };
    setTodoList(changeItem(id, todoList, changedItem));
  };

  const onClickDelete = () => {
    setTodoList(deleteItem(id, todoList));
  };

  return (
    <div className="row mb-1">
      <div className="col-sm-3">
        <input
          className="form-control"
          value={text}
          onChange={onChangeTodoItem}
        />
      </div>
      <div className="col-sm-1">
        <input
          className="form-check-input"
          type="checkbox"
          onChange={onToggleCompleted}
          checked={isCompleted}
        />
      </div>
      <div className="col-sm-2 text-center">
        <button className="btn btn-danger" onClick={onClickDelete}>
          X
        </button>
      </div>
    </div>
  );
}

function TodoFilter() {
  return (
    <div className="row">
      <div className="col-sm-1">
        <label for="listFilters">Filtro:</label>
      </div>
      <div className="col-sm-5">        
        <select className="form-select" id="listFilters">
          <option value="all">Todos</option>
          <option value="done">Realizados</option>
          <option value="notDone">No Realizados</option>
        </select>
      </div>
    </div>
  );
}

export default App;
