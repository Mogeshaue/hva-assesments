let taskInput=document.getElementById("taskInput");
let addTaskButton=document.getElementById("addTask");
let taskList=document.getElementById("taskList");
let filterSelect=document.getElementById("filterSelect");
let sortPriority=document.getElementById("sortPriority");
let prioritySelect=document.getElementById("prioritySelect");

function getPriotity(currPriority){
        let priority=0
        if(currPriority=="high"){
            priority=3;
        } else if(currPriority=="medium"){
            priority=2;
        }   else {  priority=1;  }
    return priority;
}


addTaskButton.addEventListener("click",function(){
    let taskText=taskInput.value;
    if(taskText!=""){
        let taskItem=document.createElement("p");
        let deleteButton=document.createElement("button");
        let statusButton=document.createElement("button");
        let priorityButton=document.createElement("button");
        let currPriority=prioritySelect.value;
        priorityButton.innerText=`${currPriority}`;
        priority=getPriotity(currPriority)
        priorityButton.setAttribute("taskPriority",priority);
        deleteButton.innerText="Delete";
        statusButton.innerHTML=`Pending`;
        statusButton.setAttribute("taskStatus","pending");
        statusButton.addEventListener("click",function(){
            if(statusButton.getAttribute("taskStatus")=="pending"){
                statusButton.setAttribute("taskStatus","completed");
                statusButton.innerHTML=`Completed`;
            } else {
                statusButton.setAttribute("taskStatus","pending");
                statusButton.innerHTML=`Pending`;
            }
        });
        taskItem.innerText=taskText+" ";
        taskItem.appendChild(priorityButton);
        taskItem.appendChild(statusButton);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);

        taskInput.value="";
        deleteButton.addEventListener('click',function(){
            taskList.removeChild(taskItem)
        });
    }else{
        taskInput.nextElementSibling.innerText="Please enter a task Name.";
    }
 }
)
filterSelect.addEventListener("change",function(){
    let filterValue=filterSelect.value;
    let tasksElements=taskList.getElementsByTagName("p");
    if(filterValue=="all"){
        for(let i=0;i<tasksElements.length;i++){
            tasksElements[i].style.display="block";
        }
    }else if(filterValue=="completed"){
        for(let i=0;i<tasksElements.length;i++){
            if(tasksElements[i].getElementsByTagName("button")[1].getAttribute("taskStatus")=="completed"){
                tasksElements[i].style.display="block";
            }else{
                tasksElements[i].style.display="none";
            }
        }
    }else if(filterValue=="pending"){
        for(let i=0;i<tasksElements.length;i++){
            if(tasksElements[i].getElementsByTagName("button")[1].getAttribute("taskStatus")=="pending"){
                tasksElements[i].style.display="block";
            }else{
                tasksElements[i].style.display="none";
            }
        }
    }
})
let sortPriorityBtn = document.getElementById("sortPriority");
sortPriorityBtn.addEventListener("click", function () {
    let sortOrder = sortPriorityBtn.getAttribute("value"); // 1 = asc, 0 = desc
    let tasks = Array.from(taskList.getElementsByTagName("p"));
    tasks.sort(function (a, b) {
        let p1 = Number(a.getElementsByTagName("button")[0].getAttribute("taskPriority"));
        let p2 = Number(b.getElementsByTagName("button")[0].getAttribute("taskPriority"));

        return sortOrder === "1" ? p1 - p2 : p2 - p1;
    });
    console.log(tasks);
    tasks.forEach(task => taskList.appendChild(task));
    sortPriorityBtn.setAttribute("value", sortOrder === "1" ? "0" : "1");
});