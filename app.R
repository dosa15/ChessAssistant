library(shiny)
library(rchess)

ui<-
  fluidPage(
    mainPanel(
      htmlTemplate("index.html")
    )
)

server <- function(input, output, session) {
  
}
  
# Run the app ----
shinyApp(ui = htmlTemplate("index.html"), server = server)
# shinyApp(ui = ui, server = server)


pr ("graphs/graphs_all.R") %>%
  pr_run(port = 8000)
