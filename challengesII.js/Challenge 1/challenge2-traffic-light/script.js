const circle = document.getElementById("traffic-light");
const stButton=document.getElementById('st-btn')
const timeContainer=document.getElementById("time-container")
const statusContainer=document.getElementById("status-container")
let colors = {"green":6000, "yellow":2000,"red":6000 };
let timerId


function changeColour(color){
    circle.style.backgroundColor=color  
}

function showTimer(seconds) {
    clearInterval(timerId);
    timeContainer.textContent = seconds;

    timerId = setInterval(() => {
        seconds--;
        timeContainer.textContent = seconds;

        if (seconds <= 0) {
            clearInterval(timerId);
        }
    }, 1000);
}

function delay(time){
    let newPromise=new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve("Cycle complete")
        },time)
    })
    return newPromise
}


stButton.addEventListener('click',()=>{
    statusContainer.textContent=""
    stButton.disabled=true
    changeColour("green")
    showTimer(6)
    delay(6000)
    .then((res)=>{
        changeColour("yellow")
        showTimer(2)
        return delay(2000)
    })  
    .then((res)=>{
        changeColour("red")
        showTimer(6)     
        return delay(6000)
    }).then(()=>{
        stButton.disabled=false
        statusContainer.textContent="Cycle Complete"
    })
})

