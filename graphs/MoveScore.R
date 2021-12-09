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

library(rchess)
library(ggplot2)
library(stringr)
library(treemapify)
library(scales)

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
  found <- FALSE
  for(O in chessopenings[order(chessopenings$name),]$name) {
    if(O == playerOpening) flag = TRUE
    for(i in 1:length(unique_openings)) {
      if(sjmisc::str_contains(O, unique_openings[i])) {
        unique_openings_count[i] <- unique_openings_count[i] + 1
        if(flag && !found) {
          playerOpening <- unique_openings[i]
          found <- TRUE
        }
      }
    }
  }
  if(!found) playerOpening <- "Other Openings"
  
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
  if(TRUE %in% (openings$Name == playerOpening)) {
    openings[openings$Name == playerOpening,]$Current <- TRUE
  } else {
    openings[openings$Name == "Other Openings",]$Current <- TRUE
  }
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
  
  
  print(formatted_moves)
  print(playerOpening)
  
  save_loc <- "treemap.png"
  print(save_loc)
  ggsave(save_loc, plot = p1)
}

s <- "e4,e5,Nf3,Nc6,Bc4,Nf6,Nc3,Bf5"
  
  






