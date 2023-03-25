import { renderForm } from "./renderForm";
import { clearCal, renderCalendar } from "./calendar";
import {
    onlyPasteText, regPriorityButtonClicked, maxPriorityButtonClicked,
    observeTextFields, validateTimeInputs, getErrorMessage, formSubmission
} from "../controller/formHandler";
import grayPlusSvg from '../assets/plusLogo.svg';
import bluePlusSvg from '../assets/plusLogoBlue.svg';
import { renderEditor } from "./renderForm";
import { formatTimeForForm, calculateCurrentPriority } from "./renderTask";
import { getCheckIndex } from "../controller/taskHandler";
import { getTask } from "../controller/taskList";
import { formatDate } from "./renderTask";
export { initForm, initEditForm, derenderForm, renderAddButton };

let formElements;
let inactiveFormElements;
let highestUnavailable;

function initForm() {
    highestUnavailable = 0;

    document.querySelector('.addButton').remove();

    onlyPasteText();
    formElements = renderForm();
    inactiveFormElements = formElements;

    let allTasks = document.querySelector('.allTasks');
    allTasks.prepend(formElements.addForm);

    formElements.taskName.focus();
    renderCalendar(formElements.dueDate, formElements.addForm);
    observeTextFields(checkIfAddAllowed, formElements.addForm);

    horizCenterPopups(formElements.errorMessage);
    hideErrorMessage();

    formElements.dueDate.addEventListener('click', (e) => {
        let calendarHolder = formElements.addForm.querySelector('.calendarHolder')
        if (e.target.classList.contains('dateCircle') || e.target.parentElement.classList.contains('dateCircle')) {
            calendarHolder.classList.add('hidden');
        }
        else if (calendarHolder.classList.contains('hidden')) {
            calendarHolder.classList.toggle('hidden');
            closePopupListener();
        }
    })

    formElements.estTime.addEventListener('click', () => {
        let estTime = formElements.addForm.querySelector('.timePickerHolder')
        if (estTime.classList.contains('hidden')) {
            estTime.classList.toggle('hidden');
            closePopupListener();
        }
    })

    formElements.priority.addEventListener('click', (e) => {
        let priorityPicker = formElements.addForm.querySelectorAll('.priorityPickerHolder')[0];
        if (regPriorityButtonClicked(e.target, formElements.addForm)) {
            disableMaxPriority(e.target.dataset.number - 1);
            checkIfAddAllowed();
            priorityPicker.classList.add('hidden');
        }
        else if (priorityPicker.classList.contains('hidden')) {
            priorityPicker.classList.toggle('hidden');
            closePopupListener();
        }
    })
    formElements.maxPriority.addEventListener('click', (e) => {
        let maxPriorityPicker = formElements.addForm.querySelectorAll('.priorityPickerHolder')[1];
        if (maxPriorityButtonClicked(e.target, highestUnavailable, formElements.addForm)) {
            maxPriorityPicker.classList.add('hidden');
        }
        else if (maxPriorityPicker.classList.contains('hidden')) {
            maxPriorityPicker.classList.toggle('hidden');
            closePopupListener();
        }
    })
    formElements.estTime.querySelectorAll('.textInput').forEach((el) => {
        el.addEventListener('focus', (e) => {
            e.target.select();
        })
    })

    formElements.cancel.addEventListener('click', derenderForm);

    const valueObserver = new MutationObserver(checkOnValueMutation);
    valueObserver.observe(formElements.dueDate.querySelector('input[name=dateInput]'), { attributes: true });
    valueObserver.observe(formElements.maxPriority.querySelector('input[name=maxPriInput]'), { attributes: true });

    formElements.estTime.querySelectorAll('input').forEach((el) => {
        validateTimeInputs(el);
    })

    formElements.addTask.addEventListener('mouseover', addTaskHoverErr);

    document.addEventListener('click', hideErrorMessage);

    formElements.addForm.addEventListener('submit', (e) => {
        formSubmission(e, formElements.addForm);
        });
} //end of init fn

