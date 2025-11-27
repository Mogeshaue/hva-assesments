let btnArr=document.getElementsByClassName('btn')
for(let i=0;i<btnArr.length;i++){
  btnArr[i].addEventListener('click', ()=>{
    btnArr[i].nextElementSibling.innerText="This button is clicked!"
  })
}

