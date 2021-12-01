library(stockfish)
library(chess)
library(bigchess)
library(rchess)
require(magrittr)
library(tidyverse)

bestmovepredict <- function(moves){
  
  movesaf<- strsplit(moves,split = ",")
  initmoves<-c()
  new_game<-Chess$new()
  bestmoves=c()
  playermoves=c()
  
  
  
  for (i in 1:length(movesaf[[1]])) {
    if(i<5){
      new_game$move(movesaf[[1]][i])
      bestmoves<- c(bestmoves,movesaf[[1]][i])
      playermoves<-c(playermoves,movesaf[[1]][i])
    }
    else{
      new_game$move(movesaf[[1]][i])
      engine<- fish$new()
      engine$process
      engine$position(new_game$fen())
      m<-engine$go()
      if(m!="bestmove (none)"){
        m<-substr(m,10,13)
        m<-lan2san(m)
      }
      else{
        break
      }
      
      bestmoves<- c(bestmoves,m)
      playermoves<-c(playermoves,movesaf[[1]][i])
      engine$quit()
    }
  }
  #print(bestmoves)
  #print(playermoves)
  countbest=0
  for (i in 5:length(bestmoves)) {
    #ap<-analyze_position(engine = "C:/Users/rohit/Downloads/stockfish_14.1_win_x64_avx2/stockfish_14.1_win_x64_avx2.exe",san = m,depth= 6)
    ap <- analyze_position(engine = "/Applications/Stockfish.app/Contents/MacOS/Stockfish", san = m, depth = 6)
    print(ap$score)
    if(playermoves[i]==substr(bestmoves[i],4,nchar(bestmoves[i]))){
      # print(substr(bestmoves[i],4,nchar(bestmoves[i])))
      #print(i)
      countbest=countbest+1
    }
  }
  # print(countbest)
  countworst= length(playermoves)-countbest
  bvsw<-c(countbest,countworst)
  png(file="D:/college/datavisualization/project/ChessAssistant/www/img/barchart.png")
  barplot(bvsw,names.arg=c("best moves", "worst moves"),xlab = "Moves type", ylab = "Count", main = "Bargraph showing best moves vs worst moves in a game of chess")
  dev.off()
}
s="e4,e5,Nf3,Nc6,Nc3,d6,d4,b5,dxe5,dxe5,Nxb5,a6,Nxe5,Nxe5,Qxd8+,Kxd8,Bf4,Ng4,f3,Bb4+,c3,Ne3,cxb4,Nc2+,Kd1,Nxa1,Nc3,Be6,Be5,Bxa2,Bxg7,Bb3+,Kd2,Rc8,Bxa6,Nc2,Bxc8,Kxc8,Bxh8,Ne7,Bf6,Nc6,Nd5,N6xb4,Nxb4,c5,Nxc2,Bc4,Rc1,Bb3,Na3,c4,Rxc4+,Bxc4,Nxc4,h5,Ne5,h4,Nxf7,h3,gxh3,Kd7,h4,Ke6,h5,Kxf6,h6,Kxf7,h7,Kg7,b4,Kxh7,b5,Kg8,b6,Kf8,b7,Ke8,b8=Q+,Kd7,Qb6,Kc8,e5,Kd7,f4,Ke7,h4,Kd7,f5,Ke7,h5,Kf7,h6,Kg8,f6,Kh7,e6,Kxh6,e7,Kh7,e8=Q,Kh6,f7+,Kg7,f8=Q+,Kh7,Kc1"
bestmovepredict(s)
