namespace GameUtils {

    export enum Mark {
        X = "X",
        O = "O",
        Empty = " "
    }

    export enum Victor {
        X = "GAME! Player 1 WON!",
        O = "GAME! Player 2 WON!",
        Draw = "Its a DRAW!",
        NotFinishedYet = "Game is not over. Yet."
    }

    var winningStrikes: Array<Array<Number>> = [
        //Horizontal
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        //Vertical
        [3, 6, 9],
        [2, 5, 8],
        [1, 4, 7],
        //Cross
        [1, 5, 9],
        [7, 5, 3]
    ];

    export class Board {

        public turn: Mark;
        public cells: Array<Mark>;

        constructor() {
            this.turn = Mark.X;
            this.cells = new Array<Mark>(9);

            for (let i = 0; i < this.cells.length; i++) {
                this.cells[i] = Mark.Empty;
            }
        }

        public clean(): void {
            for (let i = 0; i < this.cells.length; i++) {
                this.cells[i] = Mark.Empty;
            }
        }
        public show(): Array<Mark> {
            return this.cells;
        }
        public newTurn(): void {
            this.turn = (this.turn == Mark.X) ? Mark.O : Mark.X;
        }
        public getMark(index: number): Mark {
            return this.cells[index - 1];
        }
        public markINM(index: number): void {
            if (this.getMark(index) == Mark.Empty) {
                this.cells[index - 1] = this.turn;
                this.newTurn();
            }
        }
        public isFull(): boolean {
            for (let i = 0; i < this.cells.length; i++) {
                if (this.cells[i] == Mark.Empty) {
                    return false;
                }
            }
            return true;
        }
        public check(): Victor {
            let strike;
            for (let i = 0; i < winningStrikes.length; i++) {
                strike = winningStrikes[i];
                if (this.getMark(strike[0]) == Mark.X && this.getMark(strike[1]) == Mark.X && this.getMark(strike[2]) == Mark.X) {
                    return Victor.X;
                } else if (this.getMark(strike[0]) == Mark.O && this.getMark(strike[1]) == Mark.O && this.getMark(strike[2]) == Mark.O) {
                    return Victor.O;
                }
            }
            if (this.isFull()) {
                return Victor.Draw;
            }
            
            return Victor.NotFinishedYet;
        }

    }

}

var htmlCells: Array<HTMLElement> = new Array<HTMLElement>();
var statusHeader: HTMLElement = document.getElementById("status");
var board: GameUtils.Board = new GameUtils.Board();
var fps = 30;

//Setup
statusHeader.innerHTML = board.check();

for (let i = 0; i < 9; i++) {
    htmlCells[i] = document.getElementById(`${i + 1}`);
}

for (let i in htmlCells) {
    htmlCells[i].addEventListener('click', (e) => {
        // @ts-ignore
        board.markINM(e.target.id); // <- That is used for this
        if (board.check() != GameUtils.Victor.NotFinishedYet) {
            statusHeader.innerHTML = board.check();
            board.clean();
        } else {
            statusHeader.innerHTML = board.check();
        }
    })
}

//Render
setInterval(() => {
    let preview = board.show();
    for (let i in htmlCells) {
        htmlCells[i].innerHTML = preview[i].valueOf();
    }
}, 1000 / fps);