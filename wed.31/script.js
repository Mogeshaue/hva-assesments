


// function changeMoodText(text){
//   let moodMessage=document.getElementById("moodMessage")
//   moodMessage.innerText=text
// }
// function addStyle(btnId){
//   let currbtn=document.getElementById(btnId)
//   let buttons=document.getElementsByTagName('button')
//   for(let i=0;i<buttons.length;i++){
//     buttons[i].style.backgroundColor="white";
//     buttons[i].style.color="black";
//   }
//   currbtn.style.backgroundColor="black";
//   currbtn.style.color="white";
// }

// let happyBtn=document.getElementById("happyBtn").addEventListener("click",function(){
//   changeMoodText("Great! Keep smiling today!")
//   addStyle("happyBtn")
// })
// let sadBtn=document.getElementById("sadBtn").addEventListener("click",function(){
//   changeMoodText("It's okay to feel down. Take a deep breath.")
//   addStyle("sadBtn")
// })
// let angryBtn=document.getElementById("angryBtn").addEventListener("click",function(){
//   changeMoodText("Try stepping away for a moment.")
//   addStyle("angryBtn")
// })
// let tiredBtn=document.getElementById("tiredBtn").addEventListener("click",function(){
//   changeMoodText("Make sure to rest and recharge.")
//   addStyle("tiredBtn")
// })
// let excitedBtn=document.getElementById("excitedBtn").addEventListener("click",function(){
//   changeMoodText("Love the energy! Keep it going!")
//   addStyle("excitedBtn")
// })


// let textInput=document.getElementById("textInput")
// let displayTest=document.getElementById("displayTest")
// let textColorBtn=document.getElementById("textColorBtn")
// let bgColorBtn=document.getElementById("bgColorBtn")
// let bigTextBtn=document.getElementById("bigTextBtn")
// console.log(displayTest)
// textInput.addEventListener("input",function(){
//   let inputValue=textInput.value
//   console.log(inputValue)
//   displayTest.innerText=inputValue
// })
// console.log(textColorBtn)
// textColorBtn.addEventListener('click',function addTextcolor(){
//   if(displayTest.style.color=="black" || displayTest.style.color==""){
//     displayTest.style.color="blue";
//   } else if(displayTest.style.color=="blue"){
//     displayTest.style.color="black";
//   }
// })

// bgColorBtn.addEventListener('click',function addBackgroundcolor(){
//   if(displayTest.style.backgroundColor=="white" || displayTest.style.backgroundColor==""){
//     displayTest.style.backgroundColor="yellow";
//     console.log(displayTest)
//     console.log(displayTest.style.backgroundColor)
//   } else if(displayTest.style.backgroundColor=="yellow"){
//     displayTest.style.backgroundColor="white";
//   }
// })

// bigTextBtn.addEventListener('click',function increaseTextSize(){
//   console.log(displayTest.style.fontSize) 
//   if(displayTest.style.fontSize=="16px" || displayTest.style.fontSize==""){
//     displayTest.style.fontSize="24px";
//   } else if(displayTest.style.fontSize=="24px"){
//     displayTest.style.fontSize="16px";
//   }
// }
// )


let itemInput=document.getElementById("itemInput")
let addBtn=document.getElementById("addBtn")
let errorMsg=document.getElementById("errorMsg")
let itemCount=document.getElementById("itemCount")
let itemList=document.getElementById("itemList")
let itemsCnt=0
addBtn.addEventListener('click',()=>{
  let item=itemInput.value
  if(item==""){
    errorMsg.innerText="Please enter an item"
  }
  if(item!=""){
    errorMsg.innerText=""
    let blockElement=document.createElement('p')
    console.log(item)
    blockElement.innerText=item
    console.log(blockElement)
    let delButton=document.createElement('button')
    delButton.innerText="Delete"
    blockElement.appendChild(delButton)
    itemList.appendChild(blockElement)
    itemsCnt++
    delButton.addEventListener('click',()=>{
      itemsCnt--;
      blockElement.remove()
      itemCount.innerHTML=`Total Items: ${itemsCnt}`
    })
    itemCount.innerHTML=`Total Items: ${itemsCnt}`

    itemInput.value=""  
  }
})