import { renderCalendar } from "./calendar";
export {renderForm};

function renderForm(){
    let addTask = renderAddTask();
    let cancel = renderCancel();
    let maxPriority = renderMaxPriority();
    let priority = renderPriority();
    let dueDate = renderDueDate();
    let estTime = renderEstTime();
    let timePickerHolder = renderTimePicker();
    let description = renderDescription();
    let descriptionInput = renderDescriptionInput();
    let descriptionLabel = renderDescriptionLabel();
    let taskName = renderTaskName();
    let taskNameInput = renderTaskNameInput();
    let taskNameLabel = renderTaskNameLabel();

    let rightSideButtons = document.createElement('div');
    let options = document.createElement('div');
    let bottomButtons = document.createElement('div');
    let addForm = document.createElement('form');

    rightSideButtons.classList.add('rightSideButtons');
    options.classList.add('options');
    bottomButtons.classList.add('bottomButtons');
    addForm.classList.add('addForm');

    addForm.setAttribute('action', '');
    addForm.setAttribute('method', 'post');

    rightSideButtons.append(cancel);
    rightSideButtons.append(addTask);
    estTime.append(timePickerHolder);
    options.append(estTime);
    options.append(dueDate);
    options.append(priority);
    options.append(maxPriority);
    bottomButtons.append(options);
    bottomButtons.append(rightSideButtons);
    addForm.append(taskNameLabel);
    addForm.append(taskNameInput);
    addForm.append(taskName);
    addForm.append(descriptionLabel);
    addForm.append(descriptionInput);
    addForm.append(description);
    addForm.append(bottomButtons);

    return {
        addTask,
        cancel,
        maxPriority, 
        priority,
        dueDate,
        estTime,
        description,
        descriptionInput,
        descriptionLabel,
        taskName,
        taskNameInput,
        taskNameLabel,
        rightSideButtons,
        options,
        bottomButtons,
        addForm,
    }
}

