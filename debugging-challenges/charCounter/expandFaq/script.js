
let questions=document.getElementsByClassName("questions")
for(let i=0; i<questions.length;i++){
    questions[i].addEventListener('click',()=>{
    let nextEl=questions[i].nextElementSibling
    while(nextEl && nextEl.tagName=='P'){
        if(nextEl.style.display=='none'){
        nextEl.style.display='block'
        }else{
        nextEl.style.display='none'
        }
        nextEl=nextEl.nextElementSibling
    }
})

}


