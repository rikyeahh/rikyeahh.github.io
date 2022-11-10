//Scatter plot
// append the svg object to the body of the page

//Read the data
d3.csv("../assets/data5.csv").then(function(data) {
  
  console.log(data)
  const margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

  const svg3 = d3.select("#graph3")
    .append("svg")
      .attr("width", 1000 + margin.left + margin.right)
      .attr("height", 2500 + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            `translate(${margin.left}, ${margin.top})`);
  

  const names = data.map(d => d.name)
  const names_uniq = [...new Set(names)];
  const names_ordered = names_uniq.sort((a, b) => a.localeCompare(b));
/*
  function trees(name){
    if (names_ordered.includes(name)){
      return name
    }
  }
  data2 = data.map(d => d.filter(trees))
  console.log(data2)
*/


  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, 50])
    .range([ 0, width ]);
  svg3.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 60])
    .range([ height, 0]);
  svg3.append("g")
    .call(d3.axisLeft(y));

  // Color scale: give me a specie name, I return a color
  const color = d3.scaleOrdinal()
    .domain(names_ordered)
    .range(d3.schemeTableau10);
  
   // Highlight the specie that is hovered
   const highlight = function(event, d){

    selected_specie = d.name

    d3.selectAll(".dot")
      .transition()
      .duration(200)
      .style("fill", "lightgrey")
      .attr("r", 5)

    d3.selectAll(".dot." + selected_specie.replace(/ /g, "."))
      .transition()
      .duration(200)
      .style("fill", color(selected_specie))
      .attr("r", 10)
  }

   // Highlight the specie that is hovered
   const doNotHighlight = function(){
    d3.selectAll(".dot")
      .transition()
      .duration(200)
      .style("fill", d => color(d.name))
      .attr("r", 8 )
  }
 
  // Add dots
  svg3.append('g')
    .selectAll("dot")
    .data(data)
    .join("circle")
      .attr("class", function (d) { return "dot " + d.name } )
      .attr("cx", function (d) { return x(parseFloat(d.height)); } )
      .attr("cy", function (d) { return y(parseFloat(d.co2_absorption)); } )
      .attr("r", 7)
      .style("fill", function (d) { return color(d.name) } )
    .on("mouseover", highlight)
    .on("mouseleave", doNotHighlight)
})