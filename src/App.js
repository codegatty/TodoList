
import { useState, useEffect } from 'react';
import axios from 'axios'
import './App.css';
import api from './api/axiosConfig';
import React from "react";
import AnimatedCursor from "react-animated-cursor"
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toast.css';
import Particles from 'react-tsparticles';





function App() {
  const [loading, setLoading] = useState(true);


  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [todo, setTodo] = useState([{
    taskId: '',
    title: '',
    description: ''
}]);
  const [needUpdate, setNeedUpdate] = useState(false)
  const [updateData, setUpdateData] = useState([{
    taskId: '',
    title: '',
    description: '',
    completed:false
  }])
  const [hoverIndex, setHoverIndex] = useState(null);

  const getTodos = async () => {
    try {
      const response = await api.get("/api/v1/todo-list/all")
      setTodo(response.data)
      

    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTimeout(async () => {
          await getTodos();
          setLoading(false);
        }, 2500);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    getTodos();
  }, [onClickHandler, deleteHandler])

  async function onClickHandler() {
    if (needUpdate) {
      const data = {
        title: title,
        description: desc,
        completed:updateData[0].completed
      }
      try {
        await api.put(`/api/v1/todo-list/update/${updateData[0].taskId}`, data)
        setNeedUpdate(false)
        toast.success("Task Updated Successfully!");
      } catch (e) {
        console.log(e)
      }

    } else {
      const rand = Math.floor(Math.random() * 10000) + 1
      const data = {
        taskId: rand,
        title: title,
        description: desc,
        completed:false
      }
      setNeedUpdate(false)
      try {
        await api.post("/api/v1/todo-list/create", data)
        toast.success("New Task Added!");
      } catch (e) {
        console.log(e)
      }

    }
    setTitle('')
    setDesc('')
    
  }

  async function deleteHandler(taskId) {
    await api.delete(`/api/v1/todo-list/delete/${taskId}`);
    toast.success("Task Deleted Successfully!")

  }
  let updateId;

  function updateHandler(taskId) {
    setNeedUpdate(true)
    updateId = taskId
    setUpdateData(todo.filter((item) => { return item.taskId === updateId }))
    let UpdateData = todo.filter((item) => { return item.taskId === updateId })
    setTitle(UpdateData[0].title)
    setDesc(UpdateData[0].description)
  }

  async function checkBoxHandler(index){
    const change=!todo[index].completed
    let updated={
      title:todo[index].title,
      description:todo[index].description,
      completed:change};

      console.log(updated)
      await api.put(`/api/v1/todo-list/update/${todo[index].taskId}`,updated)
      if (change) {
        toast.success('Task Is Marked As Complete');
      } else {
        toast.error('Task Is Marked As Incomplete');
      }
  }

  //hover operation

  function hoverHandlerIn(index) {

    setHoverIndex(index)

  }
  function hohoverHandlerOut() {
    setHoverIndex(null)
  }

  


  return (
    
    <div className="App">
      <ToastContainer/>
      
      {loading && (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
        </div>
      )}
      <h1 class="titlefont" style={{color:'wheat',letterSpacing:'1px'}}>Todo List</h1>
      
      <div class="form-container">
      <div className='form'>
        <input width={20} onChange={(event) => setTitle(event.target.value)} value={title} placeholder='Title'/>
        <input width={20} onChange={(event) => { setDesc(event.target.value) }} value={desc} placeholder='Your note goes here...' style={{marginTop:'10px'}}/>
      </div>
      <div className='btn-container'>
      <button class="glow-on-hover" onClick={onClickHandler}>{needUpdate ? 'Update Task' : 'Add Task'}</button>
      </div>
      </div>
      



    <div className="mouse">
    <AnimatedCursor
     innerSize={10}
     outerSize={45}
     innerScale={1}
     outerScale={2}
     outerAlpha={0}
     hasBlendMode={true}
     outerStyle={{
      border: '3px solid var(--cursor-color)'
    }}
    innerStyle={{
      backgroundColor: 'var(--cursor-color)'
    }}
    />
    </div>



      <h1 class="tablefont" style={{color:'wheat',letterSpacing:'1px'}}> All Tasks/Saved Tasks</h1>
      <div className='list-container'>
        <ul>
          {todo.map((item, index) => {
            return <li key={index}
              onMouseEnter={hoverHandlerIn.bind(this, index)}
              onMouseLeave={hohoverHandlerOut}
            >

              
              <div className='li-container'>
              <div className='top'>
              <h4 style={{
                textDecoration: item.completed ? 'line-through' : 'none',
                fontStyle: item.completed ? 'italic' : 'normal',
                color: item.completed ? 'gray' : 'inherit',
                textShadow: item.completed ? '2px 2px 4px rgba(0, 0, 0, 0.5)' : 'none',
                opacity: item.completed ? 0.7 : 1,
              }}>{item.title}</h4>
              <div className='button-container'>
              <div className='checkbox-container'>
              <input type='checkbox' 
                checked={todo[index].completed} 
                onChange={checkBoxHandler
                .bind(this,index)}/>
              <label>{todo[index].completed ? "Complete" : "Incomplete"}</label>
              </div>
              <button class="glow-on-hover" circle onClick={updateHandler.bind(this, item.taskId)}> Update</button>
              <button class="glow-on-hover" circle onClick={deleteHandler.bind(this, item.taskId)} > Delete</button>
              </div>
              </div>
              <div className='bottom'>
              {hoverIndex === index && (
                <p
                  style={{
                  color: todo[index].completed ? 'gray' : 'inherit',
                  opacity: todo[index].completed ? 0.7 : 1,
                  textShadow: todo[index].completed ? '2px 2px 4px rgba(0, 0, 0, 0.5)' : 'none',
                  }}>
                  {todo[hoverIndex].description}
                </p>
              )}
              </div>
              </div>


            </li>
          })}
        </ul>
      </div>


    </div>
  );
}

export default App;
