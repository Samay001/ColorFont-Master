document.body.style.cursor = "pointer";
const fontDisplay = document.createElement("p");
document.body.appendChild(fontDisplay);

fontDisplay.style.cssText = `
    position: fixed;
    font-size: 14px;
    overflow: hidden;
    padding: 5px;
    width: 140px;
    height: 80px;
    background-color: black;
    line-height: 1.3;
    font-weight: bold;
    color: white;
    z-index: 99;
`;

const mouseCoordinateAndContent = (event) =>{
    const moveX = event.clientX + 10;
    const movey = event.clientY + 10;
    fontDisplay.style.left = `${moveX}px`;
    fontDisplay.style.top = `${movey}px`;

    const elementUnderMouse = event.target;
    const elementStyle = window.getComputedStyle(elementUnderMouse);
    // console.log(elementStyle.fontFamily);
    fontDisplay.textContent = elementStyle.fontFamily;
}

document.addEventListener("mousemove",mouseCoordinateAndContent);

chrome.runtime.onMessage.addListener((message,sender,sendResponse) =>{
    if(message.message === "restart")
    {
        document.addEventListener("mousemove", mouseCoordinateAndContent);
        fontDisplay.style.display = "block";
        document.body.style.cursor = "pointer"; 
    }
    else if(message.message === "check")
    {
        sendResponse({message: "present"});
    }
});

document.addEventListener("click", () => {
    // console.warn("------------CLOSED--------");
    document.removeEventListener("mousemove", mouseCoordinateAndContent);
    fontDisplay.style.display = "none";
    document.body.style.cursor = "auto";
})