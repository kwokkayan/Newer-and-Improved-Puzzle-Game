const { ipcRenderer } = require('electron')

ipcRenderer.send("showMenu", "show menu ready")
ipcRenderer.on("menuArgs", (event, imgPathList) => {
    console.log("showing menu with args:")
    console.log(imgPathList)
    
})