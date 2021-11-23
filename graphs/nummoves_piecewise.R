bar_mostmovdf<- bar_mostmov[2,]
bar_mostmovdf
pieces <- as.factor(c("Queen", "Knight", "Bishop", "Rook", "Pawn"))
moves_per_piece <- c(bar_mostmovdf$Queen, bar_mostmovdf$Knight, bar_mostmovdf$Bishop, bar_mostmovdf$Rook, bar_mostmovdf$Pawn)
chessTest <- data.frame(pieces, moves_per_piece)
ggplot(chessTest) + geom_point(aes(x=pieces, y=moves_per_piece, size = moves_per_piece,color= pieces)) +ylim(0,50)+ scale_size(range = c(10,18))+theme(axis.title.x=element_blank(),
                                                                                                                                           axis.text.x=element_blank(),
                                                                                                                                           axis.ticks.x=element_blank(),
                                                                                                                                           axis.title.y =element_blank(),
                                                                                                                                           axis.text.y=element_blank(),
                                                                                                                                           axis.ticks.y=element_blank(),
                                                                                                                                           plot.margin = margin(t=0.5,
                                                                                                                                                                r=5,
                                                                                                                                                                b=0.5,
                                                                                                                                                                l=5,
                                                                                                                                                                unit = "cm"),
                                                                                                                                           legend.key.size = unit(0.05,"cm"),
                                                                                                                                           legend.key.width = unit(0.1,"cm"),
                                                                                                                                           legend.margin = margin(t=0.5,
                                                                                                                                                                  r=0.1,
                                                                                                                                                                  b=0.5,
                                                                                                                                                                  l=0.1,
                                                                                                                                                                  unit = "mm"),
                                                                                                                                           panel.grid.major = element_blank(),
                                                                                                                                           panel.grid.minor = element_blank())