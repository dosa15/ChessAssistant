import chess
from chess import pgn
import chess.pgn
import sys, time
import xlsxwriter
import pandas as pd
import csv
import hashlib

pgn = open('games/'+sys.argv[1])

with xlsxwriter.Workbook('test.xlsx') as workbook, open("ChessDataset.csv", "a") as chessDataset:
    worksheet = workbook.add_worksheet()
    xlsxRow = 0
    
    gameIDList = pd.read_csv("ChessDataset.csv", usecols=["Game ID"])
    # print(gameIDList)
    gameIDList = list(gameIDList["Game ID"])
    
    csv_writer = csv.writer(chessDataset)
    csv_reader = csv.reader(chessDataset)
    # if csv_reader.line_num == 0:
        # csv_writer.writerow(["Game ID", "White", "Black", "Date of Game", "Winner", "Time Control", "Opening", "Black ELO", "White ELO", "Termination", "Variant", "Game Movelist"])
    
    game = chess.pgn.read_game(pgn)
    while game is not None:
        movelist = list()
        moveString = ""
        for move in game.mainline():
            movelist.append(move.san())
            moveString += move.san() + " "
        
        gameID = hashlib.sha1(','.join(movelist).encode("utf-8"))

        if gameID.hexdigest() in gameIDList:
            game = chess.pgn.read_game(pgn)
            continue

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
        

        detailsList = [gameID.hexdigest(), white, black, datePlayed, winner, timeControl, opening, blackElo, whiteElo, termination, variant]
        # print("White: ", white)
        # print("Black: ", black)
        # print("Time Control: ", timeControl)
        # print("Date: ", datePlayed)
        # print("Winner: ", winner)
        # print("Opening: ", opening)
        # print('\t'.join(movelist))
        
        
        # Below code printed each value of the list in a different row so manually wrote each value in columns(see next snippet)
        # with xlsxwriter.Workbook('test.xlsx') as workbook:
        #     worksheet = workbook.add_worksheet()
        #     for row_num, data in enumerate(detailsList):
        #         worksheet.write_row(row_num, 0, data)
        
        # writes pgn file in a row, next functionality to be added - write every pgn file in the games directory in a different row, 
        # below snippet will only continue writing in 0th row
        if len(sys.argv) <= 2:
            detailsList.append(moveString)
            xlsxColumn = 0
            for data in detailsList:
                worksheet.write(xlsxRow, xlsxColumn, data)
                xlsxColumn += 1
            xlsxRow += 1
        
        # Write the pgn file in CSV format. To use this file format instead of XLSX,
        # provide any random character after the pgn file name during program execution
        else:
            detailsList.append(','.join(movelist))            
            csv_writer.writerow(detailsList)
            
        print(detailsList)
        game = chess.pgn.read_game(pgn)


    # dont mind this # porke
    # df = pd.DataFrame(detailsList, columns = ["white", "black", "datePlayed", "winner", "timeControl", "opening", "blackElo", "whiteElo", "termination", "variant", "moves"])
    # df.to_excel("pandasTest.xlsx", index = False)
