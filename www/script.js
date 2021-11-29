// import {reshape} from math.js;
// import {generate_moves} from "js/chess.js";
//var alpha, piece, number;

// const { Chess } = require("./chessboardjs/js/chess");

// function initialize() {
    tf.loadLayersModel('models/model_alpha/model.json').then(function (model) {
        window.alpha = model;
    });
    tf.loadLayersModel('models/model_numbers/model.json').then(function (model) {
        window.number = model;
    });
    tf.loadLayersModel('models/model_pieces/model.json').then(function (model) {
        window.pieces = model;     
    });
// }

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const reshapeArray = (arr, r, c) => {
   if (r * c !== arr.length * arr[0].length) {
      return arr;
   }
   const res = [];
   let row = [];
   arr.forEach(items => items.forEach((num) => {
      row.push(num);
      if (row.length === c) {
         res.push(row);
         row = [];
      }
   }))
   return res;
};

var board, game = new Chess();

/*The "AI" part starts here */

var minimaxRoot = function(depth, game, isMaximisingPlayer) {

    var newGameMoves = game.ugly_moves();
    var bestMove = -9999;
    var bestMoveFound;

    for(var i = 0; i < newGameMoves.length; i++) {
        var newGameMove = newGameMoves[i]
        game.ugly_move(newGameMove);
        var value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
        game.undo();
        if(value >= bestMove) {
            bestMove = value;
            bestMoveFound = newGameMove;
        }
    }
    return bestMoveFound;
};

