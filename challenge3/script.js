let startBtn=document.getElementById('startBtn')
let score=0
let boxElement=document.getElementsByClassName('box')
let intervalId;
let timer=document.getElementById('timer')
let scoreCard=document.getElementById('scoreCard')
let countdownId;
function removeActiveClass(){
    for(let i=0;i<boxElement.length;i++){
        boxElement[i].classList.remove('active')
    }
}

for(let i=0;i<boxElement.length;i++){
    boxElement[i].addEventListener('click',function(){
        if(boxElement[i].classList.contains('validScore')){
            score++
            boxElement[i].classList.remove('validScore')
        }
    }
)}
function restart(){
    clearInterval(intervalId)
    startBtn.disabled=false
    scoreCard.setAttribute('style','display:block')
    scoreCard.innerText='Your Score: '+score
    score=0
    clearInterval(countdownId)
    removeActiveClass()
}
startBtn.addEventListener('click',function(){
    score=0
    scoreCard.setAttribute('style','display:none')
    startBtn.disabled=true
      timeLeft = 30;
    timer.innerText = 'Time Left: ' + timeLeft + 's';
    countdownId = setInterval(() => {
        timeLeft--;
        timer.innerText = 'Time Left: ' + timeLeft + 's';

        if (timeLeft <= 0) {
            clearInterval(countdownId);
        }
    }, 1000);
    setTimeout(restart,30000)
    startBtn.disabled=true
    intervalId=setInterval(function(){
        let raondomNum=Math.floor(Math.random()*9)
        removeActiveClass()
        boxElement[raondomNum].classList.add('active')
        boxElement[raondomNum].classList.add('validScore')
        setTimeout(function(){
            boxElement[raondomNum].classList.remove('validScore')
            boxElement[raondomNum].classList.remove('active')
        },1000)

    },2000)
})