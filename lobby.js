let help=async()=>{
    if(document.getElementById('welcome-message').style.visibility==='visible'){
        document.getElementById('welcome-message').style.visibility='hidden'
    }
    else{
        document.getElementById('welcome-message').style.visibility='visible'
    }
}
let helpover=async()=>{
    document.getElementById('welcome-message').style.visibility='hidden'
}
document.getElementById('help-btn').addEventListener('click',help)
document.getElementById('welcome-message').addEventListener('click',helpover)