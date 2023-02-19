export {renderTask};

function renderTask(){

}

function renderEstTime(timeEst){
    let estTime = document.createElement('div');
    let clockLogo = document.createElement('img');
    let timeSpan = document.createElement('span');

    estTime.classList.add('taskEstTime');
    clockLogo.classList.add('clockLogo');
    clockLogo.setAttribute('src', 'assets/clockLogo.svg');

    timeSpan.textContent = timeEst;

    estTime.append(timeSpan);
    estTime.append(clockLogo);
    
    return estTime;
}

function renderDueDate(dateDue){
    let dueDate = document.createElement('div');
    let calLogo = document.createElement('img');
    let dateSpan = document.createElement('span');

    dueDate.classList.add('taskDueDate');
    calLogo.classList.add('calLogo');
    calLogo.setAttribute('src', 'assets/calLogo.svg');

    dateSpan.textContent = dueDate;

    dueDate.append(calLogo);
    dueDate.append(dateSpan);

    return dueDate;
}

function renderPriBar(priority, maxPriority){
    let taskPri = document.createElement('div');
    let priBar = document.createElement('div');
    let priLogo = document.createElement('img');
    let priSpan = document.createElement('span');
    let priCubes = [];
    for(let i=1; i<=maxPriority; i++){
        let cube = document.createElement('div');
        cube.classList.add('priCube');
        if(i<=priority){
            cube.classList.add('filled');
        }
        else{
            cube.classList.add('empty');
        }
        cube.dataset.number = i;
        priCubes.push(cube);
    }

    taskPri.classList.add('taskPri');
    priBar.classList.add('priBar');
    priLogo.classList.add('priLogo');
    priLogo.setAttribute('src', 'assets/priLogo.svg');

    priSpan.textContent = priority;

    priCubes.forEach((el)=>{
        priBar.append(el);
    })
    taskPri.append(priBar);
    taskPri.append(priLogo);
    taskPri.append(priSpan);

    return taskPri;
}

function renderDescription(description){
    let taskDescription = document.createElement('div');
    let descSpan = document.createElement('span');

    taskDesc.classList.add('taskDescription');
    descSpan.textContent = description;

    taskDesc.append(descSpan);

    return taskDesc;
}

function renderTitle(title){
    let taskTitle = document.createElement('div');
    let titleSpan = document.createElement('span');

    taskTitle.classList.add('taskTitle');
    titleSpan.textContent = title;

    taskTitle.append(titleSpan);

    return taskTitle;
}

function renderCheckCircle(){
    let checkCircle = document.createElement('div');

    checkCircle.classList.add('checkCircle');

    return checkCircle;
}