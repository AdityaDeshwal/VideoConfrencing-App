import React from "react";
import { useEffect } from "react";
import AgoraRTM from 'agora-rtm-sdk';
let APP_ID="7cbb24f5619b4d5f8f1ec69f6b35ee9c";

let localstream;
let remotestream;
let peerConnection;
let client=await AgoraRTM.createInstance(APP_ID);
// // let channel=
const servers={
  iceservers:[
    {
      urls:['stun:stun1.l.google.com:19302','stun:stun2.l.google.com:19302']
    }
  ]
}

localstream=await navigator.mediaDevices.getUserMedia({video:true, audio:false});
let Init= async()=>{
  useEffect(()=>{
    document.getElementById('user-1').srcObject=localstream 
  },[]);
  useEffect(()=>{
    document.getElementById('user-2').srcObject=remotestream
  },[]);
}

let createoffer=async()=>{

  peerConnection=new RTCPeerConnection(servers) 
  remotestream=new MediaStream()

  localstream.getTracks().forEach((track)=>{
    peerConnection.addTrack(track,localstream)
    // it is leting us get tracks from other connection
  })
 
  peerConnection.ontrack=(event)=>{
    event.streams[0].getTracks().forEach((track)=>{
      remotestream.addTrack(track)
    })
  }


  peerConnection.onicecandidate=async(event)=>{
    if(event.candidate){
      console.log('new ICE candidate:',event.candidate)
    }
  }


  let offer=await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)

  console.log('offer:',offer)
}
createoffer()


function Runplayer(){
  Init()
  return(
    <h1>working</h1>
  );
}
export default Runplayer;