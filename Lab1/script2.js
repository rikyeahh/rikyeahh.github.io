 /*
// append the svg object to the body of the page
const svg2 = d3.select("#graph2")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// https://raw.githubusercontent.com/rikyeahh/rikyeahh.github.io/main/assets/data2.csv 
// Parse the Data
d3.csv("https://raw.githubusercontent.com/rikyeahh/rikyeahh.github.io/main/assets/data2.csv").then( function(data) {
    circoscrizioni = []
    data.map(data => {circoscrizioni.push(data.circoscrizione)}); 
    circoscrizioni.pop()
    console.log(circoscrizioni)
        


  // List of subgroups = header of the csv files = soil condition here
  const subgroups = data.columns.slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  const groups = data.map(d => (d.group))



  // Add X axis
  const x = d3.scaleBand()
      .domain([0,1000])
      .range([0, width]);
  svg2.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

  // Add Y axis
  const y = d3.scaleLinear()
    .range([height, 0])
    .domain(circoscrizioni);
   svg2.append("g")
    .call(d3.axisLeft(y));

  // color palette = one color per subgroup
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#e41a1c','#377eb8','#4daf4a'])

  //stack the data? --> stack per subgroup
  const stackedData = d3.stack()
    .keys(subgroups)
    (data)

 // Show the bars
  svg2.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(d => d)
      .join("rect")
        .attr("x", d => x(d.data.group))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width",x.bandwidth())

        
  

})
*/


// append the svg object to the body of the page
const svg2 = d3.select("#graph2")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("https://raw.githubusercontent.com/rikyeahh/rikyeahh.github.io/main/assets/data2.csv").then( function(data) {

    const circoscrizioni = data.map(d => d.circoscrizione);
    //console.log(circoscrizioni)

    const plants = Object.keys(data[0]).filter(d => d != "circoscrizione");
    console.log(plants.length)

    // Add X axis
    const x = d3.scaleBand()
        .domain(circoscrizioni)
        .range([0, width])
    /*svg2.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));
    */

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 60])
        .range([ height, 0 ]);
    svg2.append("g")
        .call(d3.axisLeft(y));

    // color palette = one color per subgroup
    const color = d3.scaleOrdinal()
        .domain(plants)
        .range(['#e41a1c','#377eb8','#4daf4a','#6daf7a','#8daf3a','#9daf5b'])

    //stack the data? --> stack per subgroup
    const stackedData = d3.stack()
        .keys(plants)
        (data)
        console.log(stackedData)


    // Show the bars
    svg2.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(d => d)
        .join("rect")
            .attr("x", d => x(d.data.circoscrizione))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width",x.bandwidth())
})

