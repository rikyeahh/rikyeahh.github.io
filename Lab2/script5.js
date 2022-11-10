//Bubble plot



//Read the data
d3.csv("https://raw.githubusercontent.com/rikyeahh/rikyeahh.github.io/main/assets/data5.csv").then( function(data) {
// d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/4_ThreeNum.csv").then( function(data) {
// set the dimensions and margins of the graph
  const margin = {top: 10, right: 20, bottom: 30, left: 50},
  width = 1000 - margin.left - margin.right,
  height = 1000- margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg5 = d3.select("#graph5")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, 40])
    .range([ 0, width ]);
  svg5.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 60])
    .range([ height, 0]);
  svg5.append("g")
    .call(d3.axisLeft(y));

  // Add a scale for bubble size
  const z = d3.scaleLinear()
    .domain([0, 1000])
    .range([ 3, 35]);
  // Add a scale for bubble color
  const names = data.map(d => d.name)
  const names_uniq = [...new Set(names)];
  const names_ordered = names_uniq.sort((a, b) => a.localeCompare(b))
  const myColor = d3.scaleOrdinal()
    .domain(names_ordered)
    .range(d3.schemeTableau10);

  // -1- Create a tooltip div that is hidden by default:
  const tooltip = d3.select("#graph5")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")

  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  const showTooltip = function(event, d) {
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html("Tree: " + d.name)
      .style("left", (event.x) + "px")
      .style("top", (event.y)+30 + "px")
  }
  const moveTooltip = function(event, d) {
    tooltip
      .style("left", (event.x)/2 + "px")
      .style("top", (event.y)/2+30 + "px")
  }
  const hideTooltip = function(event, d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

  //console.log(data.map(d=>d.))
  // Add dots
  svg5.append('g')
    .selectAll("dot")
    .data(data)
    .join("circle")
      .attr("class", "bubbles")
      .attr("cx", d => x(d.height))
      .attr("cy", d => y(d.co2_absorption))
      .attr("r", d => z(d.canopy_cover))
      .style("fill", d => myColor(d.name))
    // -3- Trigger the functions
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )
})