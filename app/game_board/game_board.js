import { GameEngine } from "../game_engine/game_engine.js";

class Game_Board extends HTMLElement {

    constructor() {
        super();
        this.game_engine;
        this.onClick = (event) => {
            this.game_engine.makeMove(event.toElement.id.split(','), 'player1');
        }
    }

    static get observedAttributes() { return ['rows', 'columns', 'depth', 'wincondition']; }

    createGameBoard() {
        var rows = this.rows;
        var columns = this.columns;

        //iterators
        var y = 0;
        var x;

        //html elements
        var row;
        var square;

        //game map
        var gameMap = [];
        var rowMap;

        for (; y < rows; y += 1) {
            x = 0;
            // prepare html element
            row = document.createElement('div');
            row.setAttribute('class', 'row');

            // prepare gameMap
            rowMap = [];

            for (; x < columns; x += 1) {
                //build square element
                square = document.createElement('div');
                square.setAttribute('class', 'square');
                square.setAttribute('id', x + ',' + y);
                square.addEventListener("click", this.onClick);

                //add square to row element
                row.appendChild(square);

                //add empty square to row map
                rowMap.push(' ');
            }

            //add row to table
            this.appendChild(row);

            //add row to gameMap
            gameMap.push(rowMap)
        }

        return gameMap;
    }

    attributeChangedCallback(name, oldValue, newValue) {
    }

    connectedCallback() {
        var config = {
            board: this.createGameBoard(),
            depth: this.depth,
            wincondition: this.wincondition
        }

        this.game_engine = new GameEngine(config)
    }

    disconnectedCallback() {
        this.innerHTML = "";
        console.log("Board disconnected!");
    }

    get rows() {
        return this.getAttribute('rows');
    }

    set rows(newValue) {
        console.log('SET Row ' + newValue)
    }

    get columns() {
        return this.getAttribute('columns');
    }

    set columns(newValue) {
        console.log('SET COL ' + newValue)

    }

    get depth() {
        return this.getAttribute('depth');
    }

    set depth(newValue) {
        console.log('SET depth ' + newValue)
    }

    get wincondition() {
        return this.getAttribute('wincondition');
    }

    set wincondition(newValue) {
        console.log('SET wincondition ' + newValue)
    }
}

customElements.define("game-board", Game_Board);