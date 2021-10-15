library(shiny)
library(rchess)

#ui = shinyUI(fluidPage(
#  chessboardjsOutput('board', width = 500)
#))

#ui<-fluidPage(
  #includeScript(path = "www/chessboardjs/js/chess.js")
#)

#dont mind
#server = function(input, output) {
#output$board <- renderChessboardjs({
#    chessboardjs()
#  })
#}  
  
# Run the app ----
shinyApp(ui = htmlTemplate("index.html"), server = server)

