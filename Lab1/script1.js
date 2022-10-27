// set the dimensions and margins of the graph
const margin = {top: 30, right: 30, bottom: 70, left: 200},
    width = 560 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#graph1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
//d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv").then( function(data) {
d3.csv("https://raw.githubusercontent.com/rikyeahh/rikyeahh.github.io/main/assets/data1.csv").then( function(data) {

data = data.slice(0, 10)
console.log(data)
console.log("MAX", Math.max(...data.map(x => x.count)))
// X axis
const x = d3.scaleLinear()
    .domain([0, Math.max(...data.map(x => x.count))])
    .range([ 0, width]);
svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Y axis
const y = d3.scaleBand()
.range([ 0, height])
.domain(data.map(d => d.name))
.padding(.1);
svg.append("g")
.call(d3.axisLeft(y))

//Bars
svg.selectAll("myRect")
    .data(data)
    .join("rect")
    .attr("x", x(0) )
    .attr("y", d => y(d.name))
    .attr("width", d => x(d.count))
    .attr("height", y.bandwidth())
    .attr("fill", "#69b3a2")

})