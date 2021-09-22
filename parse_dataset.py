import chess.pgn
import sys
import xlsxwriter
import pandas as pd

pgn = open('games/'+sys.argv[1])


movelist = list()
totalMovesList = list(list())

game = chess.pgn.read_game(pgn)
import time
while game is not None:
    white = game.headers["White"]
    black = game.headers["Black"]
    datePlayed = game.headers["Date"]
    winner = "White" if game.headers["Result"][0] == '1' else "Black"
    timeControl = game.headers["TimeControl"]
    opening = game.headers["Opening"]
    event = game.headers["Event"]
    blackElo = game.headers["BlackElo"]
    whiteElo = game.headers["WhiteElo"]
    termination = game.headers["Termination"] 
    variant = game.headers["Variant"]
    

    detailsList = [white, black, datePlayed, winner, timeControl, opening, blackElo, whiteElo, termination, variant]
    moveString = ""
    for move in game.mainline():
        #detailsList.append(move.san())
        movelist.append(move.san())
        moveString += move.san() + " "
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
    
    # print("White: ", white)
    # print("Black: ", black)
    # print("Time Control: ", timeControl)
    # print("Date: ", datePlayed)
    # print("Winner: ", winner)
    # print("Opening: ", opening)
    # print('\t'.join(movelist))
    
    # totalMovesList.append(movelist)
    detailsList.append(moveString)
    print(detailsList)
    
    #Below code printed each value of the list in a different row so manually wrote each value in columns(see next snippet)
    # with xlsxwriter.Workbook('test.xlsx') as workbook:
    #     worksheet = workbook.add_worksheet()
    #     for row_num, data in enumerate(detailsList):
    #         worksheet.write_row(row_num, 0, data)
    
    #writes pgn file in a row, next functionality to be added - write every pgn file in the games directory in a different row, 
    #below snippet will only continue writing in 0th row
    with xlsxwriter.Workbook('test.xlsx') as workbook:
        column = 0
        worksheet = workbook.add_worksheet()
        for data in detailsList:
            worksheet.write(0, column, data)
            column += 1

        
    break 


#dont mind this 
# df = pd.DataFrame(detailsList, columns = ["white", "black", "datePlayed", "winner", "timeControl", "opening", "blackElo", "whiteElo", "termination", "variant", "moves"])
# df.to_excel("pandasTest.xlsx", index = False)
