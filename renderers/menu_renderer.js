const { ipcRenderer } = require("electron")
const imgSelector = require("../renderers/image_selector_renderer")

function loadMenu(paths){
    imgSelector.load(paths)
    //ipcRenderer.send("puzzleArgs", path, 3)
}

ipcRenderer.send("showMenu", "show menu ready")
ipcRenderer.on("menuArgs", (event, imgPathList) => {
    console.log("showing menu with args:")
    console.log(imgPathList)
    loadMenu(imgPathList)
})