var minimax = function (depth, game, alpha, beta, isMaximisingPlayer) {
    positionCount++;
    if (depth === 0) {
        return -evaluateBoard(game.board());
    }

    var newGameMoves = game.ugly_moves();

    if (isMaximisingPlayer) {
        var bestMove = -9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.max(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            alpha = Math.max(alpha, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    } else {
        var bestMove = 9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.min(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            beta = Math.min(beta, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    }
};

var evaluateBoard = function (board) {
    var totalEvaluation = 0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i ,j);
        }
    }
    return totalEvaluation;
};

var reverseArray = function(array) {
    return array.slice().reverse();
};

var chess_dict = {
    'p': [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'P': [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    'n': [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'N': [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    'b': [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'B': [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    'r': [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    'R': [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    'q': [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    'Q': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    'k': [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    'K': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    '.': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

var new_chess_dict = {
    "1,0,0,0,0,0,0,0,0,0,0,0": 'p',
    "0,0,0,0,0,0,1,0,0,0,0,0": 'P',
    "0,1,0,0,0,0,0,0,0,0,0,0": 'n',
    "0,0,0,0,0,0,0,1,0,0,0,0": 'N',
    "0,0,1,0,0,0,0,0,0,0,0,0": 'b',
    "0,0,0,0,0,0,0,0,1,0,0,0": 'B',
    "0,0,0,1,0,0,0,0,0,0,0,0": 'r',
    "0,0,0,0,0,0,0,0,0,1,0,0": 'R',
    "0,0,0,0,1,0,0,0,0,0,0,0": 'q',
    "0,0,0,0,0,0,0,0,0,0,1,0": 'Q',
    "0,0,0,0,0,1,0,0,0,0,0,0": 'k',
    "0,0,0,0,0,0,0,0,0,0,0,1": 'K',
    "0,0,0,0,0,0,0,0,0,0,0,0": '.',
};

var alpha_dict = {
    'a': [0, 0, 0, 0, 0, 0, 0],
    'b': [1, 0, 0, 0, 0, 0, 0],
    'c': [0, 1, 0, 0, 0, 0, 0],
    'd': [0, 0, 1, 0, 0, 0, 0],
    'e': [0, 0, 0, 1, 0, 0, 0],
    'f': [0, 0, 0, 0, 1, 0, 0],
    'g': [0, 0, 0, 0, 0, 1, 0],
    'h': [0, 0, 0, 0, 0, 0, 1],
};

var new_alpha_dict = {
    '1,0,0,0,0,0,0': 'b',
    '0,1,0,0,0,0,0': 'c',
    '0,0,1,0,0,0,0': 'd',
    '0,0,0,1,0,0,0': 'e',
    '0,0,0,0,1,0,0': 'f',
    '0,0,0,0,0,1,0': 'g',
    '0,0,0,0,0,0,1': 'h',
    '0,0,0,0,0,0,0': 'a',
};

var number_dict = {
    1: [0, 0, 0, 0, 0, 0, 0],
    2: [1, 0, 0, 0, 0, 0, 0],
    3: [0, 1, 0, 0, 0, 0, 0],
    4: [0, 0, 1, 0, 0, 0, 0],
    5: [0, 0, 0, 1, 0, 0, 0],
    6: [0, 0, 0, 0, 1, 0, 0],
    7: [0, 0, 0, 0, 0, 1, 0],
    8: [0, 0, 0, 0, 0, 0, 1],
};

var new_number_dict = {
    '1,0,0,0,0,0,0': 2,
    '0,1,0,0,0,0,0': 3,
    '0,0,1,0,0,0,0': 4,
    '0,0,0,1,0,0,0': 5,
    '0,0,0,0,1,0,0': 6,
    '0,0,0,0,0,1,0': 7,
    '0,0,0,0,0,0,1': 8,
    '0,0,0,0,0,0,0': 1,
};

/*
var new_chess_dict = {}, new_alpha_dict = {}, new_number_dict = {};

for (var term in chess_dict) {
    var definition = chess_dict[term];
    new_chess_dict[definition.toString()] = term;
    new_chess_dict[term] = definition;
}
    
for (var term in alpha_dict) {
    definition = alpha_dict[term];
    new_alpha_dict[definition.toString()] = term;
    new_alpha_dict[term] = definition;
}
    
for (var term in number_dict) {
    definition = number_dict[term];
    new_number_dict[definition.toString()] = term;
    new_number_dict[term] = definition;
}
*/


var pawnEvalWhite =
    [
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
        [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
        [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
        [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
        [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
        [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
        [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
    ];

var pawnEvalBlack = reverseArray(pawnEvalWhite);

var knightEval =
    [
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
        [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
        [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
        [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
        [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
        [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ];

var bishopEvalWhite = [
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
    [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
    [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
    [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
    [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

var bishopEvalBlack = reverseArray(bishopEvalWhite);

var rookEvalWhite = [
    [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
];

var rookEvalBlack = reverseArray(rookEvalWhite);

var evalQueen = [
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

var kingEvalWhite = [

    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ],
    [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ]
];

// var SQUARES_REVERSE = {
//     0: a8, 1: b8, 2: c8, 3: d8, 4: e8, 5: f8, 6: g8, 7: h8,
//     16: a7, 17: b7, 18: c7, 19: d7, 20: e7, 21: f7, 22: g7, 23: h7,
//     32: a6, 33: b6, 34: c6, 35: d6, 36: e6, 37: f6, 38: g6, 29: h6,
//     48: a5, 49: b5, 50: c5, 51: d5, 52: e5, 53: f5, 54: g5, 55: h5,
//     64: a4, 65: b4, 66: c4, 67: d4, 68: e4, 69: f4, 70: g4, 71: h4,
//     80: a3, 81: b3, 82: c3, 83: d3, 84: e3, 85: f3, 86: g3, 87: h3,
//     96: a2, 97: b3, 98: c2, 99: d2, 100: e2, 101: f2, 102: g2, 103: h2,
//     112: a1, 113: b1, 114: c1, 115: d1, 116: e1, 117: f1, 118: g1, 119: h1
// };

var SQUARES = {
    a8: 0, b8: 1, c8: 2, d8: 3, e8: 4, f8: 5, g8: 6, h8: 7,
    a7: 16, b7: 17, c7: 18, d7: 19, e7: 20, f7: 21, g7: 22, h7: 23,
    a6: 32, b6: 33, c6: 34, d6: 35, e6: 36, f6: 37, g6: 38, h6: 39,
    a5: 48, b5: 49, c5: 50, d5: 51, e5: 52, f5: 53, g5: 54, h5: 55,
    a4: 64, b4: 65, c4: 66, d4: 67, e4: 68, f4: 69, g4: 70, h4: 71,
    a3: 80, b3: 81, c3: 82, d3: 83, e3: 84, f3: 85, g3: 86, h3: 87,
    a2: 96, b2: 97, c2: 98, d2: 99, e2: 100, f2: 101, g2: 102, h2: 103,
    a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
};

var kingEvalBlack = reverseArray(kingEvalWhite);

var getPieceValue = function (piece, x, y) {
    if (piece === null) {
        return 0;
    }
    var getAbsoluteValue = function (piece, isWhite, x ,y) {
        if (piece.type === 'p') {
            return 10 + ( isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x] );
        } else if (piece.type === 'r') {
            return 50 + ( isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x] );
        } else if (piece.type === 'n') {
            return 30 + knightEval[y][x];
        } else if (piece.type === 'b') {
            return 30 + ( isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x] );
        } else if (piece.type === 'q') {
            return 90 + evalQueen[y][x];
        } else if (piece.type === 'k') {
            return 900 + ( isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x] );
        }
        throw "Unknown piece type: " + piece.type;
    };

    var absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x ,y);
    return piece.color === 'w' ? absoluteValue : -absoluteValue;
};


/* board visualization and games state handling */

var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

async function endGame() {
    await sleep(1000);
    alert('Game over');
    $("#post-game").show();
}

function make_matrix(fen) { //converts fen to reqd matrix format
    var pieces = fen.split(" ")[0];
    var rows = pieces.split("/");
    var arr = [];

    for (let i = 0; i < rows.length; ++i){
        console.log(rows[i]);
        var arr2 = [];
        for (let j = 0; j < rows[i].length; ++j){
            if (rows[i][j] > '0' && rows[i][j] < '9') {
                for (let k = 0; k < rows[i][j]; ++k){
                    arr2.push('.');
                }
            }
            else {
                arr2.push(rows[i][j]);
            }
        }
        arr.push(arr2);
    }
    return arr;
}

function translate(matrix) { //translates matrix format to 1's and 0's
    var rows = []
    for (let i = 0; i < matrix.length; ++i) {
        var terms = [];
        for (let j = 0; j < matrix[i].length; ++j){
            terms.push(chess_dict[matrix[i][j]]);
        }
        rows.push(terms);
    }
    //console.log(rows);
    return rows;
}

function translate_pred(pred) {
    //pred is a numpy array
    //translation = Array.from(new Array(pred.length), _ => Array(pred[0].length).fill(0));
    // console.log("Pred", pred);
    var dimensionsPred = [pred.length, pred[0].length];
    // console.log("Pred dimensions: " + dimensionsPred)
    var translation = Array(pred.length).fill().map(() =>
       Array(pred[0].length).fill(0));
    // var translation = tf.zeros([pred.length, pred[0].length]);
    
    // console.log("Translation: " + translation);
    // translation.print();
    // console.log(translation.length + " " + translation[0].length);

    // var index = pred[0].indexOf(Math.max(pred[0]));
    var index = pred[0].indexOf(Math.max(...pred[0]));
    console.log(index);
    translation[0][index] = 1;
    return translation[0];
}

var makeBestMove = async function () {
    var bestMove = getBestMove(game);
    window.bestMove = bestMove;
    
    //instead of getBestMove, pass game.fen() to the make_matrix 
    //and translate functions and then pass to ml model(yet to do)
    var matrix = make_matrix(game.fen());
    var translatedMatrix = translate(matrix);
    var t1 = tf.reshape(translatedMatrix, [1, 8, 8, 12]);
    t1.print();
    console.log("TM: ", translatedMatrix);

    await window.alpha.predict(t1).
        array().then(function (move) {
          // Translated to R code from ipynb.
          console.log("M Alpha: ", move);
          var tMove = translate_pred(move);
          // console.log("T Alpha: ", tMove);
          window.moveAlpha = new_alpha_dict[tMove.toString()];
        });

    await window.number.predict(t1).
        array().then(function (move) {
          // Translated to R code from ipynb.
          console.log("M Number: ", move);
          var tMove = translate_pred(move); 
          // console.log("T Number: ", tMove);
          window.moveNumber = new_number_dict[tMove.toString()];
        });
    
    await window.pieces.predict(t1).
        array().then(function (move) {
          // Translated to R code from ipynb.
          console.log("M Piece: ", move);
          var tMove = translate_pred(move);
          // console.log("T Piece: ", tMove.toString());
          window.movePiece = new_chess_dict[tMove.toString()];
        });
    
    
    // var ma = await window.alpha.predict(t1).array();
    // console.log("WA before: ", ma);
    // window.moveAlpha = translate_pred(tf.tensor(ma));
    // console.log("WA after: ", ma);
    // window.moveNumber = translate_pred(window.number.predict(t1));
    // console.log(window.moveNumber);
    // window.movePiece = translate_pred(window.piece.predict(t1));
    // console.log(window.movePiece);

    //await sleep(2000);        // Wait till the model is done making its predictions to print the values onto the console
    console.log("Alpha: ", window.moveAlpha);
    console.log("Number: ", window.moveNumber);
    console.log("Piece: ", window.movePiece);
    var nextMove = ((window.movePiece == 'p' || window.movePiece == 'P' ||    // If move is a pawn move
                        window.movePiece == '.')    // I have no idea why '.' appears, gotta fix this
                        ? ''                        // Remove 'p' from the SAN notation
                        : window.movePiece.toUpperCase())         // Else retain the piece's character
                    + window.moveAlpha + window.moveNumber;
    console.log("ADAM Next Move in SAN: ", nextMove);
    

    //console.log("ADAM Best Move: ", getBestMoveFromSAN(nextMove));    
    //bestMove is a dictionary, it looks like
    //{"color": "b","from": 1,"to": 34,"flags": 1,"piece": "n"}
    //our move is in SAN notation (eg d6)
    //have to convert it to the type of bestMove so that
    //it can be passed to the make_move function.    
    //Defined a global function getMoveFromSAN in chess.js and invoking here.
    var finalMove = window.getMoveFromSAN(nextMove)
    window.finalMove = finalMove;
    console.log(finalMove);

    
    //~both of the below lines run on the logic, not ml model~
    //(UPDATE) Move predicted by model passed to function
    make_best_move(bestMove);
    board.position(game.fen());

    console.log("Minimax Board Position: ", board.position()); //this gives san notation
    renderMoveHistory(game.history());
    if (game.game_over()) {
        endGame();
    }
};


var positionCount;
var getBestMove = function (game) {
    if (game.game_over()) {
        endGame();
    }

    positionCount = 0;
    var depth = parseInt($('#search-depth').find(':selected').text());

    var d = new Date().getTime();
    var bestMove = minimaxRoot(depth, game, true);
    var d2 = new Date().getTime();
    var moveTime = (d2 - d);
    var positionsPerS = ( positionCount * 1000 / moveTime);

    $('#position-count').text(positionCount);
    $('#time').text(moveTime/1000 + 's');
    $('#positions-per-s').text(positionsPerS);
    return bestMove;
};

function make_best_move(move) {
  try {
    game.ugly_move(window.finalMove);
  } catch(e) {
    game.ugly_move(window.bestMove);
  }
}

var onDrop = function (source, target) {

    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    removeGreySquares();
    if (move === null) {
        return 'snapback';
    }

    renderMoveHistory(game.history());
    window.setTimeout(makeBestMove, 250);
};

var onSnapEnd = function () {
    board.position(game.fen());
};

var onMouseoverSquare = function(square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

var onMouseoutSquare = function(square, piece) {
    removeGreySquares();
};

var removeGreySquares = function() {
    $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
    var squareEl = $('#board .square-' + square);

    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }

    squareEl.css('background', background);
};

var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
};

board = ChessBoard('board', cfg);