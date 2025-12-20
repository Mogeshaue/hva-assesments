const showMessage= document.getElementById('show-message')
  const textArea=document.getElementById('text-area')


  showMessage.addEventListener('click',()=>{
      showMessage.disabled=true
      textArea.style.color="black"
      textArea.textContent="Loading message..."
      let delayMessage=new Promise((resolve,reject)=>{
        setTimeout(()=>{
          let randomNum=Math.random()
          if(randomNum>0.5){
              resolve("Message loaded successfully!")
          }
          else{
              reject("Something went wrong!")
          }
        },2000)
      })

      delayMessage
      .then((res)=>{
          textArea.textContent=res
          textArea.style.color="green"
          showMessage.disabled=false
      })
      .catch((err)=>{
          textArea.textContent=err
          textArea.style.color="red"
          showMessage.disabled=false
      })

  })