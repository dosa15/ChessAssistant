bar_mostmov<-read.csv("D:/college/datavisualization/project/ChessAssistant/clean_ds_post_move_analysis.csv")
bar_mostmovdf<- bar_mostmov[2,]
bar_mostfinal<- c(bar_mostmovdf$Queen,bar_mostmovdf$Knight,bar_mostmovdf$Bishop,bar_mostmovdf$Rook,bar_mostmovdf$Pawn)
pieces<-c("Queen","Knight","Bishop","Rook","Pawn")

barplot(bar_mostfinal,names.arg = pieces,xlab="Piece",ylab="No. of moves",col="red",
        main="Piece wise number of moves in each game",border="red")

