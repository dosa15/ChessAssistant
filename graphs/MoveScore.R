library(stockfish)
library(chess)
library(bigchess)
library(rchess)
require(magrittr)
library(tidyverse)

playermoves<-c()
good=0
bad=0
neutral=0
movestemp="e4,e6,f3,Bd6,h3,Nh6,Qe2,Bg3+,Kd1,Bh4,g3,Bxg3,Qg2,Qg5,h4,Qf4,Rh3,Bxh4,Qxg7,Bf6,Ne2,Qe5,Rh5,Qxh5,Qxf6,Qh1,Qxh8+,Ke7,Ng3,Qxf3+,Be2,Qxg3,d3,Qg1+,Kd2,Qg5+,Kd1,Qg1+,Kd2,Ng4,b3,Nf2,Ba3+,d6,Qxc8,Qg5+,Ke1,Qg1+,Kd2,Nxe4+,dxe4,Qd4+,Bd3,Qxa1,Qxc7+,Nd7,Qxd6+,Kd8,Bb5,Qd4+,Qxd4,Kc8,Qxd7+,Kb8,Bd6#"
movesaf<- strsplit(movestemp,split = ",")
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
