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
window.game = game

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

var renderMoveHistory = function (moves) {
  window.movelist = moves.join();
  var historyElement = $('#move-history').empty();
  historyElement.empty();
  historyElement.className += "table-striped";
  historyElement.append(`
      <thead>
          <tr>
              <th scope="col">#</th>
              <th scope="col">White</th>
              <th scope="col">Black</th>
          </tr>
      </thead>
      <tbody>
  `);
  for (var i = 0; i < moves.length; i = i + 2) {
    historyElement.append('<tr> <th scope="row">' + (i/2 + 1) + "</th> <td>" + moves[i] + '</td> <td>' + (moves[i + 1] ? moves[i + 1] : ' ') + '</td> </tr>');
          }
    historyElement.append("</tbody>");
    /*historyElement.scrollTop(historyElement[0].scrollHeight);*/
    historyElement.stop().animate({scrollTop: $('tbody').get(0).scrollHeight}, 2000);
};

var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

window.onload = function () {

var black_score = 50, white_score = 50;

var scoreData = [{
		type: "stackedColumn",
		name: "Black",
		//showInLegend: "true",
		//yValueFormatString: "#",
		dataPoints: [{ x: 10, y: black_score }]
	},
	{
		type: "stackedColumn",
		name: "White",
		//showInLegend: "true",
		//yValueFormatString: "#",
		dataPoints: [{ x: 10, y: white_score }]
	}];
	
	CanvasJS.addColorSet("chessColorSet",
     [
     "#010101",
     "#FEFEFE",
    ]);
    
var chart = new CanvasJS.Chart("chartContainer", {
  title: { text: "Win Status" },
  backgroundColor: "#213c6f",
  theme: "dark1",
  colorSet: "chessColorSet",
  animationEnabled: true,
  axisX: {
    interval: 1,
    minimum: 9,
    maximum: 11,
    gridThickness: 0,
    tickLength: 0,
    lineThickness: 0,
    labelFormatter: function(){
      return " ";
    }
  },
  axisY: {
    interval: 1,
    includeZero: true,
    gridThickness: 0,
    tickLength: 0,
    lineThickness: 0,
    labelFormatter: function(){
      return " ";
    }
  },
  toolTip: {
		shared: false,
		content: "Score: {y}"
	},
	data: scoreData
});

var xVal = 0;
var yVal = 100; 
var updateInterval = 1000;

var updateChart = function () {
  white_score = black_score = 0;
  var fen = window.game.fen().split(" ")[0];
  console.log("FEN: " + fen);
  for (var i = 0; i < fen.length; i++) {
    if (fen.charAt(i) == 'p')
      black_score++;
    else if(fen.charAt(i) == 'P')
      white_score++;
    else if (fen.charAt(i) == 'b')
      black_score += 3;
    else if(fen.charAt(i) == 'B')
      white_score += 3;
    else if (fen.charAt(i) == 'n')
      black_score += 3;
    else if(fen.charAt(i) == 'N')
      white_score += 3;
    else if (fen.charAt(i) == 'r')
      black_score += 5;
    else if(fen.charAt(i) == 'R')
      white_score += 5;
    else if (fen.charAt(i) == 'q')
      black_score += 9;
    else if(fen.charAt(i) == 'Q')
      white_score += 9;
  }
  /*
  black_data.shift();
  white_data.shift();
  black_data.push({ x: black_score, y: 10 });
  white_data.push({ x: white_score, y: 10 });
  */
  scoreData.push({
		type: "stackedColumn",
		name: "Black",
		//showInLegend: "true",
		//yValueFormatString: "#",
		dataPoints: [{ x: 10, y: black_score }]
	});
  scoreData.push({
		type: "stackedColumn",
		name: "White",
		//showInLegend: "true",
		//yValueFormatString: "#",
		dataPoints: [{ x: 10, y: white_score }]
	});
	scoreData.shift();
	scoreData.shift();
  
  /*
  if(black_data.length > 1)
  if(white_data.length > 1)
    */
  
  console.log("White score:" + white_score);
  console.log("Black score:" + black_score);
  //console.log("Score Data:" + scoreData.dataPoints.x);
	chart.render();
};

updateChart();
setInterval(function(){updateChart()}, updateInterval);

}


