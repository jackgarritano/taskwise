import { renderForm } from "./renderForm";
import { clearCal, renderCalendar } from "./calendar";
import { onlyPasteText, regPriorityButtonClicked, maxPriorityButtonClicked,
    observeTextFields, validateTimeInputs, getErrorMessage, formSubmission} from "../controller/formHandler";
export {initForm, derenderForm, renderAddButton};

function initForm(){
let highestUnavailable = 0;

document.querySelector('.addButton').remove();

onlyPasteText();
let formElements = renderForm();
let allTasks = document.querySelector('.allTasks');
allTasks.prepend(formElements.addForm);
formElements.taskName.focus();
renderCalendar(formElements.dueDate);
observeTextFields(checkIfAddAllowed);
 

function horizCenterPopups(){
    for(let i=0; i<arguments.length; i++){
        arguments[i].style.left = `calc(50% - ${arguments[i].clientWidth}px / 2)`;
    }
}
horizCenterPopups(formElements.errorMessage);
hideErrorMessage();

formElements.dueDate.addEventListener('click', (e) => {
    let calendarHolder = document.querySelector('.calendarHolder')
    if(e.target.classList.contains('dateCircle') || e.target.parentElement.classList.contains('dateCircle')){
        calendarHolder.classList.add('hidden');
    }
    else if(calendarHolder.classList.contains('hidden')){
        calendarHolder.classList.toggle('hidden');
        closePopupListener();
    }
})

formElements.estTime.addEventListener('click', () => {
    let estTime = document.querySelector('.timePickerHolder')
    if(estTime.classList.contains('hidden')){
        estTime.classList.toggle('hidden');
        closePopupListener();
    }
})

function disableMaxPriority(maxDisabled){
    highestUnavailable = maxDisabled;
    let maxButtons = formElements.maxPriority.querySelectorAll('.priorityPicker');
    maxButtons.forEach((el)=>{
        if(el.dataset.number <= maxDisabled){
            el.classList.add('dimmed');
        }
        else{
            el.classList.remove('dimmed');
        }
    })

}

formElements.priority.addEventListener('click', (e) => {
    let priorityPicker = document.querySelectorAll('.priorityPickerHolder')[0];
    if(regPriorityButtonClicked(e.target)){
        disableMaxPriority(e.target.dataset.number - 1);
        checkIfAddAllowed();
        priorityPicker.classList.add('hidden');
    }
    else if(priorityPicker.classList.contains('hidden')){
        priorityPicker.classList.toggle('hidden');
        closePopupListener();
    }
})
formElements.maxPriority.addEventListener('click', (e) => {
    let maxPriorityPicker = document.querySelectorAll('.priorityPickerHolder')[1];
    if(maxPriorityButtonClicked(e.target, highestUnavailable)){
        maxPriorityPicker.classList.add('hidden');
    }
    else if(maxPriorityPicker.classList.contains('hidden')){
        maxPriorityPicker.classList.toggle('hidden');
        closePopupListener();
    }
})
formElements.estTime.querySelectorAll('.textInput').forEach((el)=>{
    el.addEventListener('focus', (e)=>{
        e.target.select();
})})

function closePopupListener(e){
    let popup;
    let popups = document.querySelectorAll('.popup');
    popups.forEach((item) => {
        if(!item.classList.contains('hidden')){
            popup = item;
        }
    })
    let closePopup = function(e){ 
        if (!popup.contains(e.target)) {
            popup.classList.add('hidden');
            removeClosePopupListener();
        }
    }
    let removeClosePopupListener = function(){
        document.removeEventListener('click', closePopup, true);
    }
    document.addEventListener('click', closePopup, true)
}

formElements.cancel.addEventListener('click', derenderForm);

function checkIfAddAllowed(){
    if(document.querySelector('input[name=taskName]').value != '' &&
     document.querySelector('input[name=priInput]').value != '' &&
     (formElements.dueDate.querySelector('input[name=dateInput]').value != '' ||
     formElements.maxPriority.querySelector('input[name=maxPriInput]').value == '')){
        formElements.addTask.classList.remove('dimmed');
    }
    else{
        formElements.addTask.classList.add('dimmed');
    }
}
function checkOnValueMutation(mutations){
    mutations.forEach((el)=>{
        if (el.type === 'attributes' && el.attributeName === 'value'){
            checkIfAddAllowed();
        }
    })
}

const valueObserver =  new MutationObserver(checkOnValueMutation);
valueObserver.observe(formElements.dueDate.querySelector('input[name=dateInput]'), {attributes: true});
valueObserver.observe(formElements.maxPriority.querySelector('input[name=maxPriInput]'), {attributes: true});

formElements.estTime.querySelectorAll('input').forEach((el)=>{
    validateTimeInputs(el);
})

function showErrorMessage(message){
    formElements.errorMessage.textContent = message;
    horizCenterPopups(formElements.errorMessage);
    formElements.errorMessage.style.top = '100%';
}

function hideErrorMessage(){
    formElements.errorMessage.style.top = `calc(100% - ${formElements.errorMessage.clientHeight}px)`;
}

function addTaskHoverErr(e){
    if(e.target.classList.contains('dimmed')){
        showErrorMessage(getErrorMessage());
    }
}

formElements.addTask.addEventListener('mouseover', addTaskHoverErr);

document.addEventListener('click', hideErrorMessage);

formElements.addForm.addEventListener('submit', formSubmission);
}

function derenderForm(){ //this needs to also render the addTask button in its place
    document.querySelector('.addForm').remove();
    renderAddButton();
}

function renderAddButton(){
    let addButton = document.createElement('div');
    let addLogo = document.createElement('img');
    let textSpan = document.createElement('span');

    addButton.classList.add('addButton');
    textSpan.textContent = 'Add task';
    addLogo.classList.add('addLogo');
    addLogo.setAttribute('src', 'assets/plusLogo.svg');

    addButton.append(addLogo);
    addButton.append(textSpan);
    document.querySelector('.allTasks').prepend(addButton);

    addButton.addEventListener('click', initForm);
}