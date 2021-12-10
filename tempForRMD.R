library(network)
library(sna)
library(ggplot2)
library(GGally)

chessDataset <- read.csv("ChessDataset.csv")
# View(chessDataset)

movelists <- list()
for(movelist in chessDataset$Game.Movelist)
  movelists <- append(movelists, strsplit(movelist, split = ","))
col_len <- max(lengths(movelists[1:length(movelists)]))

df <- as.data.frame(cbind(movelists))[[1]]
# View(df)

firstMove <- c()
for(i in df) {
  firstMove <- c(firstMove, i[[1]])
}
firstMove <- unique(firstMove)
firstMove

secondMove <- c()
for(i in df) {
  secondMove <- c(secondMove, i[[2]])
}
secondMove <- unique(secondMove)
secondMove

thirdMove <- c()
for(i in df) {
  thirdMove <- c(thirdMove, i[[3]])
}
thirdMove <- unique(thirdMove)
thirdMove

fourthMove <- c()
for(i in df) {
  fourthMove <- c(fourthMove, i[[4]])
}
fourthMove <- unique(fourthMove)
fourthMove

N <- length(c(firstMove, secondMove, thirdMove, fourthMove))
adj_matrix <- matrix(rep(0, N*N), N)

for(movelist in df) {
  for(i1 in 1:length(firstMove)) {
    for(i2 in 1:length(secondMove)) {
      for(i3 in 1:length(thirdMove)) {
        for(i4 in 1:length(fourthMove)) {
          if(length(movelist) >= 4 && movelist[[1]] == firstMove[i1] && movelist[[2]] == secondMove[i2]) {
            adj_matrix[i1,length(firstMove)+i2] <- 1
            # adj_matrix[length(firstMove)+i2,i1] <- 1
            if(movelist[[3]] == thirdMove[i3]) {
              adj_matrix[i2,length(c(secondMove, thirdMove))+i3] <- 1
              # adj_matrix[length(c(secondMove, thirdMove))+i3,i2] <- 1
              if(movelist[[4]] == fourthMove[i4]) {
                adj_matrix[i3,length(c(thirdMove, fourthMove))+i4] <- 1
                # adj_matrix[length(c(thirdMove, fourthMove))+i4,i3] <- 1
              }
            }
          }
        }
      }
    }
  }
}

nw <- network(adj_matrix, directed = TRUE)
nodeNames <- c(firstMove, secondMove, thirdMove, fourthMove)
network.vertex.names(nw) <- nodeNames
p1 <- ggnet2(nw, size = "indegree", max_size = 30, 
             label=c(firstMove, secondMove, thirdMove, fourthMove), 
             node.color="black", 
             label.color="white", label.size = 5, 
             edge.color = "blue", edge.size = 0.5,
             arrow.size = 4, arrow.gap = 0.0005)  #, "#2db339", "#1dd12e", "#0ced21"
show(p1)
ggsave("networkgraph.png", plot = p1, width=20, height=25.7,  limitsize = FALSE)
