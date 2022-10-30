// Parse the Data
d3.csv("https://raw.githubusercontent.com/rikyeahh/rikyeahh.github.io/main/assets/data2.csv").then( function(data) {

  //data = data.splice(5,data.length-5)
  lng  = data.length - 5;
  for (let j = 0; j < lng; j++) {
    data.pop();
  }

  const circoscrizioni = data
  .map(function(val){
    return val['circoscrizione'];
  })
  .slice(0,5);
  circoscrizioni.push("TOTAL")
  
  const trees = data.columns.slice(1)
  console.log("data:", data);
  
  const tot = [];
  for (let j = 0; j < trees.length; j++) {
      tot[j] = data.map(d => parseInt(d[trees[j]])).reduce((partialSum, a) => partialSum + a, 0);
  }

  data.push({
    'circoscrizione' : "TOTAL",
    'Celtis australis' : tot[0],
    'Aesculus hippocastanum' : tot[1],
    'Carpinus betulus' : tot[2],
    'Tilia cordata' : tot[3],
    'Platanus x hispanica' : tot[4],
    'Other' : tot[5]
    });


  console.log("Tot: ", tot);
  console.log("Circoscrizioni: ", circoscrizioni)
  console.log("Values: ", values)
  console.log("Trees: ",trees)

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
  const color = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];
  var color2 = d3.scaleLinear().range(["#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
  const y = d3.scaleBand().domain(trees).range([ height, 0 ]);

  // Add X axis
  for (let index = 0; index < circoscrizioni.length; index++) {
    const svg3 = d3.select("#graph3_v2")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left-30},${margin.top+20})`);

    svg3.append("text")
    .attr("transform", "translate(" + (width) + " ," + (-margin.top) + ")")
    .style("text-anchor", "middle")
    .text(circoscrizioni[index])


    var values = [];
    for (let i = 0; i < Object.entries(data[index]).length; i++) {
      values[i] = Object.entries(data[index])[i][1];
    }
      
    values = values.slice(1); // without 'circoscizione'
    trees_val = zip(trees, values);

    console.log("Trees/Val: ", trees_val);
    
    const x =  d3.scaleLinear()
    .domain([0, Math.max(...values)]) //temp written by hand
    .range([0, width]);
    svg3.append("g")
    .call(d3.axisTop(x));
    //.selectAll("text").remove();    

    svg3.append("g")
      .call(d3.axisLeft(y));
    
  svg3.selectAll("myG")
    .data(trees_val)
        .join("rect")
        .attr("x", x )
        .attr("y", d => y (d[0]))
        .attr("width", d => x(d[1]))
        .attr("height", y.bandwidth())
        .attr("id", function(d, i) {
            return i;
        })
        .attr("fill", function(d, i) {
            return color2(i);
          })
        .on("mouseover", function(d, i) { 
            tooltip3.html(`Count : ${i[1]}`)
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
            d3.select(this).attr("fill", function() {
                return "" + color2(this.id) + "";
            })
         });
  }
})