const colorPickerBtn = document.querySelector("#color-Button");
const clearAll = document.querySelector(".clear-button");
const colorList = document.querySelector(".all-colors");
const colorSelector = JSON.parse(localStorage.getItem("color-selector")|| "[]") ;

const showColor = () => {
    if(!colorSelector.length) return; 
    colorList.innerHTML = colorSelector.map(color => `
        <li class="color">
            <span class="rect" style="background: ${color}; border: 1px solid ${color == "#ffffff" ? "#ccc": color}"></span>
            <span class="value hex" data-color="${color}">${color}</span>
        </li>
    `).join(""); 
    document.querySelector(".all-colors").classList.remove("hide");
}
showColor();

const activateEyeDropper = () => {
    document.body.style.display = "none";
    setTimeout(async () => {
        try {
            const eyeDropper = new EyeDropper();
            const { sRGBHex } = await eyeDropper.open();
            navigator.clipboard.writeText(sRGBHex);

            if(!colorSelector.includes(sRGBHex)) {
                colorSelector.push(sRGBHex);
                localStorage.setItem("color-selector", JSON.stringify(colorSelector));
                showColor();
            }
        } catch (error) {
            alert("Failed to copy the color code!");
        }
        document.body.style.display = "block";
    }, 10);
}

const clearAllColors = () => {
    colorSelector.length = 0;
    localStorage.setItem("color-selector", JSON.stringify(colorSelector));
    document.querySelector(".all-colors").classList.add("hide");
}

clearAll.addEventListener("click", clearAllColors);
colorPickerBtn.addEventListener("click", activateEyeDropper);




//------------------------font identifier-----------------------

const getCurrentTab = async () => {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

document.querySelector("#font-Button").addEventListener("click", async () => {
    const tab = await getCurrentTab();
    chrome.tabs.sendMessage(tab.id, { message: "check" }, (response) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["fontContent_Script.js"]
            });
        } else {
            // Message was sent successfully
            if (response && response.message === "present") {
                chrome.tabs.sendMessage(tab.id, { message: "restart" });
            } else {
                console.log("ERROR! No response returned by message");
            }
        }
    });
});

