const svg4 = d3.select("#graph4")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("../assets/data2.csv").then(function(data) {

    // List of subgroups = header of the csv files = soil condition here
    const plants = Object.keys(data[0]).filter(d => d != "circoscrizione");
    //console.log(plants)
    // List of groups = species here = value of the first column called group -> I show them on the X axis
    const circoscrizioni = data.map(d => d.circoscrizione)
    //console.log(circoscrizioni)

    // scales
    const x = d3.scaleLinear()
        .domain([0, 100]).nice()
        .range([0, width]);
    const y = d3.scaleBand()
        .domain(circoscrizioni)
        .range([0, height])
        .padding([0.1])
    const color = d3.scaleOrdinal()
        .domain(plants)
        .range(d3.schemeTableau10);

    //axes
    const xAxis = d3.axisBottom(x).ticks(5, '~s');
    const yAxis = d3.axisLeft(y);

    svg4.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)

    svg4.append("g")
        .call(yAxis)

    // Normalize the data -> sum of each group must be 100!
    //console.log(data)
    dataNormalized = []
    data.forEach(function(d){
        // Compute the total
        tot = 0
        for (i in plants){ name=plants[i] ; tot += +d[name]}
        console.log(tot)
        // Now normalize
        for (i in plants){ name=plants[i] ; d[name] = d[name] / tot * 100
            console.log("data"+d[name])}
    })

    //stack the data? --> stack per subgroup
    const stackedData = d3.stack()
        .keys(plants)
        (data)

    //console.log(stackedData)
    const layers = svg4.append('g')
        .selectAll('g')
        .data(stackedData)
        .join('g')
        .attr('fill', d => color(d.key));

    layers.each(function (_, i) {

        d3.select(this)
            .selectAll('rect')
            .data(d => d)
            .join('rect')
            .attr('x', d => x(d[0]))
            .attr('y', d => y(d.data.circoscrizione))
            .attr('height', y.bandwidth())
            .attr('width', d => (x(d[1]) - x(d[0])));
    });
})
