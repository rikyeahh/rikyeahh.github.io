var total = 0;
var width,
    height,
    widthSquares = 20,
    heightSquares = 5,
    squareSize = 25,
    squareValue = 0,
    gap = 1,
    theData = [];  

d3.csv("https://raw.githubusercontent.com/rikyeahh/rikyeahh.github.io/main/assets/data2.csv").then(function(data)
{
    //console.log(data);

  //total
  total = d3.sum(data, function(d) { return d.population; });

  //value of a square
  squareValue = total / (widthSquares*heightSquares);
  
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

  var waffle = d3.select("#graph5")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .selectAll("div")
      .data(data)
      .enter()
      .append("rect")
      .attr("width", squareSize)
      .attr("height", squareSize)
      .attr("fill", function(d)
      {
        return "red"; //color(d.groupIndex);
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

   //add legend with categorical data
   var legend = d3.select("#legend")
    .append("svg")
    .attr('width', 300)
    .attr('height', 200)
    .append('g')
    .selectAll("div")
    .data(data)
    .enter()
      .append("g")
      .attr('transform', function(d,i){ return "translate(0," + i*20 + ")";});
  legend.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d, i) { return "red"});
  legend.append("text")
    .attr("x", 25)
    .attr("y", 13)
    .text( function(d) { return d.circoscrizione});

    //add value of a unit square
    var legend2 = d3.select("#legend")
      .select('svg')
      .append('g')
      .attr('transform', "translate(100,0)");
});