async function endGame() {
    await sleep(750);
    alert('Game over');
    //const response = await fetch('http://127.0.0.1:8000/graph1?s=' + window.movelist);
    renderMoveHistory(window.gameHistory);
    console.log("Final movelist: " + window.movelist);
    
    //atul response url
    window.atulResponse = "https://1ee9a8602b914e199f82026e0b9fea53.app.rstudio.cloud/p/5bec0ace/";

    //dosa response url
    window.dosaResponse = "https://d0b4494cbd9d409daca037a968eef0ed.app.rstudio.cloud/p/4aaca203/";

    //booms response url
    window.boomsResponse = "https://1623749431304f59831478358796d62c.app.rstudio.cloud/p/9945934a/";

    //moan response url
    window.moanResponse = "https://b627558d7659494ca4b63f422fc84756.app.rstudio.cloud/p/b5fb76e8/";
    

    const url1 = window.atulResponse + "graph1?s=" + encodeURIComponent(window.movelist);
    console.log(url1);

    var wnd1 = window.open(url1, "_blank", "wnd1", "width=100, height=100");
    //wnd1.resizeTo(0,0); 
    await sleep(500);
    //wnd1.body.addEventListener('load', wnd1.close(), true);
    //await sleep(100);

    const url2 = window.atulResponse + "graph2?s=" + encodeURIComponent(window.movelist);
    console.log(url2);
    var wnd2 = window.open(url2, "_blank", "wnd2", "width=100, height=100");
    //wnd2.resizeTo(0,0); 
    await sleep(6000);
    //await sleep(100);

    const url3 = window.atulResponse + "graph3?s=" + encodeURIComponent(window.movelist);
    console.log(url3);
    var wnd3 = window.open(url3, "_blank", "wnd3", "width=100, height=100");
    //wnd3.resizeTo(0,0); 
    await sleep(600);

    const url4 = window.atulResponse + "graph4?s=" + encodeURIComponent(window.movelist);
    console.log(url4);
    var wnd4 = window.open(url4, "_blank", "wnd4", "width=100, height=100");
    await sleep(50);

    wnd4.close();
    wnd3.close();
    wnd2.close();
    wnd1.close();


    //atul ka src
    window.atulGraphSrc = "https://1ee9a8602b914e199f82026e0b9fea53.app.rstudio.cloud/file_show?path=%2Fcloud%2Fproject%2F";

    //dosa ka src
    window.dosaGraphSrc = "https://d0b4494cbd9d409daca037a968eef0ed.app.rstudio.cloud/file_show?path=%2Fcloud%2Fproject%2F";

    //booms ka src
    window.boomsGraphSrc = "https://1623749431304f59831478358796d62c.app.rstudio.cloud/file_show?path=%2Fcloud%2Fproject%2F";

    //moan ka src
    window.moanGraphSrc = "https://b627558d7659494ca4b63f422fc84756.app.rstudio.cloud/file_show?path=%2Fcloud%2Fproject%2F";

    graphs = ["bubblechart.png", "linechart.png", "piechart.png", "openingschart.png"]

    var carouselLinks = $("#carouselGraphLinks").empty();
    var carouselElements = $("#carouselGraphViewer").empty();
    for (var i = 0; i < graphs.length; i++) {
        carouselLinks.append(`
              <li data-target="#postGameGraphsCarousel" data-slide-to="` + i + `" ` + (i == 0 ? 'class="active"' : "") + `></li>
            `);

        carouselElements.append(`
              <div class="carousel-item ` + (i == 0 ? "active" : "") + `">
                  <img id="postGameGraph" class="d-block w-100 px-1" src="` + window.atulGraphSrc + graphs[i] + `&q=` + Math.floor((Math.random() * 100) + 1) + `" alt="Bubble Chart">
              </div>
            `);
    }

    $('#post-game').show();
    $('#newGameBtn2').show();
  //var fen = game.fen();
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
    window.gameHistory = game.history();
    renderMoveHistory(window.gameHistory);
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