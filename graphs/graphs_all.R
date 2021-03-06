# This file must be run asynchronously in another platform like RStudio Cloud

library(ggplot2)
library(chess)
library(rchess)
library(bigchess)
library(stockfish)
library(stringr)
library(treemapify)
library(scales)

engine_path <- "stockfish_14.1_linux_x64/stockfish_14.1_src/src/stockfish"

#* @filter cors
cors <- function(res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  plumber::forward()
}

#* @param s The movelist to parse
#* @get /graph1
graph1 <- function (s) {
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
  moves_per_piece <- c(queen,knight, bishop, rook, pawn)
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
  save_loc <- "bubblechart.png"
  print(save_loc)
  ggsave(save_loc, plot = p1)
}
#s<-"e4,Nf6,f3,d5,Qe2,Nc6,Qd3,e6,e5,Nb4,Qc3,d4,Qb3,Nfd5,Bb5+,Bd7,Bc4,Nf4,Qxb4,Bxb4,c3,Bc5,d3,Nxd3+,Kd1,Nxc1,Kxc1,Qg5+,f4,Qxg2,Ne2,Qxh1+,Ng1,Qxg1+,Kc2,Qxh2+,Kc1,Qxf4+,Kc2,Qf2+,Kd1,Ba4+,b3,Qf3+,Kc2,dxc3,bxa4,Rd8,Nxc3,Qf5+,Bd3,Qxe5,Re1,Qh2+,Re2,Qf4,Rd2,Ke7,a5,Rd6,a6,bxa6,a4,Rhd8,a5,Rxd3,Rxd3,Rxd3,Kxd3,Qd4+,Kc2,f5,Kb3,f4,Ne2,Qd3+,Nc3,f3,Kb2,f2,Nd1,Qxd1"
#graph1(s)

#* @param s The movelist to parse
#* @get /graph2
graph2 <- function(s){
  movesaf<- strsplit(s,split = ",")
  #bc_moves <- c()
  #for(i in 1:length(movesaf[[1]])) {
  #  bc_move <- ""
  #  mno <- as.integer(i/2) + ifelse(i%%2 == 0, 0, 1)
  #  if(i%%2 != 0) {
  #    bc_move <- paste(c(mno, ". ", movesaf[[1]][i]), collapse = "")
  #  } else {
  #    bc_move <- paste(c(mno, ". ", movesaf[[1]][i-1], " ", movesaf[[1]][i]), collapse = "")
  #  }
  #  bc_moves <- c(bc_moves, bc_move)
  #}
  #print(bc_moves)
  initmoves<-c()
  new_game<-Chess$new()
  #best_game <- Chess$new()
  #best_game$move(movesaf[[1]][1])
  bestmoves=c()
  playermoves=c()
  
  stockfish_engine<- fish$new()
  stockfish_engine$process
  for (i in 1:length(movesaf[[1]])) {
    new_game$move(movesaf[[1]][i])
    #if(i == 1) bestmoves <- c(bestmoves, san2lan(movesaf[[1]][i]))
    stockfish_engine$position(new_game$fen())
    m<-stockfish_engine$go()
    if(m!="bestmove (none)"){
      m<-substr(m,10,13)
      #best_game$move(m)
      #m<-lan2san(m)
      #bestmoves<- c(bestmoves, tail(best_game$history(), n=1))
      bestmoves<- c(bestmoves, m)
    }
  }
  stockfish_engine$quit()
  bestmoves
  
  lanplayermoves<-c()
  for (i in movesaf[[1]]) {
    try(lanplayermoves<-c(lanplayermoves,san2lan(i)),silent= TRUE)
  }
  
  scores<-c()
  for (i in lanplayermoves) {
    #sp<-analyze_position(engine = "C:/Users/rohit/Downloads/stockfish_14.1_win_x64_avx2/stockfish_14.1_win_x64_avx2.exe",lan = i,depth=10)
    sp<-analyze_position(engine = engine_path,lan = i,depth=10)
    scores<-c(scores,sp$score)
    #print(sp$curpos_lan)
  }
  scoresbest<-c()
  for (i in bestmoves) {
    #sp<-analyze_position(engine = "C:/Users/rohit/Downloads/stockfish_14.1_win_x64_avx2/stockfish_14.1_win_x64_avx2.exe",lan = i,depth=10)
    sp<-analyze_position(engine = engine_path,lan = i,depth=10)
    scoresbest<-c(scoresbest,sp$score)
    #print(sp$curpos_lan)
  }
  numberbest<- c(1:length(bestmoves))
  #labels <- c("Text 1", "Text 2", "Text 3", "Text 4", "Text 5")
  
  #png(file="D:/college/datavisualization/project/ChessAssistant/www/img/linechart.png")
  #png("linechart.png")
  #numberOfgames<-c(1:length(lanplayermoves))
  #plot(numberOfgames,scores,type="l")
  #lines(numberbest,scoresbest,type="l",col=2)
  #dev.off()
  
  mno <- c()
  if(length(scoresbest) - length(scores) > 0) {
    scores <- c(rep(NA, length(scoresbest) - length(scores)), scores)
    mno <- c(1:length(scoresbest))
  } else {
    scoresbest <- c(scoresbest, rep(NA, length(scores) - length(scoresbest)))
    mno <- c(1:length(scores))
  }
  
  line_data <- data.frame(mno, Player = scores, Engine = scoresbest)
  print(line_data)
  p1 <- ggplot(line_data, aes(x = mno)) +
    xlab("Move number") + 
    ylab("Move score") +
    geom_line(aes(y = Player), color = "darkred") + 
    #geom_label(label=rownames(data), nudge_x = 0.25, nudge_y = 0.25, check_overlap = T) +
    geom_line(aes(y = Engine), color = "darkblue")
  #geom_label(label=rownames(data), nudge_x = 0.25, nudge_y = 0.25, check_overlap = T)
  scale_colour_manual("Legend", breaks = c("Player", "Engine"), values = c("darkred", "darkblue"))
  save_loc <- "linechart.png"
  print(save_loc)
  ggsave(save_loc, plot = p1)
}


