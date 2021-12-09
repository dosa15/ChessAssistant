library(ggplot2)
library(gganimate)
library(gifski)
library(png)
library(tidyverse)

finaldata<-read.csv("D:/college/datavisualization/project/ChessAssistant/clean_ds_post_move_analysis.csv")
#finaldata<-head(finaldata,10)
finaldata
withoutpawns<-finaldata[c('Queen','Knight','Bishop','Rook')]
withoutpawns$totalmoves=withoutpawns$Queen+withoutpawns$Knight+withoutpawns$Bishop+withoutpawns$Rook
finaldatawithoutpawn1<-withoutpawns %>% arrange(desc(totalmoves))
pieces <- c("Queen","Knight","Bishop","Rook")
games<-c(1:108)


Values <- matrix(c(finaldatawithoutpawn1$Queen,finaldatawithoutpawn1$Knight,finaldatawithoutpawn1$Bishop,finaldatawithoutpawn1$Rook), nrow = 4, ncol = 108, byrow = TRUE)

bargraph<-barplot(Values, main = "Dataset insights",names.arg = games, xlab = "games", ylab = "moves count", col = c("red","green","blue","grey"))
legend("topright", pieces, cex = 0.5, fill =c("red","green","blue","grey"))
