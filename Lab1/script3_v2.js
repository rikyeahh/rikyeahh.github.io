// Parse the Data
d3.csv("https://raw.githubusercontent.com/rikyeahh/rikyeahh.github.io/main/assets/data2.csv").then( function(data) {

  var circoscrizioni = data.map(function(val){return val['circoscrizione'];});
  const trees = data.columns.slice(1)
  
  console.log("Circoscrizioni:", circoscrizioni)
  console.log(trees)

  // Add X axis
  for (let index = 0; index < circoscrizioni.length; index++) {
    const svg3 = d3.select("#graph3")
    .append("svg")
      .attr("width", width/1.3 + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left-30},${margin.top+20})`);

    svg3.append("text")
    .attr("transform", "translate(" + (width/2) + " ," + (-margin.top) + ")")
    .style("text-anchor", "middle")
    .text(circoscrizioni[index])

    var values = [];
    for (let i = 0; i < Object.entries(data[index]).length; i++) {
      values[i] = Object.entries(data[index])[i][1];
    }
      
    values = values.slice(1); // without 'circoscizione'

    const zip = (a, b) => a.map((k, i) => [k, b[i]]);
    trees_val = zip(trees, values);

    console.log(trees_val);
    
    const x =  d3.scaleLinear()
    .domain([0, Math.max(...values)]) //temp written by hand
    .range([0, width/1.3]);
    svg3.append("g")
    .call(d3.axisTop(x));

    const y = d3.scaleBand()
      .domain(trees)
      .range([ height, 0 ]);
    svg3.append("g")
      .call(d3.axisLeft(y));

    // color palette = one color per subgroup
    const color = d3.scaleOrdinal()
      .domain(trees)
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])
  
  svg3.selectAll("myG")
  .data(trees_val)
  .join("rect")
  .attr("x", x )
  .attr("y", d => y (d[0]))
  .attr("width", d => x(d[1]))
  .attr("height", y.bandwidth())
  .attr("fill", "#69b3a2")

  }
})