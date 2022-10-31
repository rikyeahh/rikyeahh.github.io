// append the svg object to the body of the page
const svg2 = d3.select("#graph2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("https://raw.githubusercontent.com/rikyeahh/rikyeahh.github.io/main/assets/data2.csv").then(function (data) {
    const circoscrizioni = data.map(d => d.circoscrizione);
    //console.log(circoscrizioni)

    const plants = Object.keys(data[0]).filter(d => d != "circoscrizione");
    //console.log(plants)

    // stack the data? --> stack per subgroup
    const stackeddata = d3.stack()
        .keys(plants)(data);
    //console.log(stackeddata)

    const xMax = d3.max(stackeddata[stackeddata.length - 1], d => d[1]);
    console.log("xMax", xMax);
    // add X axis
    const x = d3.scaleLinear()
        .domain([0, xMax]).nice()
        .range([0, width]);
    svg2.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));


    // add Y axis
    const y = d3.scaleBand()
        .domain(circoscrizioni)
        .range([0, height])
        .padding(0.1);
    svg2.append("g")
        .call(d3.axisLeft(y));

    // color palette = one color per subgroup
    
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const layers = svg2.append('g')
        .selectAll('g')
        .data(stackeddata)
        .join('g')
        .attr('fill', d => color(d.key));


    svg2.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackeddata)
        .join("g")
        .attr("fill", d => {
            //console.log("d key", d.key);
            return color(d.key)})
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(d => d)
        .join("rect")
        .attr("x", d => x(d[1]))
        .attr("y", d => y(d.data.circoscrizione))
        .attr("height", y.bandwidth())
        .attr("width", d => {
            console.log("d", d);
            console.log(x(d[1]) + '-' + x(d[0]));
            console.log("x diff ", x(d[1]) - x(d[0]));
            console.log("----------------")
            return x(d[1]) - x(d[0])})
})

