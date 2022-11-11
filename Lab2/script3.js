//Scatter plot
// append the svg object to the body of the page

//Read the data
d3.csv("../assets/data5.csv").then(function(data) {
  
  //console.log(data)
  const margin = {top: 10, right: 30, bottom: 70, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

  const svg3 = d3.select("#graph3")
    .append("svg")
      .attr("width", 1000 + margin.left + margin.right)
      .attr("height", 1000 + margin.top + margin.bottom)
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
  
  //TOOLTIP
  // -1- Create a tooltip div that is hidden by default:

  const tooltip3 = d3.select("#graph3")
  .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")

  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  const showTooltip3 = function(event, d) {
    //#################################################################
    // Highlight the specie that is hovered
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
    //#################################################################

    tooltip3
      .transition()
      .duration(200)
    tooltip3
      .style("opacity", 1)
      .html("Tree: " + d.name)
      .style("left", (event.x)/2 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (event.y)/2 + "px")
  }
  const moveTooltip3 = function(event, d) {
    tooltip3
      .style("left", (event.x)/2 + "px")
      .style("top", (event.y)/2+30 + "px")
  }
  
  const hideTooltip3 = function(event, d) {
    
  //#################################################################
 
    d3.selectAll(".dot")
      .transition()
      .duration(200)
      .style("fill", d => color(d.name))
      .attr("r", 8 )
  //#################################################################
   
    tooltip3
      .transition()
      .duration(200)
      .style("opacity", 0)
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
    .on("mouseover", showTooltip3 )
    .on("mousemove", moveTooltip3 )
    .on("mouseleave", hideTooltip3 )
})