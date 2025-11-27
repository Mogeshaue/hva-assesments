let textInput=document.getElementById("textInput")
let charCount=document.getElementById("charCount")
let count=0
textInput.addEventListener('input',()=>{
  count=textInput.value.length
  if(count<100){
    charCount.innerText=`Characters: ${count} / 100`
    charCount.style.color="black";
  }else{
    charCount.innerText=`Characters: ${count} / 100`
    charCount.style.color="red";
  }
})
