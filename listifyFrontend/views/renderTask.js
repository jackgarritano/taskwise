export {renderTask};

function renderTask(taskObj){
    let estTime = renderEstTime('1 hr');
    let dueDate = renderDueDate('March 18');
    let priBar = renderPriBar(3, 8);
    let description = renderDescription('this is an example task');
    let title = renderTitle('Example task');
    let checkCircle = renderCheckCircle();

    let task = document.createElement('div');
    //let visibleTask = document.createElement('div');
    let checkContainer = document.createElement('div');
    let infoContainer = document.createElement('div');
    let topRow = document.createElement('div');
    let nextRow = document.createElement('div');
    let bottomRow = document.createElement('div');
    //let moveIcon = document.createElement('div');

    task.classList.add('task');
    //visibleTask.classList.add('visibleTask');
    checkContainer.classList.add('checkContainer');
    infoContainer.classList.add('infoContainer');
    topRow.classList.add('row', 'topRow');

    if(description.textContent == ''){
        nextRow.classList.add('row', 'bottomRow');
        nextRow.append(dueDate);
        nextRow.append(estTime);
        bottomRow = null;
    }
    else{
        nextRow.classList.add('row', 'middleRow');
        bottomRow.classList.add('row', 'bottomRow');

        bottomRow.append(dueDate);
        bottomRow.append(estTime);
        nextRow.append(description);
        nextRow.append(priBar);
    }
    topRow.append(title);
    infoContainer.append(topRow);
    infoContainer.append(nextRow);
    if(bottomRow){
        infoContainer.append(bottomRow);
    }
    checkContainer.append(checkCircle);
    task.append(checkContainer);
    task.append(infoContainer);
    //task.append(moveIcon);
    //task.append(visibleTask);
    
    document.querySelector('.allTasks').append(task);
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

    dateSpan.textContent = dateDue;

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

    taskDescription.classList.add('taskDescription');
    descSpan.textContent = description;

    taskDescription.append(descSpan);

    return taskDescription;
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