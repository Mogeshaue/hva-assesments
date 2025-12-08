let counterContainer=document.getElementById('counterContainer')
let stBtn=document.getElementById('stBtn')
let pauseBtn=document.getElementById('pauseBtn')
let resetBtn=document.getElementById('resetBtn')
let counter=0
let intervalId;
 stBtn.addEventListener('click',()=>{
 stBtn.disabled=true
 intervalId= setInterval(()=>{
  counter+=1
  counterContainer.innerText=counter
  },1000)
})

pauseBtn.addEventListener('click',()=>{
    if(intervalId){
        pauseBtn.innerText="Resume"
        clearInterval(intervalId)
        intervalId=null
    }else{
        pauseBtn.innerText="Pause"
        intervalId= setInterval(()=>{
            counter+=1
            counterContainer.innerText=counter
            },1000)
    }
})
resetBtn.addEventListener('click',()=>{
  counter=0
    counterContainer.innerText=counter
    if(intervalId){
        clearInterval(intervalId)
        intervalId=null
    }
    stBtn.disabled=false
    pauseBtn.innerText="Pause"
})
