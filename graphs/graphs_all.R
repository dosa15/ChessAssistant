library(ggplot2)
library(stockfish)
library(chess)
library(bigchess)
library(rchess)
require(magrittr)
library(tidyverse)


bubblechart <- function (s) {
  #print(s)
  movelist<- strsplit(s,split = ",")
  #print(movelist)
  queen=0
  knight=0
  bishop=0
  rook=0
  pawn=0
  
  o <- 0
  num_moves <- length(movelist[[1]])
  for (i in movelist[[1]]) {
    for (j in i) {
      o <- o+1
      if(o %% 2 == 0) next      # consider only the moves made by user
      
      temptext=substring(j,1,1)
      if(temptext=="N")
        knight <- knight+1
      else if(temptext=="B")
        bishop <- bishop+1
      else if(temptext=="Q")
        queen <- queen+1
      else if(temptext=="R")
        rook <- rook+1
      else
        pawn <- pawn+1
    }
    
  }
  print(queen)
  print(knight)
  print(bishop)
  print(rook)
  print(pawn)
  
  pieces <- as.factor(c("Queen", "Knight", "Bishop", "Rook", "Pawn"))
  moves_per_piece <- c(queen, knight, bishop, rook, pawn)
  chessTest <- data.frame(pieces, moves_per_piece)
  p1 <- ggplot(chessTest) + 
    geom_point(aes(x=pieces, y=moves_per_piece, size = moves_per_piece, color= pieces, label=moves_per_piece)) +
    geom_text(aes(pieces, moves_per_piece, label = paste(c("Queen", "Knight", "Bishop", "Rook", "Pawn"), rep('\n', length(pieces)), moves_per_piece)), hjust=0.5, vjust=0.5) +
    ggtitle("Number of Moves per Individual Piece") +
    ylim(0, max(c(queen, knight, bishop, rook, pawn))+5) + 
    scale_size(range = c(ifelse(num_moves/10 < 10, 10, num_moves/10), ifelse(num_moves > 60, 60, num_moves))) + 
    theme(axis.title.x=element_blank(), axis.text.x=element_blank(), #axis.ticks.x=element_blank(), 
          axis.title.y =element_blank(), axis.text.y=element_blank(), #axis.ticks.y=element_blank(),
          plot.margin = margin(t=0.5, r=3, b=0.5, l=3, unit = "cm"),
          #legend.key.size = unit(0.2,"cm"), legend.key.width = unit(0.5,"cm"), legend.margin = margin(t=0.5,r=0.5,b=0.5,l=0.5,unit = "mm"),
          legend.position = "none",
          panel.grid.major = element_blank(),panel.grid.minor = element_blank()
    )
  # save_loc <- "../www/img/bubblechart.png"
  save_loc <- "bubblechart.png"
  print(save_loc)
  ggsave(save_loc, plot = p1)
}


linechart <- function(s){
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
}


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
#s<-"e4,Nf6,f3,d5,Qe2,Nc6,Qd3,e6,e5,Nb4,Qc3,d4,Qb3,Nfd5,Bb5+,Bd7,Bc4,Nf4,Qxb4,Bxb4,c3,Bc5,d3,Nxd3+,Kd1,Nxc1,Kxc1,Qg5+,f4,Qxg2,Ne2,Qxh1+,Ng1,Qxg1+,Kc2,Qxh2+,Kc1,Qxf4+,Kc2,Qf2+,Kd1,Ba4+,b3,Qf3+,Kc2,dxc3,bxa4,Rd8,Nxc3,Qf5+,Bd3,Qxe5,Re1,Qh2+,Re2,Qf4,Rd2,Ke7,a5,Rd6,a6,bxa6,a4,Rhd8,a5,Rxd3,Rxd3,Rxd3,Kxd3,Qd4+,Kc2,f5,Kb3,f4,Ne2,Qd3+,Nc3,f3,Kb2,f2,Nd1,Qxd1"
#bubblechart(s)
