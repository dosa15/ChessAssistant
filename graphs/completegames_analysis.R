finaldata<-read.csv("D:/college/datavisualization/project/ChessAssistant/clean_ds_post_move_analysis.csv")
#finaldata<-head(finaldata,10)
finaldata
pieces <- c("Queen","Knight","Bishop","Rook","Pawn")
games<-c(1:108)


Values <- matrix(c(finaldata$Queen,finaldata$Knight,finaldata$Bishop,finaldata$Rook,finaldata$Pawn), nrow = 5, ncol = 108, byrow = TRUE)

barplot(Values, main = "total game insights",names.arg = games, xlab = "games", ylab = "moves count", col = c("red","green","blue","grey","yellow"))
legend("topleft", pieces, cex = 0.5, fill =c("red","green","blue","grey","yellow"))