function initEditForm(e){
    onlyPasteText();
    formElements = renderEditor();
    populateData(e.target, formElements);

    document.querySelector('body').append(formElements.addForm);
    document.querySelector('.overlay').classList.add('dimScreen');

    renderCalendar(formElements.dueDate, formElements.addForm);
    observeTextFields(checkIfAddAllowed, formElements.addForm);

    horizCenterPopups(formElements.errorMessage);
    hideErrorMessage();

    formElements.dueDate.addEventListener('click', (e) => {
        let calendarHolder = formElements.addForm.querySelector('.calendarHolder')
        if (e.target.classList.contains('dateCircle') || e.target.parentElement.classList.contains('dateCircle')) {
            calendarHolder.classList.add('hidden');
        }
        else if (calendarHolder.classList.contains('hidden')) {
            calendarHolder.classList.toggle('hidden');
            closePopupListener();
        }
    })

    formElements.estTime.addEventListener('click', () => {
        let estTime = formElements.addForm.querySelector('.timePickerHolder')
        if (estTime.classList.contains('hidden')) {
            estTime.classList.toggle('hidden');
            closePopupListener();
        }
    })

    formElements.priority.addEventListener('click', (e) => {
        let priorityPicker = formElements.addForm.querySelectorAll('.priorityPickerHolder')[0];
        if (regPriorityButtonClicked(e.target, formElements.addForm)) {
            disableMaxPriority(e.target.dataset.number - 1);
            checkIfAddAllowed();
            priorityPicker.classList.add('hidden');
        }
        else if (priorityPicker.classList.contains('hidden')) {
            priorityPicker.classList.toggle('hidden');
            closePopupListener();
        }
    })
    formElements.maxPriority.addEventListener('click', (e) => {
        let maxPriorityPicker = formElements.addForm.querySelectorAll('.priorityPickerHolder')[1];
        if (maxPriorityButtonClicked(e.target, highestUnavailable, formElements.addForm)) {
            maxPriorityPicker.classList.add('hidden');
        }
        else if (maxPriorityPicker.classList.contains('hidden')) {
            maxPriorityPicker.classList.toggle('hidden');
            closePopupListener();
        }
    })
    formElements.estTime.querySelectorAll('.textInput').forEach((el) => {
        el.addEventListener('focus', (e) => {
            e.target.select();
        })
    })

    formElements.cancel.addEventListener('click', derenderEditForm);

    const valueObserver = new MutationObserver(checkOnValueMutation);
    valueObserver.observe(formElements.dueDate.querySelector('input[name=dateInput]'), { attributes: true });
    valueObserver.observe(formElements.maxPriority.querySelector('input[name=maxPriInput]'), { attributes: true });

    formElements.estTime.querySelectorAll('input').forEach((el) => {
        validateTimeInputs(el);
    })

    formElements.addTask.addEventListener('mouseover', addTaskHoverErr);

    document.addEventListener('click', hideErrorMessage);

    formElements.addForm.addEventListener('submit', formSubmission);
}

function populateData(target, formNode){
    let taskIndex = getCheckIndex(target);
    let clickedTask = getTask(taskIndex);

    formNode.addForm.querySelector('.title').textContent = clickedTask.name;
    formNode.addForm.querySelector('input[name=taskName]').value = clickedTask.name;

    formNode.addForm.querySelector('.description').textContent = clickedTask.desc;
    formNode.addForm.querySelector('input[name=taskDesc]').value = clickedTask.desc;

    let times =  msToTime(clickedTask.estimatedTime);
    if(clickedTask.estimatedTime){
        formNode.addForm.querySelector('input[name=estMinutes]').value = times[0];
        formNode.addForm.querySelector('input[name=estHours]').value = times[1];
        formNode.addForm.querySelector('input[name=estDays]').value = times[2];
        formNode.addForm.querySelector('.estTimeChoice > span').textContent = formatTimeForForm(clickedTask.estimatedTime);
    }
    
    if(clickedTask.due){
        formNode.addForm.querySelector('input[name=dateInput]').value = clickedTask.due;
        formNode.addForm.querySelector('.dueDateChoice > span').textContent = formatDate(clickedTask.due);
    }

    if(clickedTask.priority){
        let currentPri = calculateCurrentPriority(clickedTask.priority, clickedTask.switchTimes);
        formNode.addForm.querySelector('.priChoice > span').textContent = currentPri;
        formNode.addForm.querySelector('input[name=priInput]').value = currentPri;
    }

    if(clickedTask.maxPriority){
        formNode.addForm.querySelector('.maxPriChoice > span').textContent = clickedTask.maxPriority;
        formNode.addForm.querySelector('input[name=maxPriInput]').value = clickedTask.maxPriority;
    }
}

