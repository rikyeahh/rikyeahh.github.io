//Scatter plot small multiples

//Read the data
d3.csv("https://raw.githubusercontent.com/rikyeahh/rikyeahh.github.io/main/assets/data5.csv").then(function(data) {

    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 1000,//460 - margin.left - margin.right,
    height = 2500;//400 - margin.top - margin.bottom;


    var svg4 = d3.select("#graph4")
                .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

    console.log(data);
    const names = data.map(d => d.name);
    const names_uniq = [...new Set(names)];
    const name_counts = [];
    const sortable = [];

    for (const num of names) { //get the count of trees
        name_counts[num] = name_counts[num] ? name_counts[num] + 1 : 1;
    }
    //Get a sortable version of count of trees
    names_uniq.forEach(e => {
        sortable.push([e, name_counts[e]]);
    });
    
    const name_count_ordered = sortable.sort((a, b) => b[1] - a[1]).slice(0,6);
    const names_ordered = name_count_ordered.sort((a, b) => a[0].localeCompare(b[0]));
    
    console.log(names_ordered);
  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 50]) //Math.max(...values) of treeSize
    .range([ 0, width ]);
  svg4.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 60]) //Math.max(...values) of CO2
    .range([ height, 0]);
  svg4.append("g")
    .call(d3.axisLeft(y));

  // Add dots
  svg4.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.GrLivArea); } )
      .attr("cy", function (d) { return y(d.SalePrice); } )
      .attr("r", 1.5)
      .style("fill", "#69b3a2")

})