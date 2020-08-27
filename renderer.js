//TODO: refactor code
const { ipcRenderer } = require('electron')

const CANVAS_MAX_WIDTH = 400
const CANVAS_MAX_HEIGHT = 600
const CANVAS_X_OFFSET = 10
const CANVAS_Y_OFFSET = 10

var canvas = document.getElementById("game_container") //gets canvas
var ctx = canvas.getContext("2d")
var piecesList = new Array() //create array for puzzle pieces (partitions of image)

function generatePuzzle(imgPath, difficulty) { //generates the puzzle from an image
    var length = difficulty + 3 // 3x3 4x4 5x5 ez to hard

    var img = new Image()
    img.src = imgPath

    canvas.width = CANVAS_MAX_WIDTH + CANVAS_X_OFFSET * 4//maybe expand the purpose of canvas???
    canvas.height = CANVAS_MAX_HEIGHT + CANVAS_Y_OFFSET * 4

    //const OUTLINE_WIDTH = 3
    const OUTLINE_COLOR = "rgb(255, 255, 255)"
    const BACKGROUND_COLOR = "rgb(0, 255, 255)"
    
    const EMPTY_SPACE_COLOR_UNSELECTED = "rgb(255, 255, 0)"
    const EMPTY_SPACE_COLOR_SELECTED = "rgb(255, 0, 255)"

    img.onload = () => {

        const CELLWIDTH = CANVAS_MAX_WIDTH / length        // 
        const CELLHEIGHT = CANVAS_MAX_HEIGHT / length      // 
        var widthRatio = img.width / CANVAS_MAX_WIDTH      // These lines defined the heights and widths of indiviual puzzle pieces,
        var heightRatio = img.height / CANVAS_MAX_HEIGHT   // and their source images equivilents.
        var srcImgCellWidth = CELLWIDTH * widthRatio       //
        var srcImgCellHeight = CELLHEIGHT * heightRatio    //



        for (var row = 0; row < length; row++)
            for (var col = 0; col < length; col++)
                piecesList.push({
                    sourceX: col * srcImgCellWidth,
                    sourceY: row * srcImgCellHeight,
                    id: row * 5 + col,
                    hasSelected: false,
                    isEmptySpace: false
                    //puzzleBoardX: col * cellWidth,
                    //puzzleBoardY: row * cellHeight
                })
        piecesList.pop() //modify last piece to create buffer

        for (var i = piecesList.length - 1; i > 0; i--) { //Fisher-Yates shuffle for the pieces
            let j = Math.floor(Math.random() * (i + 1))
            let temp = piecesList[i]
            piecesList[i] = piecesList[j]
            piecesList[j] = temp
        }
        piecesList.push({
            id: piecesList.length,
            hasSelected: false,
            isEmptySpace: true
        })
        //console.log(piecesList) 
        function drawPuzzle() {
            ctx.fillStyle = BACKGROUND_COLOR
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            var xOffset = 5 //initialize some values
            var yOffset = 5
            var row = 0
            var col = 0

            piecesList.forEach(piece => { //draws the pieces
                if (row == 0)
                    yOffset = 0
                else
                    yOffset = 5 * row
                if (col == 0)
                    xOffset = 0
                else
                    xOffset = 5 * col

                piece.puzzleBoardX = col * CELLWIDTH + xOffset + CANVAS_X_OFFSET
                piece.puzzleBoardY = row * CELLHEIGHT + yOffset + CANVAS_Y_OFFSET
                if ("sourceX" in piece)
                    with (piece)
                    ctx.drawImage(img, sourceX, sourceY, srcImgCellWidth, srcImgCellHeight,
                        puzzleBoardX, puzzleBoardY, CELLWIDTH, CELLHEIGHT)
                else
                    drawEmptySpace(piece.puzzleBoardX, piece.puzzleBoardY, EMPTY_SPACE_COLOR_UNSELECTED)

                col++
                if (col == length) {
                    col = 0
                    row++
                }
            })
        }
        drawPuzzle()
        //drawEmptySpace(col * CELLWIDTH + xOffset + 5 + CANVAS_X_OFFSET, row * CELLHEIGHT + yOffset + CANVAS_Y_OFFSET, CELLWIDTH, CELLHEIGHT) // +5 to update offset
        console.log(piecesList)

        //TODO: add mouse click event and game logic

        canvas.addEventListener("mousedown", (event) => { //BUG: should be only adjacent to empty space can be chosen, cannot find valid empty space
            var mouseX = event.clientX
            var mouseY = event.clientY
            var hasAnyConditionMet = false

            var selectedId = piecesList.findIndex(piece => piece.hasSelected)
            var hasSelectedAnyPieces = false
            if (selectedId != -1)
                hasSelectedAnyPieces = true
            var emptySpaceIndex = piecesList.findIndex(piece => piece.isEmptySpace)

            //console.log(hasSelectedAnyPieces)
            //console.log(selectedId)
            //console.log(emptySpaceIndex)

            for (var i = 0; i < piecesList.length; i++) {
                //Check for adjacent empty space
                let hasAdjacentEmptySpace = false
                let adjacentIndices = [i - length, i + length, i - 1, i + 1] //up, down, left, right
                for (var j = 0; j < adjacentIndices.length; j++) {
                    if (adjacentIndices[j] == emptySpaceIndex) {
                        console.log(adjacentIndices)
                        hasAdjacentEmptySpace = true
                        break
                    }
                }
                with (piecesList[i]) {
                    if (!hasAdjacentEmptySpace && !hasSelectedAnyPieces) // if no adjacent + hasnt selected any piece => skip to next iteration
                        continue
                    //console.log(hasSelected && isEmptySpace && ((mouseY >= puzzleBoardY && mouseY <= puzzleBoardY + CELLHEIGHT) && (mouseX >= puzzleBoardX && mouseX <= puzzleBoardX + CELLWIDTH)))
                    if (hasSelectedAnyPieces && isEmptySpace && ((mouseY >= puzzleBoardY && mouseY <= puzzleBoardY + CELLHEIGHT) && (mouseX >= puzzleBoardX && mouseX <= puzzleBoardX + CELLWIDTH))) { //check if selected this piece (empty space)
                        console.log("found valid empty space")
                        piecesList[selectedId].hasSelected = false

                        //TODO: revert to unselected state + swap
                        //with (piecesList[selectedId])
                            //rawUnselect(puzzleBoardX, puzzleBoardY, emptySpaceIndex)
                        //console.log(piecesList[i])
                        //console.log(piecesList[selectedId])

                        let t = piecesList[i]
                        piecesList[i] = piecesList[selectedId]
                        piecesList[selectedId] = t

                        //console.log(piecesList[i])
                        //console.log(piecesList[selectedId])
                        
                        drawPuzzle() //redraw puzzle
                        hasAnyConditionMet = true
                    } else if ((mouseY >= puzzleBoardY && mouseY <= puzzleBoardY + CELLHEIGHT) && (mouseX >= puzzleBoardX && mouseX <= puzzleBoardX + CELLWIDTH)) { //check if selected this piece (not empty space)             
                        if (!hasSelectedAnyPieces) {
                            console.log("selected box")
                            hasSelected = true //set Selected to true

                            //TODO: change to selected state
                            drawOutLine(puzzleBoardX, puzzleBoardY, OUTLINE_COLOR)
                            with (piecesList[emptySpaceIndex])
                                drawEmptySpace(puzzleBoardX, puzzleBoardY, EMPTY_SPACE_COLOR_SELECTED)

                        } else {
                            console.log("unselected box1")
                            piecesList[selectedId].hasSelected = false

                            //TODO: revert to unselected state
                            with (piecesList[selectedId])
                                drawUnselect(puzzleBoardX, puzzleBoardY, emptySpaceIndex)
                            //selectedId = -1
                        }
                        hasAnyConditionMet = true
                    }
                    if (hasAnyConditionMet)
                        break;
                }
            }
            if (!hasAnyConditionMet && hasSelectedAnyPieces) {
                console.log("unselected box2")
                piecesList[selectedId].hasSelected = false

                //TODO: revert to unselected state
                with (piecesList[selectedId])
                    drawUnselect(puzzleBoardX, puzzleBoardY, emptySpaceIndex)
            }

            //TODO: Check if finished puzzle
            let hasFinished = true
            for (let i = 0; i < piecesList.length; i++)
                if (piecesList[i].id != i) {
                    hasFinished = false
                    break
                }

            //TODO: win screen and reset game
            if (hasFinished)
                console.log("Congrats! You have finished the puzzle!")
            //console.log(selectedId)
            //console.log(hasSelected)
            //console.log(emptySpaceIndex)
            
        })

        function drawUnselect(x, y, index) {
            drawOutLine(x, y, BACKGROUND_COLOR)
            with (piecesList[index])
                drawEmptySpace(puzzleBoardX, puzzleBoardY, EMPTY_SPACE_COLOR_UNSELECTED)
        }
        function drawEmptySpace(x, y, color) {
            ctx.fillStyle = color
            ctx.fillRect(x, y, CELLWIDTH, CELLHEIGHT)
        }
        function drawOutLine(x, y, color) {
            ctx.fillStyle = color
            ctx.strokeRect(x, y, CELLWIDTH, CELLHEIGHT)
        }

    }
}

ipcRenderer.send("genPuzzle", "puzzle generation ready")
ipcRenderer.on("puzzleArgs", (event, path, diff) => {
    console.log("Generating puzzle with args:\n" + path + '\n' + diff)
    generatePuzzle(path, diff)
})