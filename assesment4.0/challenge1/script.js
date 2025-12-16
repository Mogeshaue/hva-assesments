var questions = [
  {
    questionText: "Which planet is known as the Red Planet?",
    correctAnswer: "Mars",
    incorrectAnswers: ["Venus", "Jupiter", "Mercury"]
  },
  {
    questionText: "What is the capital of Japan?",
    correctAnswer: "Tokyo",
    incorrectAnswers: ["Kyoto", "Osaka", "Nagoya"]
  },
  {
    questionText: "Which instrument has 88 keys?",
    correctAnswer: "Piano",
    incorrectAnswers: ["Guitar", "Violin", "Flute"]
  },
  {
    questionText: "Which gas do plants absorb from the atmosphere?",
    correctAnswer: "Carbon dioxide",
    incorrectAnswers: ["Oxygen", "Nitrogen", "Helium"]
  },
  {
    questionText: "Who wrote 'Romeo and Juliet'?",
    correctAnswer: "William Shakespeare",
    incorrectAnswers: ["Charles Dickens", "Mark Twain", "Jane Austen"]
  },
  {
    questionText: "What is the largest ocean on Earth?",
    correctAnswer: "Pacific Ocean",
    incorrectAnswers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"]
  }
];


const questionNo=document.getElementById('questionNo')
const question=document.getElementById('question')
const optionForm=document.getElementById('optionForm')
const options=optionForm.querySelectorAll("input[type='radio']")
const nextBtn=document.getElementById('nextBtn')
const statusElement=document.getElementById('status')
const spanElements=optionForm.querySelectorAll("span")

let index=0


function showQuestion(){
  if(index>=questions.length){
    questionNo.innerText=""
    question.innerText="All questions are over."
    optionForm.style.display="none"
    statusElement.innerText=""
    nextBtn.style.display="none"
    return
  }
  questionNo.innerText=`Question ${index+1}:`
  question.innerText=questions[index].questionText
  let choices=[questions[index].correctAnswer,...questions[index].incorrectAnswers]
  for(let i=0;i<options.length;i++){
    options.checked=false
    options[i].value=choices[i]
    spanElements[i].innerText=choices[i]
  }
  statusElement.innerText=""
}
optionForm.addEventListener('change',function(e){
  e.preventDefault()
  let selected
  for(let i=0;i<options.length;i++){
    if(options[i].checked){
      selected=options[i].value
      break
    }
  }
  console.log(selected)
  if(selected==questions[index].correctAnswer){
    statusElement.innerText="Correct"
  }else{
    statusElement.innerText="Wrong"
  }

})


nextBtn.addEventListener('click',function(){
  for(let i=0;i<options.length;i++){
    options[i].checked=false
  }
  statusElement.innerText=""
  index+=1
  showQuestion()
})
showQuestion()