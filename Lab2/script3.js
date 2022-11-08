//Scatter plot
// append the svg object to the body of the page
const svg3 = d3.select("#graph3")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left}, ${margin.top})`);

//Read the data
d3.csv("../assets/data5.csv").then(function(data) {
  console.log(data)
  console.log(data[0])

  const names_unique = [...new Set(data.map(d => d.name))];
  console.log(names_unique)

  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, Math.max(... data.map(d => d.height))])
    .range([ 0, width ]);
  svg3.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, Math.max(... data.map(d => d.co2_absorption))])
    .range([ height, 0]);
  svg3.append("g")
    .call(d3.axisLeft(y));

  // Color scale: give me a specie name, I return a color
  const color = d3.scaleOrdinal()
    .domain(names_unique)
    .range(d3.schemeTableau10);


  // Add dots
  svg3.append('g')
    .selectAll("dot")
    .data(data)
    .join("circle")
      .attr("cx", function (d) { return x(d.height); } )
      .attr("cy", function (d) { return y(d.Co2_absorpt); } )
      .attr("r", 5)
      .style("fill", function (d) { return color(d.name) } )

})