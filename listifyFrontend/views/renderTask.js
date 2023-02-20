export {renderTask};
//make date a better format
//make time a better format
function renderTask(taskObj){
    let {name, desc, due, priority, maxPriority, estimatedTime, switchTimes} = taskObj;
    let numLines = 0;
    name = cutOffStrings(name);
    desc = cutOffStrings(desc);
    date = formatDate(date);
    let estTime = renderEstTime(estimatedTime);
    let dueDate = renderDueDate(due);
    let priBar = renderPriBar(priority, maxPriority);
    let description = renderDescription(desc);
    let title = renderTitle(name);
    let checkCircle = renderCheckCircle();


    let task = document.createElement('div');
    let checkContainer = document.createElement('div');
    let infoContainer = document.createElement('div');
    let topRow = document.createElement('div');
    let nextRow = document.createElement('div');
    let bottomRow = document.createElement('div');

    task.classList.add('task');
    checkContainer.classList.add('checkContainer');
    infoContainer.classList.add('infoContainer');
    topRow.classList.add('row', 'topRow');

    console.log('dueDate: ' + dueDate.textContent);
    console.log('description: ' + description.textContent);
    console.log('estTime: ' + estTime.textContent);
        if(description.textContent != '' && dueDate.textContent != ''){
        numLines = 3;
        console.log('assigned to 3');
    }
    else if(dueDate.textContent == '' && description.textContent == '' && estTime.textContent == ''){
        numLines = 1;
        console.log('assigned to 1');
    }
    else{
        console.log('assigned to 2');
        numLines = 2;
    }

    if(numLines == 1){
        console.log(numLines);
        topRow.classList.add('row', 'topRow', 'bottomRow');
        topRow.append(title);
        topRow.append(priBar);

        infoContainer.append(topRow);
    }
    else if(numLines == 2){
        console.log(numLines);
        topRow.classList.add('row', 'topRow');
        nextRow.classList.add('row', 'bottomRow');
        bottomRow = null;

        topRow.append(title);
        topRow.append(priBar);
        if(dueDate.textContent != ''){
            nextRow.append(dueDate);
        }
        if(description.textContent != ''){
            nextRow.append(description);
        }
        if(estTime.textContent != ''){
            nextRow.append(estTime);
        }

        infoContainer.append(topRow);
        infoContainer.append(nextRow);
    }
    else{
        console.log(numLines);
        topRow.classList.add('row', 'topRow');
        nextRow.classList.add('row', 'middleRow');
        bottomRow.classList.add('row', 'bottomRow');

        topRow.append(title);
        nextRow.append(description);
        nextRow.append(priBar);
        if(dueDate.textContent != ''){
            bottomRow.append(dueDate);
        }
        if(estTime.textContent != ''){
            bottomRow.append(estTime);
        }

        infoContainer.append(topRow);
        infoContainer.append(nextRow);
        infoContainer.append(bottomRow);
    }
    checkContainer.append(checkCircle);
    task.append(checkContainer);
    task.append(infoContainer);
    
    document.querySelector('.allTasks').append(task);
}

function formatDate(date){
    if(date == ''){
        return date;
    }
    let year = new Date().getFullYear();
    let dateParts = due.split('/');
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
    due = months[parseInt(dateParts[0]) - 1] + ' ' +  dateParts[1];
    if(dateParts[2] != year){
        due += " '" + dateParts[2].substring(2,4);
    }
    return date;
}

function cutOffStrings(str){
    if(str.length > 40){
        str = str.substring(0,40) + '...';
    }
    return str;
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
    calLogo.classList.add('calLogo', 'calLogoTask');
    calLogo.setAttribute('src', 'assets/calLogo.svg');

    dateSpan.textContent = dateDue;

    dueDate.append(calLogo);
    dueDate.append(dateSpan);

    return dueDate;
}

function renderPriBar(priority, maxPriority){
    let taskPri = document.createElement('div');
    let priLogo = document.createElement('img');
    let priSpan = document.createElement('span');

    

    taskPri.classList.add('taskPri');
    priLogo.classList.add('priLogo');
    priLogo.setAttribute('src', 'assets/priLogo.svg');

    priSpan.textContent = priority;
    if(maxPriority != ''){
        let priBar = document.createElement('div');
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
            priBar.append(cube);
        }
        priBar.classList.add('priBar');
        taskPri.append(priBar);
    }
    taskPri.append(priSpan);
    taskPri.append(priLogo);
    
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