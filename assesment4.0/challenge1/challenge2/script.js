let questions=[]

const questionNo=document.getElementById('questionNo');
const category=document.getElementById('category');
const difficulty=document.getElementById('difficulty');
const question=document.getElementById('question');
const options=document.getElementById('options');
const nextBtn=document.getElementById('nextBtn');
const prevBtn=document.getElementById('prevBtn');

let index=0;
fetch("https://the-trivia-api.com/v2/questions?limit=5")
.then(response=>response.json())
.then(data=>{
    questions=data;
    showQuestion();
}).catch(error=>{
    console.log("Error fetching questions:",error);
});
console.log(questions)
function showQuestion(){
    if(index === questions.length ){
        nextBtn.disabled=true
        return  
    }
    options.innerHTML="<strong>Options:</strong>"
    questionNo.innerText=`Question ${index+1}`
    category.innerHTML=`<strong>category</strong>: ${questions[index].category}`
    difficulty.innerHTML=`<strong>difficulty</strong>: ${questions[index].difficulty}`
    question.innerHTML=`<strong>question text</strong>:${questions[index].question.text}`
    let answers=[questions[index].correctAnswer,...questions[index].incorrectAnswers]
    for(let i=0;i<answers.length;i++){
        let li=document.createElement('li')
        li.innerText=answers[i]
        options.appendChild(li)
    }   
}

nextBtn.addEventListener('click',()=>{
    console.log(index)
    index++
    if(index!=0){
        prevBtn.disabled=false
    }
    showQuestion()
})

prevBtn.addEventListener('click',()=>{
    console.log(index)
    index--
    if(index==0){
        prevBtn.disabled=true
    }
    if(index<questions.length){
        nextBtn.disabled=false
    }
    showQuestion()
})
