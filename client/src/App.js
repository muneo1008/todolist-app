import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, InputGroup, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [inputTitle, setInputTitle] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const lineThroughClass = { textDecoration: "line-through", color: "blue" };

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios.get('http://localhost:5000/api/todo')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };


  const handleSave = () => {
    if (!inputTitle){
      alert('내용을 입력해주세요');
      return;
    };

    const newTodo = {
      title: inputTitle,
    };

    axios.post('http://localhost:5000/api/todo', newTodo)
      .then((response) => {
        setData([...data, response.data]);
        setInputTitle("");
        // console.log("Save Todo: ",response.data)
      })
      .catch((error) => {
        console.error('Error saving todo:', error);
      });
  };
  const handleDelete = (no) => {
    if(window.confirm("정말 삭제하시겠습니까?")){
      axios.delete(`http://localhost:5000/api/todo/${no}`)
      .then((response) => {
        setData(data.filter(todo => todo.no !== no));
        // console.log('Delete Todo: ',response.data);
      })
      .catch((error) => {
        console.error('Error deleting todo:', error);
      });
    }else return;
    
  }

  const handleCheck = (no) => {
    const updatedTodos = data.map(todo => {
      if (todo.no === no) {
        const updatedTodo = { ...todo, done: !todo.done };
        axios.put(`http://localhost:5000/api/todo/${no}`, updatedTodo)
          .then((response) => {
            // console.log('Todo updated:', response.data);
          })
          .catch((error) => {
            console.error('Error updating todo:', error);
          });
        return updatedTodo;
      }
      return todo;
    });
    setData(updatedTodos);
  };

  const changeTitle = (e)=>{
    setEditTitle(e.target.value);
  }
  const handleEdit = (no)=>{
    if(editTitle !== ''){
      const editTodos = data.map(todo => {
        if (todo.no === no) {
          const editTodo = { ...todo, title:editTitle };
          axios.put(`http://localhost:5000/api/todo/${no}`, editTodo)
            .then((response) => {
              // console.log('Todo edit:', response.data);
            })
            .catch((error) => {
              console.error('Error editing todo:', error);
            });
          return editTodo;
        }
        return todo;
      });
      setData(editTodos);
      setEditTitle('');
    }else{
      alert('내용 변경 후 수정을 눌러주세요.');
      return;
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>TodoList App</h1>
      </header>
      <div className='inputTitle'>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Input Todo"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
          />
          <Button variant="primary" id="button-addon2" onClick={handleSave}>
            Save
          </Button>
        </InputGroup>
      </div>
      <div className='outputTitle'>
        <Table className='rounded-table' striped bordered responsive hover>
          <thead>
            <tr>
              <th>Todo</th>
            </tr>
          </thead>
          {data && (
            <tbody>
              {data.map(todo => (
                <tr key={todo.no}>
                  <td>
                    <InputGroup>
                      <InputGroup.Checkbox defaultChecked={todo.done} onChange={()=>handleCheck(todo.no)}/>
                      <Form.Control
                        style={todo.done ? lineThroughClass : {}}
                        defaultValue={todo.title}
                        onChange={changeTitle}
                      />
                      <Button variant="primary" onClick={()=>handleEdit(todo.no)}>Edit</Button>
                      <Button variant="danger" onClick={()=>handleDelete(todo.no)}>Delete</Button>
                    </InputGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </Table>
      </div>
    </div>
  );
}

export default App;
