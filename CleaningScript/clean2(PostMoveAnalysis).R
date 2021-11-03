chess1<-read.csv("D:/college/datavisualization/project/ChessAssistant/CleanedChessDataset.csv")
moves <- data.frame(Queen=integer(),
                  Knight=integer(),
                  Bishop=integer(),
                  Rook=integer(),
                  Pawn=integer(),
                  stringsAsFactors=FALSE)
for (i in chess1$Game.Movelist) {
  chess2<-strsplit(i,split = ",")
  for (j in chess2) {
    queen=0
    knight=0
    bishop=0
    rook=0
    pawn=0
    for (k in j) {
      temptext=substring(k,1,1)
      if(temptext=="N")
        knight=knight+1
      else if(temptext=="B")
        bishop=bishop+1
      else if(temptext=="Q")
        queen=queen+1
      else if(temptext=="R")
        rook=rook+1
      else
        pawn=pawn+1
      
    }
    #print("Queens moves")
    #print(queen)
    #print("Knight moves")
    #print(knight)
    #print("Bishop moves")
    #print(bishop)
    #print("Rook moves")
    #print(rook)
    #print("Pawn movess")
    #print(pawn)
    moves[nrow(moves) + 1,] = c(queen,knight,bishop,rook,pawn)
  }
}
chess1$Queen<-moves$Queen
chess1$Knight<-moves$Knight
chess1$Bishop<-moves$Bishop
chess1$Rook<-moves$Rook
chess1$Pawn<-moves$Pawn
chess1

write.csv(chess1,"D:/college/datavisualization/project/ChessAssistant/clean_ds_post_move_analysis.csv")