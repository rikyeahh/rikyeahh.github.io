
const svg2 = d3.select('#graph2')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

// get the data
d3.csv("../assets/data2.csv").then( function(data) {

  const plants = Object.keys(data[0]).filter(d => d != "circoscrizione");
  const circoscrizioni = data.map(d => d.circoscrizione);

  const stackedData = d3.stack()
      .keys(plants)(data);

  const xMax = d3.max(stackedData[stackedData.length - 1], d => d[1]);

  // scales
  const x = d3.scaleLinear()
      .domain([0, xMax]).nice()
      .range([0, width]);

  const y = d3.scaleBand()
      .domain(circoscrizioni)
      .range([0, height])
      .padding(0.1);
  const color = d3.scaleOrdinal()
      .domain(plants)
      .range(["#094F29", "#0A6921", "#1A8828", "#429B46", "#64AD62", "#94C58C"]);

  // axes
  const xAxis = d3.axisBottom(x).ticks(5, '~s');
  const yAxis = d3.axisLeft(y);

  svg2.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)

  svg2.append("g")
      .call(yAxis)

// draw bars

  const layers = svg2.append('g')
      .selectAll('g')
      .data(stackedData)
      .join('g')
      .attr('fill', d => color(d.key));

// transition for bars
  const duration = 0;
  const t = d3.transition()
      .duration(duration)
      .ease(d3.easeLinear);


  layers.each(function(_, i) {

    d3.select(this)
        .selectAll('rect')
        .data(d => d)
        .join('rect')
        .attr('x', d => x(d[0]))
        .attr('y', d => y(d.data.circoscrizione))
        .attr('height', y.bandwidth())
        .transition(t)
        .delay(i * duration)
        .attr('width', d => (x(d[1]) - x(d[0])));
  });
 
})