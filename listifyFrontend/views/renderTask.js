import { addInteractvity } from "../controller/taskHandler";
import { setTimers } from "../controller/switchHandler";
import clockLogoSvg from '../assets/clockLogo.svg';
import priLogoSvg from '../assets/priLogo.svg';
import calLogoSvg from '../assets/calLogo.svg';
import realPlusLogoSvg from '../assets/realPlusLogo.svg';
export {renderTask, formatDate, formatTimeForForm, calculateCurrentPriority};
function renderTask(taskObj, index){
    let {name, desc, due, priority, maxPriority, estimatedTime, switchTimes} = taskObj;
    let numLines = 0;
    name = cutOffStrings(name);
    desc = cutOffStrings(desc);
    due = formatDate(due);
    estimatedTime = formatTime(estimatedTime);
    let estTime = renderEstTime(estimatedTime);
    let dueDate = renderDueDate(due);
    let priBar = renderPriBar(priority, maxPriority, switchTimes);
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

    if(description.textContent != '' && dueDate.textContent != ''){
        numLines = 3;     
    }
    else if(dueDate.textContent == '' && description.textContent == '' && estTime.textContent == ''){
        numLines = 1;
    }
    else{
        numLines = 2;
    }

    if(numLines == 1){
        topRow.classList.add('row', 'topRow', 'bottomRow');
        topRow.append(title);
        topRow.append(priBar);

        infoContainer.append(topRow);
    }
    else if(numLines == 2){
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
    
    Array.from(document.querySelector('.allTasks').children)[index].insertAdjacentElement('afterend', task);

    let taskNode = {
        estTime,
        dueDate,
        priBar,
        description,
        title,
        checkCircle,
        task,
        checkContainer,
        infoContainer,
        topRow,
        nextRow,
        bottomRow,
    }
    addInteractvity(taskNode);
}

function formatTime(ms){
    let timeStr = '';
    if(ms == ''){
        return timeStr;
    }
    else if(ms >= 86400000){
        let days = Math.floor(ms / 86400000);
        let hrs = ms % 86400000;
        hrs = Math.round(hrs / 3600000);
        return formatDays(days) + ', ' + formatHours(hrs);
    }
    else if(ms >= 3600000){
        let hrs = Math.round((ms * 10)/3600000) / 10;
        return formatHours(hrs);
    }
    else{
        let mins = Math.ceil(ms / 60000);
        return formatMinutes(mins);
    }
}

function formatTimeForForm(ms){
    let timeStr = '';
    if(ms == ''){
        return timeStr;
    }
    else if(ms >= 86400000){
        let days = Math.floor(ms / 86400000);
        return formatDays(days);
    }
    else if(ms >= 3600000){
        let hrs = Math.round((ms * 10)/3600000) / 10;
        return formatHours(hrs);
    }
    else{
        let mins = Math.ceil(ms / 60000);
        return formatMinutes(mins);
    }
}

function formatMinutes(mins){
    if(mins > 1){
        return mins + ' mins';
    }
    else{
        return mins + ' min';
    }
}

function formatHours(hrs){
    if(hrs > 1){
        return hrs + ' hrs';
    }
    else{
        return hrs + ' hr';
    }
}

function formatDays(days){
    if(days > 1){
        return days + ' days';
    }
    else{
        return days + ' day';
    }
}

function formatDate(d){
    if(d == ''){
        return d;
    }
    let year = new Date().getFullYear();
    let dateParts = d.split('/');
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
    d = months[parseInt(dateParts[0]) - 1] + ' ' +  dateParts[1];
    if(dateParts[2] != year){
        d += " '" + dateParts[2].substring(2,4);
    }
    return d;
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
    clockLogo.classList.add('clockLogo', 'clockLogoTask');
    clockLogo.setAttribute('src', clockLogoSvg);

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
    calLogo.setAttribute('src', calLogoSvg);

    dateSpan.textContent = dateDue;

    dueDate.append(calLogo);
    dueDate.append(dateSpan);

    return dueDate;
}

function renderPriBar(priority, maxPriority, switchTimes){
    let taskPri = document.createElement('div');
    let priLogo = document.createElement('img');
    let priSpan = document.createElement('span');

    taskPri.classList.add('taskPri');
    priLogo.classList.add('priLogo', 'priLogoTask');
    priLogo.setAttribute('src', priLogoSvg);

    priority = calculateCurrentPriority(priority, switchTimes);

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

function calculateCurrentPriority(priority, switchTimes){
    let now = new Date();
    if(switchTimes){
        for(let i=0; i<switchTimes.length; i++){
            let switchDate = new Date(switchTimes[i]);
            if(switchDate < now){
                priority ++;
            }
            else{
                setTimers(now, switchDate);
                break;
            }
        }
    }
    return priority;
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
    let xLogo = document.createElement('img');

    checkCircle.classList.add('checkCircle');
    xLogo.classList.add('xLogo');
    xLogo.setAttribute('src', realPlusLogoSvg);

    checkCircle.append(xLogo);

    return checkCircle;
}