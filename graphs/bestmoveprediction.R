library(stockfish)
library(chess)
library(bigchess)
library(rchess)

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
      m<-substr(m,10,13)
      m<-lan2san(m)
      m<-substr(m,4,nchar(m))
      if(m[1]=="x"){
        m<-substr(m,2,nchar(m))
      }
      bestmoves<- c(bestmoves,m)
      playermoves<-c(playermoves,movesaf[[1]][i])
      engine$quit()
    }
  }
  print(bestmoves)
  print(playermoves)
  countbest=0
  for (i in 4:length(playermoves)) {
    if(playermoves[i]==bestmoves[i]){
      countbest=countbest+1
    }
  }
  print(countbest)
  countworst= length(playermoves)-countbest
  bvsw<-c(countbest,countworst)
  barplot(bvsw,names.arg=c("best moves", "worst moves"),xlab = "Moves type", ylab = "Count", main = "Bargraph showing best moves vs worst moves in a game of chess")
}
s="e4,Nf6,f3,d5,Qe2,Nc6,Qd3,e6,e5,Nb4,Qc3,d4,Qb3,Nfd5,Bb5+,Bd7,Bc4,Nf4,Qxb4,Bxb4,c3,Bc5,d3,Nxd3+,Kd1,Nxc1,Kxc1,Qg5+,f4,Qxg2,Ne2,Qxh1+,Ng1,Qxg1+,Kc2,Qxh2+,Kc1,Qxf4+,Kc2,Qf2+,Kd1,Ba4+,b3,Qf3+,Kc2,dxc3,bxa4,Rd8,Nxc3,Qf5+,Bd3,Qxe5,Re1,Qh2+,Re2,Qf4,Rd2,Ke7,a5,Rd6,a6,bxa6,a4,Rhd8,a5,Rxd3,Rxd3,Rxd3,Kxd3,Qd4+,Kc2,f5,Kb3,f4,Ne2,Qd3+,Nc3,f3,Kb2,f2,Nd1,Qxd1"
bestmovepredict(s)