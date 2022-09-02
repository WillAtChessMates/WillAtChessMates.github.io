class Board {
    constructor(id, onMove = undefined) {
        this.position = {};
        this.boardId = id;
        this.selectedPiece = null;
        var board = this;
        var boardContainer = $(`#${id}`);
        this.dropTarget = null;
        this.onMove = onMove;
        for(let i = 0; i < 8; i++) {
            let row = $("<div class='row'></div>");
            for(let j = 0; j < 8; j++) {
                let square = $(`<div class='square ${((i + j) % 2 == 0 ? "white-square" : "black-square")}' data-coord='${`${String.fromCharCode(i + 1 + 96)}${8 - j}`}'></div>`);

                square.on("dragover", function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    board.dropTarget = this;
                });

                row.append(square);
            }
            boardContainer.append(row);

        }

        boardContainer.on("touchmove", function(e) {
            e.preventDefault();
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            var x = touch.pageX - boardContainer.offset().left;
            var y = touch.pageY - boardContainer.offset().top;
            $(".square").each(function(i, square) {
                if(square.offsetLeft <= x && square.offsetLeft + square.offsetWidth >= x && square.offsetTop <= y && square.offsetTop + square.offsetHeight >= y) {
                    board.dropTarget = square;
                }
            });
        });
    }

    selectPiece(piece) {
        this.selectedPiece = piece;
    }

    deselectPiece() {
        this.selectedPiece = null;
    }

    isSquareEmpty(square) {
        return this.position[square] == undefined || this.position[square] == null;
    }

    movePiece(square) {
        if(this.selectedPiece != null && this.selectedPiece != undefined) {
            let start = this.selectedPiece.dataset.coord;
            if(this.onMove != undefined) {
                if(!this.onMove(this.selectedPiece.parentElement.dataset.coord, square)) {
                    return;
                }
            }
            $(square).empty();
            square.appendChild(this.selectedPiece);
            this.deselectPiece();
        }
    }

    setPosition(fen, validateFen) {
        if(validateFen) {
            if(!this.validateFen(position)) {
                return;
            }
        }
        let rows = fen.split("/");
        for(let i = 0; i < rows.length; i++) {
            let row = rows[i].split("");
            let j = 0;
            while(j < row.length) {
                let skips = parseInt(row[j]);
                if(isNaN(skips)) {
                    this.position[`${String.fromCharCode(j + 1 + 96)}${8 - i}`] = ((row[j].toUpperCase() == row[j]) ? "w" : "b") + row[j].toUpperCase();
                } else {
                    j += skips;
                }
                j++;
            }
        }
        this.updateBoard();
    }

    placePiece(pieceType, pieceColor, square) {
        this.position[square] = pieceColor + pieceType;
        this.updateBoard();
    }

    removePiece(square) {
        delete this.position[square];
        this.updateBoard();
    }

    updateBoard() {
        var board = this;
        $(`#${this.boardId}`).children().each(function(i, row) {
            $(row).children().each(function(j, square) {
                if(square.dataset.coord in board.position) {
                    if($(square).children().length == 0) {
                        let img = $(`<img id='draggable' src='https://chessmates.com.au/wp-content/uploads/${board.position[square.dataset.coord]}.png'>`);
                        img.on("dragstart touchstart", function(e) {
                            board.selectPiece(this);
                        });

                        img.on("dragend touchend", function(e) {
                            if(board.dropTarget != null || board.dropTarget != undefined) {
                                board.movePiece(board.dropTarget);
                            }
                        });
                        $(square).append(img);
                    }
                } else {
                    $(square).empty();
                }
            });
        });
    }
}

function validateFen(fen) {
    // both kings?
    // adds to 64 squares?
    return true;
}

function PGNToFen() {
    return "";
}