library(stockfish)
library(chess)
library(bigchess)
library(rchess)
require(magrittr)
library(tidyverse)

piechart <- function(s){

  playermoves<-c()
  good=0
  bad=0
  neutral=0
  movesaf<- strsplit(s,split = ",")
  for (i in movesaf[[1]]) {
    try(playermoves<-c(playermoves,san2lan(i)),silent = TRUE)
    
  }
  for (i in playermoves) {
    print(i)
    pp<-analyze_position(engine = "C:/Users/rohit/Downloads/stockfish_14.1_win_x64_avx2/stockfish_14.1_win_x64_avx2.exe",lan = i,depth=10)
    
    if(pp$score>35)
      good=good+1
    else if(pp$score<35)
      bad=bad+1
    else
      neutral=neutral+1
    #print(pp$bestmove_lan)
  }
  
  good
  bad
  neutral
  x<- c(good, bad,neutral)
  labels<-c(good,bad,neutral)
  png(file="D:/college/datavisualization/project/ChessAssistant/www/img/piechart.png")
  pie(x,labels)
  legend("topleft", legend = c("Good Moves", "Bad Moves", "Neutral Moves"),
         fill =  c("white", "lightblue", "mistyrose"))
  dev.off()
}