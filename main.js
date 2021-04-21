const randomAnime = require('random-anime') //generates random anime images from some discord database
//const sfw = randomAnime.anime()
//const nsfw = randomAnime.nsfw()

const {app, BrowserWindow, dialog, ipcMain} = require('electron')
const path = require('path')
const fs = require('fs')

var menuPath = "";
var puzzlePath = "";
var picpath = "";
var diff = 0;

let mainWindow = null
let imgPathList = new Array()

function initialize(){
    function initializeWindow(){ // To initialize window and load html
        //TODO: add config and stuff
        mainWindow = new BrowserWindow({ 
            width : 1000,
            height : 720,
            webPreferences: { //don't know what this does
                nodeIntegration: true, 
            }
        })
        //TODO: change to index.html + add event listeners (need to look into)
        menuPath = path.join("file://", __dirname, "htmldocs/menu.html") 
        puzzlePath = path.join("file://", __dirname, "htmldocs/puzzle.html")
        mainWindow.loadURL(menuPath)
        mainWindow.once('responsive', () => {
            mainWindow.show()
        })
        //mainWindow.webContents.openDevTools()
    }
    
    function readImgPaths(){ // To read all source images available
        const imgFolderPath = path.join("data/srcImg") //Shouldn't it be ("file://", __dirname, "data/srcImg") ?
        console.log(__dirname)
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
        // some random discord images
        for (i = 0; i < 5; i++) {
            randRes = randomAnime.anime()
            console.log(randRes) 
            imgPathList.push(randRes)
        }
    }

    readImgPaths()
    app.whenReady().then(initializeWindow)
}

initialize()
ipcMain.on("showMenu", (event, confirmation) => {
    console.log(confirmation)
    event.reply("menuArgs", imgPathList)
})
ipcMain.on("genPuzzle", (event, confirmation, path) => { //generates puzzle and waits for completion
    //TODO: ask for inputs
    picpath = path
    console.log(confirmation)
    
    let diffOptions = {
        type: 'question',
        buttons: ['Easy', 'Normal', 'Hard', 'Cancel'],
        defaultId: 3,
        title: 'Select difficulty',
        message: 'Select difficulty',
        detail: 'Easy(3x3), Normal(4x4), Hard(5x5), Cancel to repick.',
    };
    
    dialog.showMessageBox(mainWindow, diffOptions).then((res) => {
        if (res.response != 3) {
            diff = res.response    
            mainWindow.loadURL(puzzlePath)
            mainWindow.once('responsive', () => {
                mainWindow.show()
            }) 
        }
    })
})
ipcMain.on("genPuzzleLoaded", (event) => {
    console.log("loading puzzle!")
    event.reply("puzzleArgs", picpath, diff) //sends args for gen puzzle
})
ipcMain.on("win", (event) => {
    let winOptions = {
        type: 'info',
        buttons: ['OK'],
        defaultId: 0,
        title: 'Congratulations!',
        message: 'You Win!',
        detail: 'Press OK to return to menu.',
    };
    
    dialog.showMessageBox(mainWindow, winOptions).then(() => {
        diff = 0
        picpath = "";
        mainWindow.loadURL(menuPath)
        mainWindow.once('responsive', () => {
             mainWindow.show()
        }) 
    })
})
//generatePuzzle(imgPathList[0], 2)