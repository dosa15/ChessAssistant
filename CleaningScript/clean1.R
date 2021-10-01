chessData<-read.csv("ChessDataset.csv")
chessData
cleanChessData<-chessData[chessData$Variant == "Standard", ]

cleanChessData$White[cleanChessData$White == "Anonymous"]<-"manoghn"
cleanChessData$Black[cleanChessData$Black == "Anonymous"]<-"manoghn"

cleanChessData$Black.ELO[cleanChessData$Black.ELO == '?']<-1200
cleanChessData$White.ELO[cleanChessData$Black.ELO == '?']<-1200

cleanChessData$Num.Moves

for(i in 1:nrow(cleanChessData)){
  cleanChessData[i, "Num.Moves"] = length(unlist(strsplit(cleanChessData[i, "Game.Movelist"], ",")))
}

cleanChessData[cleanChessData$Num.Moves < 10 & cleanChessData$Termination == "Time forfeit", ] <- NA
cleanChessData<-na.omit(cleanChessData)


#excludes<-cleanChessData[cleanChessData$Num.Moves < 10 & cleanChessData$Termination == "Time forfeit", ]
#cleanChessData<-anti_join(cleanChessData, excludes)

cleanChessData
write.csv(cleanChessData, "D:/sem5/Project/ChessAssistantGithub/ChessAssistant/CleanedChessDataset.csv", row.names=FALSE)