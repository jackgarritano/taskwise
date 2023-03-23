import { renderForm } from "./renderForm";
import { clearCal, renderCalendar } from "./calendar";
import {
    onlyPasteText, regPriorityButtonClicked, maxPriorityButtonClicked,
    observeTextFields, validateTimeInputs, getErrorMessage, formSubmission
} from "../controller/formHandler";
import grayPlusSvg from '../assets/plusLogo.svg';
import bluePlusSvg from '../assets/plusLogoBlue.svg';
import { renderEditor } from "./renderForm";
export { initForm, initEditForm, derenderForm, renderAddButton };

let formElements;
let highestUnavailable;

function initForm() {
    highestUnavailable = 0;

    document.querySelector('.addButton').remove();

    onlyPasteText();
    formElements = renderForm();


    let editorElements = renderEditor();  //temp


    let allTasks = document.querySelector('.allTasks');
    allTasks.prepend(formElements.addForm);

   document.querySelector('body').append(editorElements.addForm); //temp
   document.querySelector('.overlay').classList.add('dimScreen'); //temp


    formElements.taskName.focus();
    renderCalendar(formElements.dueDate);
    observeTextFields(checkIfAddAllowed);

    horizCenterPopups(formElements.errorMessage);
    hideErrorMessage();

    formElements.dueDate.addEventListener('click', (e) => {
        let calendarHolder = document.querySelector('.calendarHolder')
        if (e.target.classList.contains('dateCircle') || e.target.parentElement.classList.contains('dateCircle')) {
            calendarHolder.classList.add('hidden');
        }
        else if (calendarHolder.classList.contains('hidden')) {
            calendarHolder.classList.toggle('hidden');
            closePopupListener();
        }
    })

    formElements.estTime.addEventListener('click', () => {
        let estTime = document.querySelector('.timePickerHolder')
        if (estTime.classList.contains('hidden')) {
            estTime.classList.toggle('hidden');
            closePopupListener();
        }
    })

    formElements.priority.addEventListener('click', (e) => {
        let priorityPicker = document.querySelectorAll('.priorityPickerHolder')[0];
        if (regPriorityButtonClicked(e.target)) {
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
        let maxPriorityPicker = document.querySelectorAll('.priorityPickerHolder')[1];
        if (maxPriorityButtonClicked(e.target, highestUnavailable)) {
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

    formElements.addForm.addEventListener('submit', formSubmission);
} //end of init fn

function initEditForm(){
    onlyPasteText();
    formElements = renderEditor();

    document.querySelector('body').append(formElements.addForm);
    document.querySelector('.overlay').classList.add('dimScreen');

    formElements.taskName.focus();
    renderCalendar(formElements.dueDate);
    observeTextFields(checkIfAddAllowed);

    horizCenterPopups(formElements.errorMessage);
    hideErrorMessage();

    formElements.dueDate.addEventListener('click', (e) => {
        let calendarHolder = document.querySelector('.calendarHolder')
        if (e.target.classList.contains('dateCircle') || e.target.parentElement.classList.contains('dateCircle')) {
            calendarHolder.classList.add('hidden');
        }
        else if (calendarHolder.classList.contains('hidden')) {
            calendarHolder.classList.toggle('hidden');
            closePopupListener();
        }
    })

    formElements.estTime.addEventListener('click', () => {
        let estTime = document.querySelector('.timePickerHolder')
        if (estTime.classList.contains('hidden')) {
            estTime.classList.toggle('hidden');
            closePopupListener();
        }
    })

    formElements.priority.addEventListener('click', (e) => {
        let priorityPicker = document.querySelectorAll('.priorityPickerHolder')[0];
        if (regPriorityButtonClicked(e.target)) {
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
        let maxPriorityPicker = document.querySelectorAll('.priorityPickerHolder')[1];
        if (maxPriorityButtonClicked(e.target, highestUnavailable)) {
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

function hideErrorMessage() {
    formElements.errorMessage.style.top = `calc(100% - ${formElements.errorMessage.clientHeight}px)`;
}

function derenderForm() {
    document.removeEventListener('click', hideErrorMessage);
    document.querySelector('.addForm').remove();
    renderAddButton();
}

function derenderEditForm() {
    document.removeEventListener('click', hideErrorMessage);
    document.querySelector('.editForm').remove();
    document.querySelector('.overlay').classList.remove('dimScreen');
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
        showErrorMessage(getErrorMessage());
    }
}

function showErrorMessage(message) {
    formElements.errorMessage.textContent = message;
    horizCenterPopups(formElements.errorMessage);
    formElements.errorMessage.style.top = '100%';
}

function checkIfAddAllowed() {
    if (document.querySelector('input[name=taskName]').value != '' &&
        document.querySelector('input[name=priInput]').value != '' &&
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
    let popups = document.querySelectorAll('.popup');
    popups.forEach((item) => {
        if (!item.classList.contains('hidden')) {
            popup = item;
        }
    })
    let closePopup = function (e) {
        if (!popup.contains(e.target)) {
            popup.classList.add('hidden');
            removeClosePopupListener();
        }
    }
    let removeClosePopupListener = function () {
        document.removeEventListener('click', closePopup, true);
    }
    document.addEventListener('click', closePopup, true)
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