#* @param s The movelist to parse
#* @get /graph3
graph3 <- function(s){
  
  playermoves<-c()
  good=0
  bad=0
  neutral=0
  movesaf<- strsplit(s,split = ",")
  for (i in movesaf[[1]]) {
    try(playermoves<-c(playermoves,san2lan(i)), silent = TRUE)
  }
  for (i in playermoves) {
    #print(i)
    #pp<-analyze_position(engine = "C:/Users/rohit/Downloads/stockfish_14.1_win_x64_avx2/stockfish_14.1_win_x64_avx2.exe",lan = i,depth=10)
    pp<-analyze_position(engine = engine_path,lan = i,depth=10)
    #print(pp$score)
    if(pp$score>35)
      good=good+1
    else if(pp$score<35)
      bad=bad+1
    else
      neutral=neutral+1
    #print(pp$bestmove_lan)
  }
  
  cat("good", good)
  cat("bad", bad)
  cat("neutral", neutral)
  x<- c(good, bad,neutral)
  labels<-c(good,bad,neutral)
  png(file="piechart.png")
  pie(x,labels)
  legend("topleft", legend = c("Good Moves", "Bad Moves", "Neutral Moves"),
         fill =  c("white", "lightblue", "mistyrose"))
  dev.off()
}


#* @param s The movelist to parse
#* @get /graph4
graph4<- function(s){
  movesaf<- strsplit(moves,split = ",")
  lanmoves<-c()
  
  
  for (i in movesaf[[1]]) {
    lanmoves<-c(lanmoves,san2lan(i))
  }
  lanmoves
  lanstring<-toString(lanmoves)
  lanstring
  temppsan<- lan2san(lanstring)
  count<-0
  temppos<-0
  tempsplit<-strsplit(temppsan,split = '')
  for (i in 1:length(tempsplit[[1]])) {
    if(tempsplit[[1]][i]==' '){
      count=count+1
      if(count==5){
        temppos<-i
        break
      }
      
    }
    
  }
  temppos<-temppos-1
  browse_opening(FirstTwoMoves,substr(temppsan,1,temppos))
}

