// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 60, left: 180 },
    width = 700 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#graph2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");



d3.json("../../assets/data6.json").then(function (sumstat) {
    //console.log(data)
    //max and min values for the height
    const xMax = 40


    // Show the Y scale
    const y = d3.scaleBand()
        .range([height, 0])
        .domain(sumstat.map(d => d.key))
        //.domain(["Tilia x europaea", "Tilia cordata", "Platanus x hispanica", "Celtis australis", "Carpinus betulus", "Aesculus hippocastanum"])
        .padding(.1);

    svg.append("g")
        .attr("transform", "translate(-50," + (-15) + ")")
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove()


    // Show the X scale
    const x = d3.scaleLinear()
        .domain([0, xMax])
        .range([0, width]).nice();

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5))
        .select(".domain").remove()

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + margin.top + 30)
        .text("Height (m)");


    // Show the main vertical line
    svg
        .selectAll("vertLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("x1", function (d) { return (x(d.value.min)) })
        .attr("x2", function (d) { return (x(d.value.max)) })
        .attr("y1", function (d) { return (y(d.key) + y.bandwidth() / 2) })
        .attr("y2", function (d) { return (y(d.key) + y.bandwidth() / 2) })
        .attr("stroke", "black")
        .style("width", 40)
    //return
    // rectangle for the main box
    svg
        .selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
        .attr("x", function (d) { return (x(d.value.q1)) }) // console.log(x(d.value.q1)) ;
        .attr("width", function (d) {return (x(d.value.q3) - x(d.value.q1)) }) //console.log(x(d.value.q3)-x(d.value.q1))
        .attr("y", function (d) { return y(d.key); })
        .attr("height", y.bandwidth())
        .attr("stroke", "black")
        .style("fill", "#69b3a2")
        .style("opacity", 0.3)


    // Show the median
    svg.selectAll("medianLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("y1", function (d) { return (y(d.key)) })
        .attr("y2", function (d) { return (y(d.key) + y.bandwidth()) })
        .attr("x1", function (d) { return (x(d.value.median)) })
        .attr("x2", function (d) { return (x(d.value.median)) })
        .attr("stroke", "black")
        .style("width", 80)

    // add small details
    svg.selectAll("detailLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("y1", function (d) { return (y(d.key)) + 15 })
        .attr("y2", function (d) { return (y(d.key) + y.bandwidth()) - 15})
        .attr("x1", function (d) { return (x(d.value.max))  })
        .attr("x2", function (d) { return (x(d.value.max)) })
        .attr("stroke", "black")
        .style("width", 80)
    svg.selectAll("detailLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("y1", function (d) { return (y(d.key)) + 15 })
        .attr("y2", function (d) { return (y(d.key) + y.bandwidth()) - 15})
        .attr("x1", function (d) { return (x(d.value.min))  })
        .attr("x2", function (d) { return (x(d.value.min)) })
        .attr("stroke", "black")
        .style("width", 80)

    // Add individual points with jitter
    d3.csv("../../assets/data5.csv").then(function (data) {
        data = data.filter(d => {
            //console.log(d.name)
            //console.log(sumstat.)
            //console.log(sumstat.findIndex(t => t.key == d.name))
            //console.log(parseFloat(d.height), " > ", sumstat[sumstat.findIndex(t => t.key == d.name)].value.min, " = ", parseFloat(d.height) > sumstat[sumstat.findIndex(t => t.key == d.name)].value.min)
            return parseFloat(d.height) > sumstat[sumstat.findIndex(t => t.key == d.name)].value.max ||
                     parseFloat(d.height) < sumstat[sumstat.findIndex(t => t.key == d.name)].value.min
        })
        const jitterWidth = 20
        svg
            .selectAll("indPoints")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) {return (x(d.height)) })
            .attr("cy", function (d) { return (y(d.name) + (y.bandwidth() / 2) - jitterWidth / 2 + Math.random() * jitterWidth) })
            .attr("r", 2)
            .style("fill", "white")
            .attr("stroke", "black")
    }
    );

})