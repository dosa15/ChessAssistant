library(ggplot2)
library(gganimate)
library(gifski)
library(png)
library(tidyverse)

finaldata<-read.csv("D:/college/datavisualization/project/ChessAssistant/clean_ds_post_move_analysis.csv")
#finaldata<-head(finaldata,10)
finaldata
finaldata1<-finaldata %>% arrange(desc(Num.Moves))
pieces <- c("Queen","Knight","Bishop","Rook","Pawn")
games<-c(1:108)


Values <- matrix(c(finaldata1$Queen,finaldata1$Knight,finaldata1$Bishop,finaldata1$Rook,finaldata1$Pawn), nrow = 5, ncol = 108, byrow = TRUE)

bargraph<-barplot(Values, main = "Dataset insights",names.arg = games, xlab = "games", ylab = "moves count", col = c("red","green","blue","grey","yellow"))
legend("topright", pieces, cex = 0.5, fill =c("red","green","blue","grey","yellow"))