function renderAddTask(){
    let addTask = document.createElement('div');
    let textSpan = document.createElement('span');

    addTask.classList.add('addTask', 'selectable');
    textSpan.textContent = 'Add';

    addTask.append(textSpan);

    return addTask;
}
function renderCancel(){
    let cancel = document.createElement('div');
    let textSpan = document.createElement('span');

    cancel.classList.add('cancel', 'selectable');
    textSpan.textContent = 'Cancel';

    cancel.append(textSpan);

    return cancel;
}
function renderMaxPriority(){
    let maxPriority = document.createElement('div');
    let priLogo = document.createElement('img');
    let maxPriChoice = document.createElement('div');
    let textSpan = document.createElement('span');

    maxPriority.classList.add('maxPriority', 'selectable');
    priLogo.classList.add('priLogo');
    priLogo.setAttribute('src', 'assets/priLogo.svg');
    maxPriChoice.classList.add('maxPriChoice');
    textSpan.textContent = 'Max. Priority';

    maxPriChoice.append(textSpan);
    maxPriority.append(priLogo);
    maxPriority.append(maxPriChoice);

    return maxPriority;
}
function renderPriority(){
    let priority = document.createElement('div');
    let priLogo = document.createElement('img');
    let priChoice = document.createElement('div');
    let textSpan = document.createElement('span');

    priority.classList.add('priority', 'selectable');
    priLogo.classList.add('priLogo');
    priLogo.setAttribute('src', 'assets/priLogo.svg');
    priChoice.classList.add('priChoice');
    textSpan.textContent = 'Priority';

    priChoice.append(textSpan);
    priority.append(priLogo);
    priority.append(priChoice);

    return priority;
}
function renderDueDate(){
    let dueDate = document.createElement('div');
    let calLogo = document.createElement('img');
    let dueDateChoice = document.createElement('div');
    let textSpan = document.createElement('span');

    dueDate.classList.add('dueDate', 'selectable');
    calLogo.classList.add('calLogo');
    calLogo.setAttribute('src', 'assets/calLogo.svg');
    dueDateChoice.classList.add('dueDateChoice');
    textSpan.textContent = 'Date';

    dueDateChoice.append(textSpan);
    dueDate.append(calLogo);
    dueDate.append(dueDateChoice);

    return dueDate;
}
function renderEstTime(){
    let estTime = document.createElement('div');
    let clockLogo = document.createElement('img');
    let estTimeChoice = document.createElement('div');
    let textSpan = document.createElement('span');

    estTime.classList.add('estTime', 'selectable');
    clockLogo.classList.add('clockLogo');
    clockLogo.setAttribute('src', 'assets/clockLogo.svg');
    estTimeChoice.classList.add('estTimeChoice');
    textSpan.textContent = 'Time';

    estTimeChoice.append(textSpan);
    estTime.append(clockLogo);
    estTime.append(estTimeChoice);

    return estTime;
}
function renderTimePicker(){
    let timePickerHolder = document.createElement('div');
    let minuteContainer = document.createElement('div');
    let hourContainer = document.createElement('div');
    let dayContainer = document.createElement('div');
    let minuteChooser = document.createElement('input');
    let hourChooser = document.createElement('input');
    let dayChooser = document.createElement('input');
    let minuteLabel = document.createElement('label');
    let hourLabel = document.createElement('label');
    let dayLabel = document.createElement('label');

    timePickerHolder.classList.add('timePickerHolder', 'popup', 'hidden');
    minuteContainer.classList.add('.minuteContainer');
    hourContainer.classList.add('hourContainer');
    dayContainer.classList.add('dayContainer');
    minuteChooser.classList.add('minuteChooser');
    hourChooser.classList.add('hourChooser');
    dayChooser.classList.add('dayChooser');

    minuteChooser.setAttribute('id', 'estMinutes');
    minuteChooser.setAttribute('type', 'text');
    hourChooser.setAttribute('id', 'estHours');
    hourChooser.setAttribute('type', 'text');
    dayChooser.setAttribute('id', 'estDays');
    dayChooser.setAttribute('type', 'text');
    minuteLabel.setAttribute('for', 'estMinutes');
    hourLabel.setAttribute('for', 'estHours');
    dayLabel.setAttribute('for', 'estDays');

    minuteLabel.textContent = 'Mins';
    hourLabel.textContent = 'Hours';
    dayLabel.textContent = 'Days';

    minuteContainer.append(minuteLabel);
    minuteContainer.append(minuteChooser);
    hourContainer.append(hourLabel);
    hourContainer.append(hourChooser);
    dayContainer.append(dayLabel);
    dayContainer.append(dayChooser);

    timePickerHolder.append(minuteContainer);
    timePickerHolder.append(hourContainer);
    timePickerHolder.append(dayContainer);

    return timePickerHolder;
}
function renderDescription(){
    let description = document.createElement('div');

    description.classList.add('description', 'textInput');
    description.setAttribute('placeholder', 'Description');
    description.setAttribute('contenteditable', 'true');

    return description;
}
function renderDescriptionInput(){
    let descriptionInput = document.createElement('input');

    descriptionInput.setAttribute('type', 'hidden');
    descriptionInput.setAttribute('id', 'taskDesc');
    descriptionInput.setAttribute('name', 'taskDesc');

    return descriptionInput;
}
function renderDescriptionLabel(){
    let descriptionLabel = document.createElement('label');

    descriptionLabel.setAttribute('for', 'taskDesc');
    descriptionLabel.setAttribute('style', 'display:none');
    descriptionLabel.textContent = 'Task Description';

    return descriptionLabel;
}
function renderTaskName(){
    let taskName = document.createElement('div');

    taskName.classList.add('title', 'textInput');
    taskName.setAttribute('placeholder', 'Task name');
    taskName.setAttribute('contenteditable', 'true');

    return taskName;
}
function renderTaskNameInput(){
    let taskNameInput = document.createElement('input');

    taskNameInput.setAttribute('type', 'hidden');
    taskNameInput.setAttribute('id', 'taskName');
    taskNameInput.setAttribute('name', 'taskName');

    return taskNameInput;
}
function renderTaskNameLabel(){
    let taskNameLabel = document.createElement('label');

    taskNameLabel.setAttribute('for', 'taskName');
    taskNameLabel.setAttribute('style', 'display:none');
    taskNameLabel.textContent = 'Title';

    return taskNameLabel;
}