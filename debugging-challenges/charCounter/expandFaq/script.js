
let questions=document.getElementsByClassName("questions")
for(let i=0; i<questions.length;i++){
    questions[i].addEventListener('click',()=>{
    let quesEl=questions[i].nextElementSibling
    let ansEl=quesEl.nextElementSibling
    if(quesEl.style.display=="block" && ansEl.style.display=="block" ){
        quesEl.style.display="none"
        ansEl.style.display="none"
    }else if(quesEl.style.display=="none" &&  ansEl.style.display=="none"){
    quesEl.style.display="block"
    ansEl.style.display="block"}
})

}