#* @param s The movelist to parse
#* @get /graph5
graph5 <- function(s) { 
  playerOpening = "You played a novel game!"
  
  data("chessopenings")
  chessopenings <- data.frame(chessopenings)
  moves <- strsplit(s, split = ",")[[1]]
  
  format_moves <- function(moves) {
    formatted_moves <- ""
    for(m in 1:ifelse(length(moves) > 7, 7, length(moves))) {
      mno <- as.integer(m/2 + 1)
      if (m %% 2 != 0)
        formatted_moves <- paste(c(formatted_moves, " ", as.character(mno), ". ", moves[m]), collapse = "")
      else
        formatted_moves <- paste(c(formatted_moves, " ", moves[m]), collapse = "")
    }
    formatted_moves <- substr(formatted_moves, 2, nchar(formatted_moves))
    return(formatted_moves)
  }
  
  formatted_moves <- format_moves(moves)
  
  while(length(moves) > 0) {
    if(nrow(chessopenings[chessopenings$pgn == formatted_moves,]) > 0) {
      playerOpening = chessopenings[chessopenings$pgn == formatted_moves,]$name
      break
    }
    moves <- moves[1:length(moves)-1]
    formatted_moves <-format_moves(moves)
  }
  
  unique_openings <- c("Alekhine", "Benko/Volga", "Benoni", "Bird", "Bishop", "Black Knights", "Blumenfeld", "Budapest", "Caro-Kann", "Catalan", "Center", "Colle", "Czech", "Danish", "Dutch", "Elephant", "English", "Evans", "Falkbeer", "Fianchetto", "Four Knights", "French", "Giuoco", "Goring", "Grunfeld", "Hungarian", "Italian", "King", "Latvian", "London", "Modern", "Nimzowitsch-Larsen", "Indian", "Open games", "Petroff", "Philidor", "Pirc", "Ponziani", "Queen", "Reti", "Ruy", "Scandinavian", "Scotch", "Sicilian", "Slav", "Tarrasch", "Tartakower", "Three Knights", "Torre", "Trompowsky", "Two Knights", "Unusual", "Veresov", "Vienna")
  unique_openings_count <- rep(0, length(unique_openings))
  flag <- FALSE
  for(O in chessopenings[order(chessopenings$name),]$name) {
    if(O == playerOpening) flag = TRUE
    for(i in 1:length(unique_openings)) {
      if(sjmisc::str_contains(O, unique_openings[i])) {
        unique_openings_count[i] <- unique_openings_count[i] + 1
        if(flag) {
          playerOpening <- unique_openings[i]
          flag <- FALSE
        }
      }
    }
  }
  if(!flag) playerOpening <- "Other Openings"
  
  temp_openings <- data.frame(unique_openings, unique_openings_count)
  names(temp_openings) <- c("Name", "Frequency")
  openings <- temp_openings
  openings$Name <- as.character(openings$Name)
  openings[nrow(openings)+1,] <- c("Other Openings", sum(openings[openings$Frequency <= 10,]$Frequency))
  openings$Frequency <- as.integer(openings$Frequency)
  openings <- openings[openings$Frequency > 10,]
  # openings$Percentage <- as.numeric(openings$Frequency/sum(openings$Frequency)) * 100
  openings$Current <- FALSE
  
  rownames(openings) <- 1:nrow(openings)
  openings[openings$Name == playerOpening,]$Current <- TRUE
  openingIndex <- as.integer(rownames(openings[openings$Name == playerOpening,]))
  
  openings[openings$Name == "Queen",]$Name <- "Queen's Pawn"
  openings[openings$Name == "King",]$Name <- "King's Pawn"
  openings[openings$Name == "Ruy",]$Name <- "Ruy Lopez"
  # openings$Color = gradient_n_pal(sequential_hcl(6, palette = c("Red-Yellow")))
  
  # pie(openings$Percentage, labels = openings$Name)
  # pie(openings$Percentage, labels = openings$Name, las=2, xlab="Opening", cex.names=7)
  # pie(openings,las =2,cex.names = 0.7,xlab = Name, ylab = Percentage)
  
  p1 = ggplot(openings, aes(area = Frequency, fill = Frequency, label = Name, subgroup = Current)) +
    geom_treemap(layout="srow") +
    geom_treemap_subgroup_border(colour=rgb(70/255, 200/255, 30/255), layout="srow") +
    geom_treemap_subgroup_text(size = 20, alpha = 0, angle = 90, layout="srow", padding.x = grid::unit(10, "mm"), padding.y = grid::unit(10, "mm"),) +
    geom_treemap_text(colour = "white", place = "centre", layout="srow", grow = TRUE) +
    # scale_fill_manual(c(rep("Blue", openingIndex-1), "Green", rep("Blue", nrow(openings)-openingIndex)))
    scale_color_brewer()
  save_loc <- "treemap.png"
  print(save_loc)
  ggsave(save_loc, plot = p1)
}