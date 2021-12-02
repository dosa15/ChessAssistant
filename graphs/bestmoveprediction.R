library(stockfish)
library(chess)
library(bigchess)
library(rchess)
require(magrittr)
library(tidyverse)
library(ggplot2)

moves<-"d4,d5,Nf3,Nc6,Bf4,e6,c4,dxc4,e4,Bd6,Bxd6,Qxd6,Bxc4,Qb4+,Nbd2,Qxb2,O-O,Qa3,Nb3,Qb4,Qd3,Bd7,Nc5,b6,Na6,Qe7,Nxc7+,Kd8,Nxa8,Nf6,Rac1,Qd6,e5,Qb8"

  movesaf<- strsplit(moves,split = ",")
  initmoves<-c()
  new_game<-Chess$new()
  bestmoves=c()
  playermoves=c()
  
  for (i in 1:length(movesaf[[1]])) {
    new_game$move(movesaf[[1]][i])
    engine<- fish$new()
    engine$process
    engine$position(new_game$fen())
    m<-engine$go()
    if(m!="bestmove (none)"){
      m<-substr(m,10,13)
      #m<-lan2san(m)
    bestmoves<- c(bestmoves,m)
    engine$quit()
    }
  }
  bestmoves
  
  lanplayermoves<-c()
  for (i in movesaf[[1]]) {
    try(lanplayermoves<-c(lanplayermoves,san2lan(i)),silent= TRUE)
  }
  scores<-c()
  for (i in lanplayermoves) {
    sp<-analyze_position(engine = "C:/Users/rohit/Downloads/stockfish_14.1_win_x64_avx2/stockfish_14.1_win_x64_avx2.exe",lan = i,depth=10)
    scores<-c(scores,sp$score)
    #print(sp$curpos_lan)
  }
  scoresbest<-c()
  for (i in bestmoves) {
    sp<-analyze_position(engine = "C:/Users/rohit/Downloads/stockfish_14.1_win_x64_avx2/stockfish_14.1_win_x64_avx2.exe",lan = i,depth=10)
    scoresbest<-c(scoresbest,sp$score)
    #print(sp$curpos_lan)
  }
  numberbest<- c(1:length(bestmoves))
  #labels <- c("Text 1", "Text 2", "Text 3", "Text 4", "Text 5")
  png(file="D:/college/datavisualization/project/ChessAssistant/www/img/linechart.png")
  numberOfgames<-c(1:length(lanplayermoves))
  plot(numberOfgames,scores,type="l")
  lines(numberbest,scoresbest,type="l",col=2)
  dev.off()

