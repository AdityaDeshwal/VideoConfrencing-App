import React, {useState,useEffect}from "react";
import "./App.css";
import Player from "./Player";
import Runplayer from "./xyz";

function App(){
  // const[message,setMessage]=useState("");

  // useEffect(()=>{
  //   fetch("http://localhost:8000/message")
  //   .then((res)=>res.json())
  //   .then((data)=>setMessage(data.message));
  // },[]);

  return (
    <><Player /><Runplayer /></>
  );
}
export default App;
