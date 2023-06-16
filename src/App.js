
import { useState,useEffect } from 'react';
import axios from 'axios'
import './App.css';
import api from './api/axiosConfig';


function App() {
  const [title,setTitle]=useState('');
  const [desc,setDesc]=useState('');
  const [todo,setTodo]=useState([]);
  const [needUpdate,setNeedUpdate]=useState(false)
  const [updateData,setUpdateData]=useState([{
    taskId:'',
    title:'',
    description:''
  }])
  const [hoverIndex,setHoverIndex]=useState('');

  const getTodos=async ()=>{
    try{
      const response=await api.get("/api/v1/todo-list/all")
      setTodo(response.data)
      
    }catch(e){
      console.log(e)
    }
  }

  useEffect(()=>{

      getTodos();
    
 
  },[])

  useEffect(()=>{
    getTodos();
  },[onClickHandler,deleteHandler])

  async function onClickHandler(){
    if(needUpdate){
      const data={
        title:title,
        description:desc
      }
      try{
        await api.put(`/api/v1/todo-list/update/${updateData[0].taskId}`,data)
        setNeedUpdate(false)
      }catch(e){
        console.log(e)
      }
      
    }else{
    const rand=Math.floor(Math.random() * 10000) + 1
    const data={
      taskId:rand,
      title:title,
      description:desc
    }
    setNeedUpdate(false)
    try{
      await api.post("/api/v1/todo-list/create",data)
    }catch(e){
      console.log(e)
    }

  } 
  setTitle('')
  setDesc('')
  }

  async function deleteHandler(taskId){
    await api.delete(`/api/v1/todo-list/delete/${taskId}`);

  }
  let updateId;
  
  function updateHandler(taskId){ 
    setNeedUpdate(true)
    updateId=taskId
    setUpdateData(todo.filter((item)=>{return item.taskId===updateId}))
    let UpdateData=todo.filter((item)=>{return item.taskId===updateId})
    setTitle(UpdateData[0].title)
    setDesc(UpdateData[0].description)
  }

  //hover operation

  function hoverHandlerIn(index){
    
    setHoverIndex(index)
    
  }
  function hohoverHandlerOut(){
    setHoverIndex(null)
  }



  return (
    <div className="App">
      <div>
        <h3>title</h3>
        <input width={5} onChange={(event)=>setTitle(event.target.value)} value={title}/>
      </div>
      <div>
        <h3>Description</h3>
        <input width={5} onChange={(event)=>{setDesc(event.target.value)}} value={desc}/>
      </div>
      <button onClick={onClickHandler}>{needUpdate?'Update':'Add'}</button>
      <div>
        <ul>
          {todo.map((item,index)=>{return <li key={index} 
          onMouseEnter={hoverHandlerIn.bind(this,index)} 
          onMouseLeave={hohoverHandlerOut}
          >{item.title}
          {hoverIndex==index &&<p>dfd</p>}
          <button onClick={updateHandler.bind(this,item.taskId)}>update</button>
          <button onClick={deleteHandler.bind(this,item.taskId)}>delete</button>
          </li>})}
        </ul>
      </div>
    </div>
  );
}

export default App;
