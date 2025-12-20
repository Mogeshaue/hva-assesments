const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const btn3 = document.getElementById('btn3');
const mesgContainer=document.getElementById("mesgContainer")

function delay(btn){
    let newPromise=new Promise((resolve) => {
        btn.addEventListener('click',()=>{
            resolve()
        })
    })
    return newPromise
}

    delay(btn1)
    .then(()=>{
        setTimeout(()=>{
        btn1.disabled=true
        btn2.disabled=false

        },1000)
        return delay(btn2)
    }).then(()=>{
            setTimeout(()=>{
                btn2.disabled=true
        btn3.disabled=false
            },1000)

        return delay(btn3)
    }).then(()=>{
        btn3.disabled=true
        mesgContainer.textContent="All steps completed! Thank you."

    })

