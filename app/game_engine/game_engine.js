export class GameEngine {

    constructor(config) {
        this.gameMap = config.board; // 2 dimensionall array map which represents game board
        this.gameCols = this.gameMap[0].length;
        this.gameRows = this.gameMap.length;
        this.turn = 0; // counter for this.turn number, used to determine which players this.turn it is
        this.gameState = 'player1_turn'; // used to determine if game is playing or not
        this.winCondition = config.wincondition;

        this.ai_worker = new Worker('app/minimax_ai/minimax_worker.js', { type: "module" });
        this.ai_worker.postMessage({ config });
        this.ai_worker.onmessage = function (event) {
            this.makeMove([event.data.bestMove.colIndex, event.data.bestMove.rowIndex], 'player2')
        }.bind(this)
    }

    gameOver(marker) {
        var winner = marker === 'x' ? 'Player2' : 'Player1';
        var winMessage;

        this.gameState = 'game_over'

        winMessage = document.createElement('div');
        winMessage.setAttribute('class', 'title');
        winMessage.setAttribute('id', 'win_message');
        winMessage.textContent = winner + " is the winner!!"

        document.getElementById('game_board').appendChild(winMessage);
    }

    checkForWin(mark, colSelected, rowSelected) {
        var wins = []; //keeps track of marks in a row

        var i = 0;
        var iLimit = this.gameCols - this.winCondition;

        var j;
        var jLimit = this.gameRows - this.winCondition;

        var z;
        var zLimit = this.winCondition;

        for (; i <= iLimit; i += 1) {
            j = 0
            for (; j <= jLimit; j += 1) {
                z = 0
                //checking rows
                for (; z < zLimit; z += 1) {
                    if (this.gameMap[rowSelected][i + z] == mark) {
                        if (z === zLimit - 1) return this.gameOver(mark);
                    } else {
                        break
                    }
                }

                //checking cols
                z = 0;
                for (; z < zLimit; z += 1) {
                    if (this.gameMap[j + z][colSelected] == mark) {
                        if (z === zLimit - 1) return this.gameOver(mark);
                    } else {
                        break
                    }
                }

                //checking diagonal to right
                z = 0;
                for (; z < zLimit; z += 1) {
                    if (this.gameMap[j + z][i + z] == mark) {
                        if (z === zLimit - 1) return this.gameOver(mark);
                    } else {
                        break
                    }
                }
            }
        }

        i = this.gameCols
        for (; i >= zLimit; i -= 1) {
            j = 0
            for (; j <= jLimit; j += 1) {
                //checking diagonal to left
                z = 0
                for (; z < zLimit; z += 1) {
                    if (this.gameMap[j + z][i - z - 1] == mark) {
                        if (z === zLimit - 1) return this.gameOver(mark);
                    } else {
                        break
                    }
                }
            }
        }
    }

    checkForTie() {
        var tieMessage;

        if (this.turn === (this.gameRows * this.gameCols)) {
            if (this.gameState != 'game_over') {
                this.gameState = 'game_over'

                tieMessage = document.createElement('div');
                tieMessage.setAttribute('class', 'title');
                tieMessage.setAttribute('id', 'win_message');
                tieMessage.textContent = "Tie Game...";

                document.getElementById('game_board').appendChild(tieMessage);
            }

        }
    }

    makeMove(coordinates, player) {
        var x_pos = coordinates[0];
        var y_pos = coordinates[1];

        //determine which players this.turn it is
        var marker = this.turn % 2 == 0 ? 'o' : 'x';

        //check that game is in playing state
        if (this.gameState != 'game_over') {
            if (this.gameState.includes(player)) {
                //check that square isnt taken
                if (this.gameMap[y_pos][x_pos] === ' ') {
                    //set marker for clicked square
                    document.getElementById(x_pos + ',' + y_pos).setAttribute('class', 'square ' + marker)
                    
                    //set marker in this.gameMap
                    //x and y coordinates are swapped here because of how arrays are printed when logged
                    this.gameMap[y_pos][x_pos] = marker;
                    
                    this.turn += 1;
                    this.gameState = player.includes('1') ? 'player2_turn' : 'player1_turn';
                    
                    this.checkForWin(marker, coordinates[0], coordinates[1])
                    
                    this.checkForTie();
                    
                    if (this.gameState.includes('2')) {
                        this.ai_worker.postMessage(this.gameMap)
                    }

                } else {
                    console.log("TAKEN!!");
                }
            } else {
                console.log("NOT YOUR TURN!!!");
            }
        } else {
            //start new game - todo
            console.log("Game is Over - GO HOME!!")
        }
    }
}

