library(ggplot2)

#* @param s The movelist to parse
#* @get /graph1
function(s){
  #print(s)
  movelist<- strsplit(s,split = ",")
  #print(movelist)
  queen=0
  knight=0
  bishop=0
  rook=0
  pawn=0
  for (i in movelist) {
    for (j in i) {
      temptext=substring(j,1,1)
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
   
  }
  print(queen)
  print(knight)
  print(bishop)
  print(rook)
  print(pawn)
  
  pieces <- as.factor(c("Queen", "Knight", "Bishop", "Rook", "Pawn"))
  moves_per_piece <- c(queen,knight, bishop, rook, pawn)
  chessTest <- data.frame(pieces, moves_per_piece)
  p1 <- ggplot(chessTest) + 
    geom_point(aes(x=pieces, y=moves_per_piece, size = moves_per_piece,color= pieces)) +
    ylim(0,50)+ scale_size(range = c(10,18))+theme(axis.title.x=element_blank(), axis.text.x=element_blank(), axis.ticks.x=element_blank(), 
                                                   axis.title.y =element_blank(), axis.text.y=element_blank(), axis.ticks.y=element_blank(),
                                                   plot.margin = margin(t=0.5, r=5, b=0.5, l=5, unit = "cm"),
                                                   legend.key.size = unit(0.05,"cm"), legend.key.width = unit(0.1,"cm"), legend.margin = margin(t=0.5,r=0.1,b=0.5,l=0.1,unit = "mm"),
                                                   panel.grid.major = element_blank(),panel.grid.minor = element_blank())
  ggsave("www/img/bubblechart.png", plot = p1)
}
#s<-"e4,Nf6,f3,d5,Qe2,Nc6,Qd3,e6,e5,Nb4,Qc3,d4,Qb3,Nfd5,Bb5+,Bd7,Bc4,Nf4,Qxb4,Bxb4,c3,Bc5,d3,Nxd3+,Kd1,Nxc1,Kxc1,Qg5+,f4,Qxg2,Ne2,Qxh1+,Ng1,Qxg1+,Kc2,Qxh2+,Kc1,Qxf4+,Kc2,Qf2+,Kd1,Ba4+,b3,Qf3+,Kc2,dxc3,bxa4,Rd8,Nxc3,Qf5+,Bd3,Qxe5,Re1,Qh2+,Re2,Qf4,Rd2,Ke7,a5,Rd6,a6,bxa6,a4,Rhd8,a5,Rxd3,Rxd3,Rxd3,Kxd3,Qd4+,Kc2,f5,Kb3,f4,Ne2,Qd3+,Nc3,f3,Kb2,f2,Nd1,Qxd1"
#graph1(s)
