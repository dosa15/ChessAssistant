library(shiny)
library(rchess)
library(plumber)

ui<-
  fluidPage(
    mainPanel(
      htmlTemplate("index.html")
    )
)

server <- function(input, output, session) {
  #pr ("graphs/graphs_all.R") %>%
    #pr_run(port = 8000)
}

  
# Run the app ----
shinyApp(ui = htmlTemplate("index.html"), server = server)
# shinyApp(ui = ui, server = server)

