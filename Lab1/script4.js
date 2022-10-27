var total = 0;
var width,
    height,
    widthSquares = 10,
    heightSquares = 10,
    squareSize = 25,
    squareValue = 0,
    gap = 1,
    theData = [];  

var color = d3.scaleOrdinal(d3.schemeCategory10);

d3.csv("https://raw.githubusercontent.com/rikyeahh/rikyeahh.github.io/main/assets/data.csv").then(function(data)
{
    //total
    total = d3.sum(data, function(d) { return d.population; });
  
    //value of a square
    squareValue = total / (widthSquares * heightSquares);
    
    //remap data
    data.forEach(function(d, i) 
    {
        d.population = +d.population;
        d.units = Math.floor(d.population/squareValue);
        theData = theData.concat(
          Array(d.units+1).join(1).split('').map(function()
            {
              return {  squareValue:squareValue,                      
                        units: d.units,
                        population: d.population,
                        groupIndex: i};
            })
          );
    });
  
    width = (squareSize*widthSquares) + widthSquares*gap + 25;
    height = (squareSize*heightSquares) + heightSquares*gap + 25;
  
    d3.select("#graph4")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .selectAll("div")
        .data(theData)
        .enter()
        .append("rect")
        .attr("width", squareSize)
        .attr("height", squareSize)
        .attr("fill", function(d)
        {
          return color(d.groupIndex);
        })
        .attr("x", function(d, i)
          {
            //group n squares for column
            col = Math.floor(i/heightSquares);
            return (col*squareSize) + (col*gap);
          })
        .attr("y", function(d, i)
        {
          row = i%heightSquares;
          return (heightSquares*squareSize) - ((row*squareSize) + (row*gap))
        })
        .append("title")
          .text(function (d,i) 
            {
              return "Age range: " + data[d.groupIndex].age + " | " +  d.population + " , " + d.units + "%"
            });
  });