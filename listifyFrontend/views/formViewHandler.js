import { renderForm } from "./renderForm";
import { clearCal, renderCalendar } from "./calendar";
import { onlyPasteText } from "../controller/formHandler";
export {initForm};

function initForm(){
let highestUnavailable = 0;
let errIsVisible = false;

onlyPasteText();
let formElements = renderForm();
let allTasks = document.querySelector('.allTasks');
allTasks.append(formElements.addForm);
formElements.taskName.focus();
renderCalendar(formElements.dueDate);
 

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
    if(e.target.classList.contains('regPriorityButton')){
        formElements.priority.querySelector('input').setAttribute('value', e.target.dataset.number);
        disableMaxPriority(e.target.dataset.number - 1);
        if(document.querySelector('input[name="maxPriInput"]').value != '' &&
        e.target.dataset.number > document.querySelector('input[name="maxPriInput"]').value){
            document.querySelector('input[name="maxPriInput"]').value = e.target.dataset.number;
        }
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
    if(e.target.classList.contains('maxPriorityButton') && e.target.dataset.number > highestUnavailable){
        formElements.maxPriority.querySelector('input').setAttribute('value', e.target.dataset.number);
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

function gatherTitleInput(){
    let modifiedElement = formElements.taskName;
    let input = modifiedElement.innerText.replace(/\n/g, '');
    let inputField = document.querySelector(`#${modifiedElement.dataset.inputType}`);
    inputField.setAttribute('value', input);
    checkIfAddAllowed();
}
function gatherDescInput(){
    let modifiedElement = formElements.description;
    let input = modifiedElement.innerText.replace(/\n/g, '');
    let inputField = document.querySelector(`#${modifiedElement.dataset.inputType}`);
    inputField.setAttribute('value', input);
}
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
const titleObserver = new MutationObserver(gatherTitleInput);
titleObserver.observe(formElements.taskName, {characterData: true, subtree: true});
const descObserver = new MutationObserver(gatherDescInput);
descObserver.observe(formElements.description, {characterData: true, subtree: true});

const valueObserver =  new MutationObserver(checkOnValueMutation);
valueObserver.observe(formElements.dueDate.querySelector('input[name=dateInput]'), {attributes: true});
valueObserver.observe(formElements.maxPriority.querySelector('input[name=maxPriInput]'), {attributes: true});


formElements.estTime.querySelectorAll('input').forEach((el)=>{
    el.addEventListener('keydown', (e)=>{
        if(e.code == "Minus"){
            e.preventDefault();
        }
    })
    el.addEventListener('paste', (e)=>{
        let pastedDatas = e.clipboardData.getData('text/plain');
        let currVal = e.target.value;
        let highlightedStr = '';
        let newVal = '';
        while(pastedDatas.indexOf('-') != -1){        
            pastedDatas = pastedDatas.replace('-','');
        }
        if (window.getSelection){
            highlightedStr = window.getSelection();
        }
        else if (document.getSelection){
            highlightedStr = document.getSelection();
        }
        else if (document.selection){
            highlightedStr = document.selection.createRange().text;;
        }
        newVal = currVal.replace(highlightedStr, pastedDatas);
        if(newVal.length > 3){
            newVal = newVal.slice(0,3);
        }
        e.target.value = newVal;
        e.preventDefault();
    })
    el.addEventListener('input', (e)=>{
        if(e.target.value.length > 3){
            e.target.value = e.target.value.slice(0,3);
        }
    })
    el.addEventListener('blur', (e)=>{
        if(e.target.value === ''){
            e.target.value = '0';
        }
    })
    })
        
    function showErrorMessage(message){
        formElements.errorMessage.textContent = message;
        horizCenterPopups(formElements.errorMessage);
        formElements.errorMessage.style.top = '100%';
    }
    function hideErrorMessage(){
        formElements.errorMessage.style.top = `calc(100% - ${formElements.errorMessage.clientHeight}px)`;
    }
    function getErrorMessage(){
        let firstMessage = true;
        let message = '';
        if(document.querySelector('input[name=taskName]').value == ''){
            message += "Task name is required";
            firstMessage = false;
        }
        if(formElements.priority.querySelector('input[name=priInput]').value == ''){
            if(!firstMessage){
                message += ', ';
            }
            message += 'Priority is required';
        }
        if(formElements.dueDate.querySelector('input[name=dateInput]').value == '' &&
        formElements.maxPriority.querySelector('input[name=maxPriInput]').value != ''){
            if(!firstMessage){
                message += ', ';
            }
            message += 'Date is required to use Max. Priority';
        }
        return message;
    }
    function addTaskHoverErr(e){
        if(e.target.classList.contains('dimmed')){
            showErrorMessage(getErrorMessage());
        }
    }
    formElements.addTask.addEventListener('mouseover', addTaskHoverErr);
    document.addEventListener('click', hideErrorMessage);
}