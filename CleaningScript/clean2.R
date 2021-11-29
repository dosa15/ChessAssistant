data <- read.csv('games/games.csv')
players <- c("Atul17", "dosa15", "manoghn");
print(data)

chooseRandom <- sample(1:3, replace = T)

for(i in 1:nrow(data)){
  white <- chooseRandom(1)
  black <- white + 1
  data$white_id <- players[chooseRandom(1)]
  data$black_id <- players[chooseRandom(1)]
  data$black_id <- players[]
}
