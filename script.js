var i=0;
class NewTask{
    constructor(TaskId,TaskContent){
        this.TaskId=TaskId;
        this.TaskContent=TaskContent;
    }
}

class Interface{
    constructor(){}
    addNewTask(task){
        if(task.TaskContent!==""){
            document.querySelector("#elements").innerHTML+=`
                <div class="element" data-id=${task.TaskId}>
                    <span id="content">${task.TaskContent}</span>
                    <div id="button"><button class="btn btn-small btn-outline ok">ok</button></div>
                </div>
            `;
        }
        else{
            document.getElementById("errorfield").innerHTML=`
                <div id="error" class="alert alert-danger alert-dismissible fade show my-3">Lütfen bir görev giriniz.
                    <button type="button" class="close" data-dismiss="alert"><span>&times</span></button>
                </div>
            `
            setTimeout(()=>{
                document.querySelector("#error").remove();
            },2000)
        }
    }
    completeTask(x){
        const button=document.createElement("button");
        button.innerHTML="&times";
        button.classList.add("btn","btn-small","btn-outline-danger");
        button.setAttribute("title","close");
        button.classList.add("closebutton");
        x.parentNode.appendChild(button);
        $(x.parentNode.parentNode).css("background-color","red");
        $(x.parentNode.parentNode).css("text-decoration","line-through");
        x.remove();
    }
    removeTask(x){
       x.parentNode.parentNode.remove();
    }
    removeAllTasks(){
        const elements=document.getElementById("elements");
        elements.innerHTML="";
    }
    static setCounterValue(){
        const tasks=Storage.getTasks();
        i=tasks[tasks.length-1].TaskId+1;
    }
}

class Storage{
    constructor(){}
    static getTasks(){
        let tasks;
        if(localStorage.getItem("tasks")===null){
            tasks=[];
        }
        else{
            tasks=JSON.parse(localStorage.getItem("tasks"));
        }
        return tasks;
    }
    static addTasks(newTask){
            const tasks=this.getTasks();
            tasks.push(newTask);
            localStorage.setItem("tasks",JSON.stringify(tasks));
    }
    static displayTasks(){
        const tasks=this.getTasks();
        tasks.forEach(task=>{
            document.querySelector("#elements").innerHTML+=`
                <div class="element" data-id=${task.TaskId}>
                    <span id="content">${task.TaskContent}</span>
                    <div id="button"><button class="btn btn-small btn-outline ok">ok</button></div>
                </div>
            `;
            Interface.setCounterValue();
        });
    }
    static deleteTask(x){
        const tasks=this.getTasks();
        
        for(let i=0;i<tasks.length;i++){
            if(tasks[i].TaskId==x.parentNode.parentNode.getAttribute("data-id")){
                tasks.splice(i,1);
            }
        }
        localStorage.setItem("tasks",JSON.stringify(tasks));
        Interface.setCounterValue();
    }
    static deleteAllTasks(){
        const tasks=this.getTasks();

        if(tasks!==[]){
            localStorage.removeItem("tasks");
        }
    }
}

var button=document.getElementById("add");
var text=document.getElementById("text");

button.addEventListener("click",()=>{
    const task=new NewTask(i,text.value);
    i++;
    const ui=new Interface();
    ui.addNewTask(task);
    Storage.addTasks(task);
    executebuttons();
    displayDeleteAllButton();
});

text.addEventListener("keydown",(e)=>{
    if(e.key==='Enter'){
        const task=new NewTask(i,text.value);
    i++;
    const ui=new Interface();
    ui.addNewTask(task);
    Storage.addTasks(task);
    executebuttons();
    displayDeleteAllButton();
    }
})

let executebuttons=()=>{
    okbuttons=document.querySelectorAll(".ok");
    if(okbuttons!==null){
    okbuttons.forEach(button=>{
        button.addEventListener("click",(e)=>{
            const ui=new Interface();
            ui.completeTask(e.target);
            var closebuttons=document.querySelectorAll(".closebutton");
            closebuttons.forEach(button=>{
                button.addEventListener("click",(e)=>{
                    const ui=new Interface();
                    ui.removeTask(e.target);
                    Storage.deleteTask(e.target);
                });
            });
        });
    });
    }
}

document.getElementById("DeleteAllButton").addEventListener("click",()=>{
    Storage.deleteAllTasks();
    const ui=new Interface();
    ui.removeAllTasks();
    $("#DeleteAll").css("display","none");
    i=0;
})

let displayDeleteAllButton=()=>{
    if(document.getElementById("elements").innerHTML==""){
        $("#DeleteAll").css("display","none");
    }
    else{
        $("#DeleteAll").css("display","block");
    }
}

document.addEventListener("DOMContentLoaded",Storage.displayTasks());
document.addEventListener("DOMContentLoaded",executebuttons());
document.addEventListener("DOMContentLoaded",displayDeleteAllButton());
