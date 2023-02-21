import { renderTask } from "../views/renderTask";
import { saveTask } from "./fetch";
export {onlyPasteText, regPriorityButtonClicked, maxPriorityButtonClicked,
  observeTextFields, validateTimeInputs, getErrorMessage, formSubmission};

function onlyPasteText(){
const inputText = document.querySelectorAll(".textInput");

inputText.forEach((item)=>{
    item.addEventListener("paste", function(e) {
        e.preventDefault();
        if (e.clipboardData && e.clipboardData.getData) {
          let text = e.clipboardData.getData("text/plain");
          document.execCommand("insertHTML", false, text);
        } else if (window.clipboardData && window.clipboardData.getData) {
          let text = window.clipboardData.getData("Text");
          insertTextAtCursor(text);
        }
      });
    })}

function regPriorityButtonClicked(target){
  if(!target.classList.contains('regPriorityButton')){
    return false;
  }
  else{
    document.querySelector('input[name="priInput"]').setAttribute('value', target.dataset.number);
    if(document.querySelector('input[name="maxPriInput"]').value != '' &&
      target.dataset.number > document.querySelector('input[name="maxPriInput"]').value){
      document.querySelector('input[name="maxPriInput"]').value = target.dataset.number;
    }
    return true;
  }
}

function maxPriorityButtonClicked(target, highestUnavailable){
  if(!(target.classList.contains('maxPriorityButton') && target.dataset.number > highestUnavailable)){
    return false;
  }
  else{
    document.querySelector('input[name="maxPriInput"]').setAttribute('value', target.dataset.number);
    return true;
  }
}

function observeTextFields(checkIfAddAllowed){
  let taskName = document.querySelector('.title');
  let description = document.querySelector('.description');
  let estimatedMins = document.querySelector('input[name=estMinutes');
  let estimatedHours = document.querySelector('input[name=estHours');
  let estimatedDays = document.querySelector('input[name=estDays');

  function gatherTitleInput(){
    let modifiedElement = taskName;
    let input = modifiedElement.innerText.replace(/\n/g, '');
    let inputField = document.querySelector(`#${modifiedElement.dataset.inputType}`);
    inputField.setAttribute('value', input);
    checkIfAddAllowed();
  }

  function gatherDescInput(){
    let modifiedElement = description;
    let input = modifiedElement.innerText.replace(/\n/g, '');
    let inputField = document.querySelector(`#${modifiedElement.dataset.inputType}`);
    inputField.setAttribute('value', input);
  }

  const titleObserver = new MutationObserver(gatherTitleInput);
  titleObserver.observe(taskName, {characterData: true, subtree: true});
  const descObserver = new MutationObserver(gatherDescInput);
  descObserver.observe(description, {characterData: true, subtree: true});
}

function validateTimeInputs(el){
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
}

function getErrorMessage(){
  let firstMessage = true;
  let message = '';
  if(document.querySelector('input[name=taskName]').value == ''){
      message += "Task name is required";
      firstMessage = false;
  }
  if(document.querySelector('input[name=priInput]').value == ''){
      if(!firstMessage){
          message += ', ';
      }
      message += 'Priority is required';
      firstMessage = false;
  }
  if(document.querySelector('input[name=dateInput]').value == '' &&
  document.querySelector('input[name=maxPriInput]').value != ''){
      if(!firstMessage){
          message += ', ';
      }
      message += 'Date is required to use Max. Priority';
      firstMessage = false;
  }
  return message;
}

function formSubmission(e){
  if(getErrorMessage() != ''){
    e.preventDefault();
  }
  else{
    e.preventDefault();
    let task = constructTask();
    renderTask(task);
    saveTask(task);
  }

function taskFactory(name, desc, due, priority, maxPriority, estimatedTime){
  let task = {name, desc, due, priority, maxPriority, estimatedTime};
  let switchTimes = [];
  if(maxPriority != ''){
    switchTimes = findSwitchTimes(task);
  }
  task.switchTimes = switchTimes;
  return task;
}

function findSwitchTimes(task) {
  let intervals = parseInt(task.maxPriority) - parseInt(task.priority);
  if (intervals == 0) {             //no intervals means priority doesn't switch
      return null;
  }
  let due = new Date(task.due);
  let dueMS = due.getTime();           //due date in milliseconds (date object)
  let today = new Date();          //current time in iso format
  let currentMS = today.getTime();     //current time in milliseconds
  let estimatedTime = task.estimatedTime;
  if (estimatedTime < 86400000) {   //ensures that highest priority will be reached a minimum of a day before due
      estimatedTime = 86400000;
  }
  let lastSwitch = dueMS - estimatedTime;
  let intervalTime = (lastSwitch - currentMS) / intervals;
  let switchTimes = [];
  for (let i = 1; i <= intervals; i++) {    //calculates each intervalTime and adds it to the array
      let nextInterval = new Date(currentMS + (intervalTime * i));
      switchTimes.push(nextInterval.toJSON());
  }
  return switchTimes
}

function constructTask(){
  let name = document.querySelector('input[name=taskName]').value;
  let desc = document.querySelector('input[name=taskDesc]').value;
  let due = document.querySelector('input[name=dateInput]').value;
  let priority = document.querySelector('input[name=priInput]').value;
  let maxPriority = document.querySelector('input[name=maxPriInput]').value;
  let estimatedMins = parseInt(document.querySelector('input[name=estMinutes').value);
  let estimatedHours = parseInt(document.querySelector('input[name=estHours').value);
  let estimatedDays = parseInt(document.querySelector('input[name=estDays').value);
  console.log("estmins type: " + typeof estimatedMins);
  let estimatedMs = (60000 * estimatedMins) + (3600000 * estimatedHours) + (86400000 * estimatedDays);

  let task = taskFactory(name, desc, due, priority, maxPriority, estimatedMs);
  return task;
}

}