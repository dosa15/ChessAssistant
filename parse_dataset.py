import chess.pgn
import sys

pgn = open(sys.argv[1])

# first_game = chess.pgn.read_game(pgn)

# print(first_game, end="\n\n")

# board = first_game.board()

# first = first_game.next()
# print(first)

movelist = list()

game = chess.pgn.read_game(pgn)
import time
while game is not None:
    # print(game.headers)
    white = game.headers["White"]
    black = game.headers["Black"]
    date_played = game.headers["Date"]
    winner = "White" if game.headers["Result"][0] == '1' else "Black"
    time_control = game.headers["TimeControl"]
    opening = game.headers["Opening"]

    for move in game.mainline():
        movelist.append(move.san())
        # white_move = move[:2]
        # black_move = move[2:]    
        # if white:
        #     print(str(move)[2:], end='\t')
        # else:
        #     print(str(move)[2:])
        # white = not white
        # print(white_move, black_move)
        
        # board.push(move)
        # print(board, end="\n\n")
    print("White: ", white)
    print("Black: ", black)
    print("Time Control: ", time_control)
    print("Date: ", date_played)
    print("Winner: ", winner)
    print("Opening: ", opening)
    print('\n'.join(movelist))
    game = chess.pgn.read_game(pgn)
    break 