import {
  RecoilRoot,
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  selector,
} from "recoil";
import axios from 'axios'
import React, { useState } from "react";

function App() {
  return (
    <RecoilRoot>
      <div className="container-fluid mt-2">
        <React.Suspense fallback={<h1>Cargando</h1>}>
          <UserData />
          <TodoFilter />
          <TodoStats />
          <ItemCreator />
          <TodoList />
        </React.Suspense>
      </div>
    </RecoilRoot>
  );
}

let idUnico = 0;

const todoListState = atom({
  key: "todoListState",
  default: [],
});

const todoFilterState = atom({
  key: "todoFilterState",
  default: "all",
});

const todoFilterSelector = selector({
  key: "todoFilterSelector",
  get: ({ get }) => {
    const list = get(todoListState);
    const filter = get(todoFilterState);

    switch (filter) {
      case "done":
        return list.filter((item) => item.isCompleted);
      case "notDone":
        return list.filter((item) => !item.isCompleted);
      default:
        return list;
    }
  },
});

const todoStatsSelector = selector({
  key: 'todoStatsSelector',
  get: ({get}) => {
    const list = get(todoListState)
    const toDo = list.filter(item => item.isCompleted).length
    const notTodo = list.filter(item => !item.isCompleted).length
    const completedPercentage = (list.length === 0) ? 0 : (notTodo / list.length)

    const data = {
      total: list.length, 
      toDo, 
      notTodo, 
      completedPercentage
    }

    return data
  }
})

const userDataSelector = selector({
  key: "userDataSelector",
  get: async() => {
    const response = await axios.get("http://localhost:3001/users/1");
    return response.data
  }
})

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
  // const todos = useRecoilValue(todoListState);
  const todos = useRecoilValue(todoFilterSelector);
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
  const [filterState, setFilterState] = useRecoilState(todoFilterState);
  const onSelectedItem = (event) => {
    const { value } = event.target;
    setFilterState(value);
  };
  return (
    <div className="row">
      <div className="col-sm-1">
        <label>Filtro:</label>
      </div>
      <div className="col-sm-5">
        <select
          className="form-select"
          id="listFilters"
          value={filterState}
          onChange={onSelectedItem}
        >
          <option value="all">Todos</option>
          <option value="done">Realizados</option>
          <option value="notDone">No Realizados</option>
        </select>
      </div>
    </div>
  );
}

function TodoStats(){
  const { total, toDo, notTodo, completedPercentage } = useRecoilValue(todoStatsSelector)
  return (
    <div>
      <span>Tareas totales: {total} </span> <br/>
      <span>Tareas por hacer: {notTodo} </span> <br/>
      <span>Tareas realizadas: {toDo} </span> <br/>
      <span>Progreso: {completedPercentage * 100}% </span>
    </div>
  )
}

function UserData(){
  const user = useRecoilValue(userDataSelector)
  return (
    <h1>{user.name}</h1>
  )
}

export default App;
