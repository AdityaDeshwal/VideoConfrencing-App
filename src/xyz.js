import React from "react";
// import { useEffect } from "react";
import AgoraRTM from 'agora-rtm-sdk';

let localstream;
let remotestream;
let peerConnection;

let APP_ID="7cbb24f5619b4d5f8f1ec69f6b35ee9c";
let token=null;
let uid=String(Math.floor(Math.random()*10000));
let client;
let channel;

let queryString=window.location.search
let urlParams=new URLSearchParams(queryString)
let roomId=urlParams.get('room')

if(!roomId){
  window.location='lobby.html'
}

let constraints={
  video:{
    width:{min:640,ideal:1920,max:1920},
    height:{min:480,ideal:1080,max:1080},
  },
  audio:true
}

const servers={
  iceservers:[
    {
      urls:['stun:stun1.l.google.com:19302','stun:stun2.l.google.com:19302']
    }
  ]
}

localstream=await navigator.mediaDevices.getUserMedia(constraints);
// let Init= async()=>{
//   // useEffect(()=>{
//   //   document.getElementById('user-1').srcObject=localstream 
//   // },[]);
//   useEffect(()=>{
//     document.getElementById('user-2').srcObject=remotestream
//   },[]);
// }


let creatingchannel=async()=>{
  client=await AgoraRTM.createInstance(APP_ID);
  await client.login({uid,token})
  channel=client.createChannel(roomId);
  await channel.join();
  channel.on('MemberJoined',handleUserJoined)
  channel.on('MemberLeft',handleUserLeft)

  client.on('MessageFromPeer',handleMessageFromPeer)
  document.getElementById('user-1').srcObject=localstream 

  document.getElementById('camera-btn').addEventListener('click',toggleCamera)
  document.getElementById('mic-btn').addEventListener('click',toggleMic)
}

let handleUserLeft=(MemberId)=>{
  document.getElementById('user-2').style.display='none'
  document.getElementById('user-1').classList.remove('smallFrame')
}

let handleMessageFromPeer=async(message,MemberId)=>{
  message=JSON.parse(message.text)
  if(message.type==='offer'){
    createanswer(MemberId,message.offer)
  }
  if(message.type==='answer'){
    console.log("answere received")
    addAnswer(message.answer)
  }
  if(message.type==='candidate'){
    if(peerConnection){
      peerConnection.addIceCandidate(message.candidate)
    }
  }
}

let handleUserJoined=async (MemberId)=>{
  console.log('A new user is joined',MemberId)
  createoffer(MemberId)
}

let createPeerConnection=async(MemberId)=>{
  peerConnection=new RTCPeerConnection(servers) 
  remotestream=new MediaStream()
  document.getElementById('user-2').srcObject=remotestream
  document.getElementById('user-2').style.display='block'

  document.getElementById('user-1').classList.add('smallFrame')

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
      client.sendMessageToPeer({text:JSON.stringify({'type':'candidate','candidate':event.candidate})},MemberId)
      }
  }

}

let createoffer=async(MemberId)=>{
  await createPeerConnection(MemberId)


  let offer=await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)

  //console.log('offer:',offer)
  client.sendMessageToPeer({text:JSON.stringify({'type':'offer','offer':offer})},MemberId)
}

let createanswer=async(MemberId,offer)=>{
  await createPeerConnection(MemberId)

  await peerConnection.setRemoteDescription(offer)

  let answer=await peerConnection.createAnswer()
  await peerConnection.setLocalDescription(answer)
  client.sendMessageToPeer({text:JSON.stringify({'type':'answer','answer':answer})},MemberId)
}

let addAnswer=async(answer)=>{
  if(!peerConnection.currentRemoteDescription){
    peerConnection.setRemoteDescription(answer)
  }
}
creatingchannel()

let leavechannel=async()=>{
  await channel.leave()
  await client.logout()
}

let toggleCamera=async()=>{
  let videoTrack=localstream.getTracks().find(track => track.kind==='video')
  if(videoTrack.enabled){
    videoTrack.enabled=false;
    document.getElementById('camera-btn').style.backgroundColor='rgb(255,80,80)'
  }
  else{
    videoTrack.enabled=true
    document.getElementById('camera-btn').style.backgroundColor='rgb(179,102,249,.9'
  }
}

let toggleMic=async()=>{
  let audioTrack=localstream.getTracks().find(track => track.kind==='audio')
  if(audioTrack.enabled){
    audioTrack.enabled=false;
    document.getElementById('mic-btn').style.backgroundColor='rgb(255,80,80)'
  }
  else{
    audioTrack.enabled=true
    document.getElementById('mic-btn').style.backgroundColor='rgb(179,102,249,.9'
  }
}

window.addEventListener('beforeunload',leavechannel)


function Runplayer(){
  // Init()
  return(
    <h1></h1>
  );
}
export default Runplayer;