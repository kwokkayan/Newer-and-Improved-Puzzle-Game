const { ipcRenderer } = require('electron') 
function generatePuzzle (imgPath, difficulty){ //generates the puzzle from an image
    var length = difficulty + 3 // 3x3 4x4 5x5 ez to hard
    
    var canvas = document.getElementById("game_container") //gets canvas
    canvas.width = 400
    canvas.height = 600
    
    var ctx = canvas.getContext("2d")
    var img = new Image()
    img.src = imgPath
    
    img.onload = () => {
        ctx.drawImage(img, 0, 0)
    }
}

ipcRenderer.send("genPuzzle", "puzzle generation ready")
ipcRenderer.on("puzzleArgs", (event, path, diff) => {
    console.log("Generating puzzle with args:\n" + path + '\n' + diff)
    generatePuzzle(path, diff)
})