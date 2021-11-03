chess<-read.csv("D:/college/datavisualization/project/ChessAssistant/CleanedChessDataset.csv")

tempdf=data.frame(sno=c(1:108),moves= chess$Num.Moves, colour=chess$Winner)
tempdf
#
#library(plotly)
#bubbleplot <-  plot_ly(tempdf,x=,y=~sno,text=~2, size=~2,color = ~colour,sizes=c(10,50), marker= list(opacity= 0.7,sizemode = "diameter"))
#bubbleplot<-bubbleplot%>%layout
#bubbleplot

ggplot(tempdf, aes(x = sno, y = moves)) +
  geom_point(aes(color = colour, size = moves), alpha = 0.5) +
  scale_color_manual(values = c("#AA4371", "#E7B800", "#FC4E07")) +
  scale_size(range = c(1, 13)) + # Adjust the range of points size
  theme_set(theme_bw() +theme(legend.position = "bottom"))

