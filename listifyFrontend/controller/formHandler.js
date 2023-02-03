export {onlyPasteText};

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