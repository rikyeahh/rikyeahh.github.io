const svg3 = d3.select('#graph3')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

// get the data
d3.csv("../assets/data2.csv").then( function(data) {
  console.log(data[1])

  const plants = Object.keys(data[0]).filter(d => d != "circoscrizione");
  console.log(plants)
  const circoscrizioni = data.map(d => d.circoscrizione);
  console.log(circoscrizioni)

  const stackedData = d3.stack()
      .keys(plants)(data);
  console.log(d3.stack().keys(plants))

  const xMax = d3.max(stackedData[stackedData.length - 1], d => d[1]);
  console.log(stackedData[stackedData.length - 1])
  console.log(xMax)

  // scales
  const x = d3.scaleLinear()
      .domain([0, xMax]).nice()
      .range([0, width]);

  const y = d3.scaleBand()
      .domain(circoscrizioni)
      .range([0, height])
      .padding(0.25);
  const color = d3.scaleOrdinal()
      .domain(plants)
      .range(d3.schemeTableau10);

  // axes
  const xAxis = d3.axisBottom(x).ticks(5, '~s');
  const yAxis = d3.axisLeft(y);

  svg3.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)

  svg3.append("g")
      .call(yAxis)

// draw bars

// create one group for each fruit
  const layers = svg3.append('g')
      .selectAll('g')
      .data(stackedData)
      .join('g')
      .attr('fill', d => color(d.key));

// transition for bars
  const duration = 1000;
  const t = d3.transition()
      .duration(duration)
      .ease(d3.easeLinear);

  layers.each(function(_, i) {
    // this refers to the group for a given fruit
    d3.select(this)
        .selectAll('rect')
        .data(d => d)
        .join('rect')
        .attr('x', d => x(d[0]))
        .attr('y', d => y(d.data.circoscrizione))
        .attr('height', y.bandwidth())
        .transition(t)
        // i is the index of this fruit.
        // this will give the bars for each fruit a different delay
        // so that the fruits will be revealed one at a time.
        // using .each() instead of a normal data join is needed
        // so that we have access to what fruit each bar belongs to.
        .delay(i * duration)
        .attr('width', d => x(d[1]) - x(d[0]));
  });
})
