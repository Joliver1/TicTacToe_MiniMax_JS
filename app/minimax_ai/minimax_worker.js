class MinimaxAi {

    constructor(config) {
        this.gameBoard = config.board;
        this.depth = config.depth;
        this.mark = 'x';
        this.oppMark = this.mark === 'x' ? 'o' : 'x';
        this.winCondition = config.wincondition;

        this.rows = this.gameBoard.length;
        this.cols = this.gameBoard[0].length
    }

    // Get next best move for computer. Return int[2] of {row, col} 
    move() {
        this.lines_evaluated = 0;
        this.outcomes_evaluated = 0;

        var result = this.minimax(this.depth, this.mark); // depth, max turn
        console.log("Lines Evaluated: " + this.lines_evaluated);
        console.log("Outcomes Evaluated: " + this.outcomes_evaluated);
        return result;   // row, col
    }

    // Recursive minimax at level of depth for either maximizing or minimizing player.
    minimax(remainingDepth, player) {
        // Generate possible next moves in a List of int[2] of {row, col}.
        var nextMoves = this.generateMoves();

        // mySeed is maximizing; while oppSeed is minimizing
        var bestScore = (player === this.mark) ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
        var currentScore;
        var bestMove;

        if (nextMoves.length === 0 || remainingDepth === 0) {
            this.outcomes_evaluated += 1;
            // Gameover or depth reached, evaluate score
            if (this.rows === this.cols) {
                bestScore = this.evaluateSquare();
            } else {
                bestScore = this.evaluate();
            }
        } else {
            var i = 0;
            var iLimit = nextMoves.length;

            for (; i < iLimit; i += 1) {
                var move = nextMoves[i];
                // Try this move for the current "player"
                this.gameBoard[move.rowIndex][move.colIndex] = player;
                if (player === this.mark) {  // mySeed (computer) is maximizing player
                    currentScore = this.minimax(remainingDepth - 1, this.oppMark).bestScore;
                    if (currentScore > bestScore) {
                        bestScore = currentScore;
                        bestMove = move
                    }
                } else {  // oppSeed is minimizing player
                    currentScore = this.minimax(remainingDepth - 1, this.mark).bestScore;
                    if (currentScore < bestScore) {
                        bestScore = currentScore;
                        bestMove = move;
                    }
                }
                // Undo move
                this.gameBoard[move.rowIndex][move.colIndex] = ' ';
            }
        }

        return {
            bestMove: bestMove,
            bestScore: bestScore
        };
    }

    // Find all valid next moves.
    // Return List of moves or empty list if gameover 
    generateMoves() {
        var nextMoves = []; // allocate List

        var rowIndex = 0;
        var colIndex;

        // Search for empty cells and add to the List
        for (; rowIndex < this.rows; rowIndex += 1) {
            colIndex = 0;
            for (; colIndex < this.cols; colIndex += 1) {
                if (this.gameBoard[rowIndex][colIndex] === ' ') {
                    nextMoves.push({ rowIndex, colIndex });
                }
            }
        }
        return nextMoves;
    }

    evaluateLine(line) {
        this.lines_evaluated += 1
        var score = 0;

        var i = 0

        for (; i < line.length; i += 1) {
            if (score === 0) {
                if (this.gameBoard[line[i].rowIndex][line[i].colIndex] === this.mark) {
                    score = 1;
                } else if (this.gameBoard[line[i].rowIndex][line[i].colIndex] === this.oppMark) {
                    score = -1;
                }
            } else {
                if (score > 0) {
                    if (this.gameBoard[line[i].rowIndex][line[i].colIndex] === this.mark) {
                        score = score * 11;
                    } else {
                        if (this.gameBoard[line[i].rowIndex][line[i].colIndex] === this.oppMark) {
                            return 0;
                        }
                    }
                } else if (score < 0) {
                    if (this.gameBoard[line[i].rowIndex][line[i].colIndex] === this.oppMark) {
                        score = score * 10;
                    } else {
                        if (this.gameBoard[line[i].rowIndex][line[i].colIndex] === this.mark) {
                            return 0;
                        }
                    }
                }
            }
        }
        return score;
    }

    createCoordinates(rowIndex, colIndex) {
        return {
            rowIndex,
            colIndex
        }
    }

    //called if board is a square
    evaluateSquare() {
        var score = 0;
        var line = [];

        var z;
        var zLimit = this.cols - this.winCondition;

        var i;
        var iLimit = this.rows - this.winCondition;

        var j;
        var jLimit = this.rows - this.winCondition;

        z = 0;
        for (; z <= zLimit; z += 1) {
            i = 0;
            for (; i < this.rows; i += 1) {
                j = 0
                line = []
                //evaluate rows
                for (; j < this.winCondition; j += 1) {
                    line.push(this.createCoordinates(i, (j + z)));
                }
                score += this.evaluateLine(line);

                line = []
                j = 0
                //evaluate cols
                for (; j < this.winCondition; j += 1) {
                    line.push(this.createCoordinates((j + z), i));
                }
                score += this.evaluateLine(line);
            }

            i = 0
            //checking top left to bot right
            for (; i <= iLimit; i += 1) {
                j = 0
                line = []
                for (; j < this.winCondition; j += 1) {
                    line.push(this.createCoordinates((j + i), (j + z)));
                }
                score += this.evaluateLine(line);
            }
        }

        i = this.cols

        //checking top right to bot left
        for (; i >= this.winCondition; i -= 1) {
            j = 0
            for (; j <= jLimit; j += 1) {
                line = []
                z = 0
                for (; z < this.winCondition; z += 1) {
                    line.push(this.createCoordinates((j + z), (i - z - 1)));
                }
                score += this.evaluateLine(line);
            }
        }
        return score;
    }

    //called if board is not a square
    evaluate() {
        var score = 0;
        var line = [];
        var smallSide = this.rows;
        if (this.rows > this.cols) { smallSide = this.cols };

        var z = 0;
        var zLimit = this.cols - this.winCondition;

        var i;
        var iLimit = smallSide - this.winCondition;

        var j;

        //evaluating rows
        for (; z <= zLimit; z += 1) {
            i = 0
            for (; i < this.rows; i += 1) {
                line = [];
                j = 0;
                for (; j < this.winCondition; j += 1) {
                    line.push(this.createCoordinates(i, (j + z)));
                }
                score += this.evaluateLine(line);
            }
        }

        z = 0;
        zLimit = this.rows - this.winCondition;


        //evaluate cols
        for (; z <= zLimit; z += 1) {
            i = 0;
            for (; i < this.cols; i += 1) {
                line = []
                j = 0;
                for (; j < this.winCondition; j += 1) {
                    line.push(this.createCoordinates((j + z), i));
                }
                score += this.evaluateLine(line);
            }
        }

        z = 0;
        zLimit = this.cols - this.winCondition;


        //checking top left to bot right
        for (; z <= zLimit; z += 1) {
            for (; i <= iLimit; i += 1)
                i = 0
            {
                line = []
                j = 0
                for (; j < this.winCondition; j += 1) {
                    line.push(this.createCoordinates((j + i), (j + z)));
                }
                score += this.evaluateLine(line);
            }
        }

        iLimit = this.rows - this.winCondition;

        z = this.cols;

        //checking top right to bot left
        for (; z >= this.winCondition; z--) {
            i = 0
            for (; i <= iLimit; i += 1) {
                line = []
                j = 0
                for (; j < this.winCondition; j += 1) {
                    line.push(this.createCoordinates((j + i), z - j - 1));
                }
                score += this.evaluateLine(line);
            }
        }

        return score;
    }
}

var minimax_ai;
new Date

var startTime;
var completeTime;
var elapsedTime;

onmessage = function (event) {

    if (!minimax_ai) {
        if (event.data.config) {
            minimax_ai = new MinimaxAi(event.data.config);
        } else {
            console.log("You need to config the AI!")
        }
    } else {
        startTime = new Date().getTime()
        minimax_ai.gameBoard = event.data;
        postMessage(minimax_ai.move());
        completeTime = new Date().getTime()
        elapsedTime = (completeTime - startTime) * 0.001;
        console.log("Elapsed time: " + elapsedTime + "s")
    }

}
