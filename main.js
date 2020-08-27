const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const fs = require('fs')

let mainWindow = null
let imgPathList = new Array()

function initialize(){
    function initializeWindow(){ // To initialize window and load html
        //TODO: add config and stuff
        mainWindow = new BrowserWindow({ 
            width : 480,
            height : 720,
            webPreferences: { //don't know what this does
                nodeIntegration: true, 
            }
        })
        //TODO: change to index.html + add event listeners (need to look into)
        const menuPath = path.join("file://", __dirname, "htmldocs/menu.html") 
        const puzzlePath = path.join("file://", __dirname, "htmldocs/puzzle.html")
        mainWindow.loadURL(puzzlePath)
        mainWindow.once('responsive', () => {
            mainWindow.show()
        })
        //mainWindow.webContents.openDevTools()
    }
    
    function readImgPaths(){ // To read all source images available
        const imgFolderPath = path.join("data/srcImg") //Shouldn't it be ("file://", __dirname, "data/srcImg") ?
        fs.readdir(imgFolderPath, (err, imgsPath) => {
            if (err)
                console.log(err) //Logs read file name error error
            else{
                console.log("\nAll images:") //Logs files
                imgsPath.forEach(imgPath => {
                    console.log(path.join("../", imgFolderPath, imgPath)) 
                    imgPathList.push(path.join("../", imgFolderPath, imgPath))
                })
            }
        })
    }

    readImgPaths()
    app.whenReady().then(initializeWindow)
}

initialize()
ipcMain.on("showMenu", (event, confirmation) => {
    console.log(confirmation)
    event.replay("menuArgs", imgPathList)
})
ipcMain.on("genPuzzle", (event, confirmation) => { //generates puzzle and waits for completion
    console.log(confirmation)
    //TODO: ask for inputs
    event.reply("puzzleArgs", imgPathList[0], 2) //sends args for gen puzzle
})

//generatePuzzle(imgPathList[0], 2)