const colorPickerBtn = document.querySelector("#color-Button");
const clearAll = document.querySelector(".clear-button");
const colorList = document.querySelector(".all-colors");
const clipboard = document.querySelector(".clipboardButton");
const colorSelector = JSON.parse(localStorage.getItem("color-selector") || "[]");

const showColor = () => {
    if (!colorSelector.length) return;
    else if (colorSelector.length < 6) {
        colorList.innerHTML = colorSelector.map(color => `
        <li class="color">
            <span class="rect" style="background: ${color}; border: 1px solid ${color == "#ffffff" ? "#ccc" : color}"></span>
            <span class="value hex" data-color="${color}">${color}</span>
        </li>
        `).join("");
        document.querySelector(".all-colors").classList.remove("hide");
    } else {
        alert("You have reached the limit of colors again choosing the colors will clear the list");
        colorSelector.length = 0;
    }
};
showColor();

const activateEyeDropper = () => {
    document.body.style.display = "none";
    setTimeout(async () => {
        try {
            const eyeDropper = new EyeDropper();
            const { sRGBHex } = await eyeDropper.open();

            if (!colorSelector.includes(sRGBHex)) {
                colorSelector.push(sRGBHex);
                localStorage.setItem("color-selector", JSON.stringify(colorSelector));
                showColor();
            }
        } catch (error) {
            alert("Failed to copy the color code!");
        }
        document.body.style.display = "block";
    }, 10);
};

clipboard.addEventListener("click", () => {
    const lastColor = colorSelector[colorSelector.length - 1];
    if (lastColor) {
        navigator.clipboard.writeText(lastColor);
    }
});

const clearAllColors = () => {
    colorSelector.length = 0;
    localStorage.setItem("color-selector", JSON.stringify(colorSelector));
    document.querySelector(".all-colors").classList.add("hide");
};

clearAll.addEventListener("click", clearAllColors);
colorPickerBtn.addEventListener("click", activateEyeDropper);


// ------------------------font identifier-----------------------

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
