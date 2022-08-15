import { 
  RecoilRoot,
  atom,
  useRecoilState,
  useRecoilValue
} from "recoil";
import { useState } from "react";

function App() {
  return (
    <RecoilRoot>
      <div className="container-fluid mt-2">
      <ItemCreator />
      <TodoList />
      </div>
    </RecoilRoot>
  );
}

let id = 0;

const todoListState = atom({
  key: "todoListState",
  default: []
})

function ItemCreator() {
  const [text, setText] = useState("");
  const [newTodo, setNewTodo] = useRecoilState(todoListState)

  const onChangeText = (event) => {
    setText(event.target.value);
  };

  const onClick = () => {
    setNewTodo(
      [...newTodo,
      {
        id: id++, text, isCompleted: false
      }]
    )
    setText('')
  }

  return (
    <div className="row">
      <div className="col-sm-4">
        <input value={text} onChange={onChangeText} placeholder="Escriba algo" className="form-control col" />
      </div>
      <div className="col-sm-2 text-center">
        <button className="btn btn-primary col" onClick={onClick}>Agregar</button>
      </div>
    </div>
  );
}

// const todos = [
//   { id: 1, text: "Todo 1", isCompleted: false },
//   { id: 2, text: "Todo 2", isCompleted: false },
//   { id: 3, text: "Todo 3", isCompleted: true },
// ];

function TodoList(){
  const todos = useRecoilValue(todoListState)
  return (
    <div className="container-fluid mt-5">
      {
        todos.map(item => <TodoItem key={item.id} {...item} />)
      }
    </div>
  )
}

function TodoItem({text, isCompleted}){
  const onChangeTodoItem = (event) => {

  }
  return (
    <div className="row mb-1">
      <div className="col-sm-3">
      <input className="form-control" value={text} onChange={onChangeTodoItem} />
      </div>
      <div className="col-sm-1">
      <input className="form-check-input" type="checkbox" checked={isCompleted} />
      </div>
      <div className="col-sm-2 text-center">
      <button className="btn btn-danger">X</button>
      </div>
    </div>
  )
}

export default App;
