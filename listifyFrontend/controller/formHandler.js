export {onlyPasteText, regPriorityButtonClicked, maxPriorityButtonClicked, observeTextFields};

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