function msToTime(ms){
    let days = Math.floor(ms / 86400000);
    let leftover = ms % 86400000;
    let hours = Math.floor(leftover / 3600000);
    leftover = leftover % 3600000;
    let mins = Math.floor(leftover / 60000);

    return [mins, hours, days];
}

function hideErrorMessage() {
    formElements.errorMessage.style.top = `calc(100% - ${formElements.errorMessage.clientHeight}px)`;
}

function derenderForm() {
    document.removeEventListener('click', hideErrorMessage);
    document.querySelector('.addForm').remove();
    inactiveFormElements = null;
    formElements = null;
    renderAddButton();
}

function derenderEditForm() {
    document.removeEventListener('click', hideErrorMessage);
    document.querySelector('.editForm').remove();
    document.querySelector('.overlay').classList.remove('dimScreen');
    if(inactiveFormElements){
        formElements = inactiveFormElements;
    }
}

function renderAddButton() {
    let addButton = document.createElement('div');
    let addLogo = document.createElement('img');
    let textSpan = document.createElement('span');

    addButton.classList.add('addButton');
    textSpan.textContent = 'Add task';
    addLogo.classList.add('addLogo');
    addLogo.setAttribute('src', grayPlusSvg);

    addButton.append(addLogo);
    addButton.append(textSpan);
    document.querySelector('.allTasks').prepend(addButton);

    addButton.addEventListener('click', initForm);
    addButton.addEventListener('mouseover', () => {
        document.querySelector('.addLogo').setAttribute('src', bluePlusSvg);
    })
    addButton.addEventListener('mouseout', () => {
        document.querySelector('.addLogo').setAttribute('src', grayPlusSvg);
    })
}

function addTaskHoverErr(e) {
    if (e.target.classList.contains('dimmed')) {
        showErrorMessage(getErrorMessage(formElements.addForm));
    }
}

function showErrorMessage(message) {
    formElements.errorMessage.textContent = message;
    horizCenterPopups(formElements.errorMessage);
    formElements.errorMessage.style.top = '100%';
}

function checkIfAddAllowed() {
    if (formElements.addForm.querySelector('input[name=taskName]').value != '' &&
        formElements.addForm.querySelector('input[name=priInput]').value != '' &&
        (formElements.dueDate.querySelector('input[name=dateInput]').value != '' ||
            formElements.maxPriority.querySelector('input[name=maxPriInput]').value == '')) {
        formElements.addTask.classList.remove('dimmed');
    }
    else {
        formElements.addTask.classList.add('dimmed');
    }
}
function checkOnValueMutation(mutations) {
    mutations.forEach((el) => {
        if (el.type === 'attributes' && el.attributeName === 'value') {
            checkIfAddAllowed();
        }
    })
}

function closePopupListener(e) {
    let popup;
    let popups = formElements.addForm.querySelectorAll('.popup');
    popups.forEach((item) => {
        if (!item.classList.contains('hidden')) {
            popup = item;
        }
    })
    let closePopup = function (e) {
        if (!popup.contains(e.target)) {
            popup.classList.add('hidden');
            if(popup.classList.contains('timePickerHolder')){
                showSelectedTime();
            }
            removeClosePopupListener();
        }
    }
    let removeClosePopupListener = function () {
        document.removeEventListener('click', closePopup, true);
    }
    document.addEventListener('click', closePopup, true)
}

function showSelectedTime(){
    let estimatedMins = parseInt(formElements.addForm.querySelector('input[name=estMinutes').value);
    let estimatedHours = parseInt(formElements.addForm.querySelector('input[name=estHours').value);
    let estimatedDays = parseInt(formElements.addForm.querySelector('input[name=estDays').value);
    let estimatedMs = (60000 * estimatedMins) + (3600000 * estimatedHours) + (86400000 * estimatedDays);
    if(estimatedMs != 0){   
        formElements.addForm.querySelector('.estTimeChoice > span').textContent = formatTimeForForm(estimatedMs);
    }
}

function disableMaxPriority(maxDisabled) {
    highestUnavailable = maxDisabled;
    let maxButtons = formElements.maxPriority.querySelectorAll('.priorityPicker');
    maxButtons.forEach((el) => {
        if (el.dataset.number <= maxDisabled) {
            el.classList.add('dimmed');
        }
        else {
            el.classList.remove('dimmed');
        }
    })
}

function horizCenterPopups() {
    for (let i = 0; i < arguments.length; i++) {
        arguments[i].style.left = `calc(50% - ${arguments[i].clientWidth}px / 2)`;
    }
}