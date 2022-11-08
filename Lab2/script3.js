//Scatter plot
// append the svg object to the body of the page

//Read the data
d3.csv("../assets/data5.csv").then(function(data) {
  
  console.log(data)
  const margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  const svg3 = d3.select("#graph3")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            `translate(${margin.left}, ${margin.top})`);
  

  const names = data.map(d => d.name)


  //console.log(names_unique)

  const names_ordered = names.sort((a, b) => a.localeCompare(b))
  //console.log(names_ordered)

  /*var dictionary_names_value = Array.from(new Set(names_ordered)).map(a =>
    ({name:a, count: names_ordered.filter(f => f === a).length}));*/
  
  //console.log(dictionary_names_value);
  


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


  // Add dots
  svg3.append('g')
    .selectAll("dot")
    .data(data)
    .join("circle")
      .attr("class", function (d) { return "dot " + d.name } )
      .attr("cx", function (d) { return x(parseFloat(d.height)); } )
      .attr("cy", function (d) { return y(parseFloat(d.co2_absorption)); } )
      .attr("r", 5)
      .style("fill", function (d) { return color(d.name) } )
    .on("mouseover", highlight)
    .on("mouseleave", doNotHighlight )

})