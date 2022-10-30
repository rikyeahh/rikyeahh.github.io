// Parse the Data
d3.csv("https://raw.githubusercontent.com/rikyeahh/rikyeahh.github.io/main/assets/data2.csv").then( function(data) {

  const circoscrizioni = data.map(function(val){return val['circoscrizione'];});
  const trees = data.columns.slice(1)
  
  //console.log("Circoscrizioni:", circoscrizioni)
  //console.log(trees)

  const tooltip3 = d3.select("body")
  .append("div")
  .attr("class","d3-tooltip")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .style("padding", "15px")
  .style("background", "rgba(0,0,0,0.6)")
  .style("border-radius", "5px")
  .style("color", "#fff")
  .text("a simple tooltip");

  // color palette = one color per subgroup
  const zip = (a, b) => a.map((k, i) => [k, b[i]]);
  const color = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]
  const y = d3.scaleBand().domain(trees).range([ height, 0 ]);

  // Add X axis
  for (let index = 0; index < 5; index++) {
    const svg3 = d3.select("#graph3_v2")
    .append("svg")
      .attr("width", width/3 + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left-30},${margin.top+20})`);

    svg3.append("text")
    .attr("transform", "translate(" + (width/6) + " ," + (-margin.top) + ")")
    .style("text-anchor", "middle")
    .text(circoscrizioni[index])

    var values = [];
    for (let i = 0; i < Object.entries(data[index]).length; i++) {
      values[i] = Object.entries(data[index])[i][1];
    }
      
    values = values.slice(1); // without 'circoscizione'
    trees_val = zip(trees, values);

    console.log(trees_val);
    
    const x =  d3.scaleLinear()
    .domain([0, Math.max(...values)]) //temp written by hand
    .range([0, width/3]);
    svg3.append("g")
    .call(d3.axisTop(x));    

    svg3.append("g")
      .call(d3.axisLeft(y));
  
  svg3.selectAll("myG")
    .data(trees_val)
        .join("rect")
        .attr("x", x )
        .attr("y", d => y (d[0]))
        .attr("width", d => x(d[1]))
        .attr("height", y.bandwidth())
        .attr("fill", color[index])
        .on("mouseover", function(d, i) { 
            tooltip3.html(`Mean canopy size : ${100}`)
                .style("visibility", "visible");
            d3.select(this).attr("fill", "red");
         })
         .on("mousemove", function(){
            tooltip3
              .style("top", (event.pageY-10)+"px")
              .style("left",(event.pageX+10)+"px");
          })
         .on("mouseout", function() {
            tooltip3.html(``).style("visibility", "hidden");
            d3.select(this).attr("fill", "#69b3a2");
         });
  }
})