// ridgeline

function redrawRidgeline(years) {
    d3.csv("../assets/data10.csv").then(data => {

        // take data only of the specified years
        data = data.filter(line => years.includes(line.year.slice(0, 4)))

        // max and min temperatures of each month of years
        dataMax = data.filter(line => line.year.slice(-3) == "max")
        dataMin = data.filter(line => line.year.slice(-3) == "min")
    
        dataMax = preprocessData(dataMax);
        dataMin = preprocessData(dataMin);
    
        // set the dimensions and margins of the graph
        const margin = { top: 60, right: 30, bottom: 20, left: 110 },
            width = 500 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;
    
        // clear the previous graph viz
        document.getElementById("graph3").innerHTML = '';

        // append the svg object to the body of the page
        const svg = d3.select("#graph3")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                `translate(${margin.left}, ${margin.top})`);
    
        // Get the different categories and count them
        const categories = dataMax.columns
        const n = categories.length
    
        // Add X axis
        const x = d3.scaleLinear()
            .domain([-20, 45])
            .range([0, width]);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));
    
        // Create a Y scale for densities
        const y = d3.scaleLinear()
            .domain([0, 0.4])
            .range([height, 0]);
    
        // Create the Y axis for names
        const yName = d3.scaleBand()
            .domain(categories)
            .range([0, height])
            .paddingInner(1)
        svg.append("g")
            .call(d3.axisLeft(yName));
    
        // Compute kernel density estimation for each month (dataMax):
        var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40)) // increase this 40 for more accurate density.
        var allDensity = []
        for (i = 0; i < n; i++) {
            key = categories[i]
            density = kde(dataMax.map(function (d) { return d[key]; }))
            allDensity.push({ key: key, density: density })
        }
    
        // Add areas
        svg.selectAll("areas")
            .data(allDensity)
            .join("path")
            .attr("transform", function (d) { return (`translate(0, ${(yName(d.key) - height)})`) })
            .datum(function (d) { return (d.density) })
            .attr("fill", "#ffffff")
            .attr("fill-opacity", "0")
            .attr("stroke", "#c91e24")
            .attr("stroke-width", 2)
            .attr("d", d3.line()
                .curve(d3.curveBasis)
                .x(function (d) { return x(d[0]); })
                .y(function (d) { return y(d[1]); })
            )
    
        // Compute kernel density estimation for each month (dataMin):
        kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40)) // increase this 40 for more accurate density.
        allDensity = []
        for (i = 0; i < n; i++) {
            key = categories[i]
            density = kde(dataMin.map(function (d) { return d[key]; }))
            allDensity.push({ key: key, density: density })
        }
    
        // Add areas
        svg.selectAll("areas")
            .data(allDensity)
            .join("path")
            .attr("transform", function (d) { return (`translate(0, ${(yName(d.key) - height)})`) })
            .datum(function (d) { return (d.density) })
            .attr("fill", "#ffffff")
            .attr("fill-opacity", "0")
            .attr("stroke", "#1f19c2")
            .attr("stroke-width", 2)
            .attr("d", d3.line()
                .curve(d3.curveBasis)
                .x(function (d) { return x(d[0]); })
                .y(function (d) { return y(d[1]); })
            )
    
    })

}

// This is what I need to compute kernel density estimation
function kernelDensityEstimator(kernel, X) {
    return function (V) {
        return X.map(function (x) {
            return [x, d3.mean(V, function (v) { return kernel(x - v); })];
        });
    };
}
function kernelEpanechnikov(k) {
    return function (v) {
        return Math.abs(v /= k) <= 1 ? 0.25 * (1 - v * v) / k : 0;
    };
}

function preprocessData(dataMax) {
    var arrayData = [[], [], [], [], [], [], [], [], [], [], [], []];
    dataMax.forEach(element => {
        arrayData[parseInt(element.month) - 1].push(element.temp)
    });
    arrayData = arrayData[0].map((_, colIndex) => arrayData.map(row => row[colIndex]));
    finalData = []
    for (let i = 0; i < arrayData.length; i++) {
        obj = {}
        obj['JAN'] = arrayData[i][0];
        obj['FEB'] = arrayData[i][1];
        obj['MAR'] = arrayData[i][2];
        obj['MAR'] = arrayData[i][3];
        obj['APR'] = arrayData[i][4];
        obj['MAY'] = arrayData[i][5];
        obj['JUN'] = arrayData[i][6];
        obj['JUL'] = arrayData[i][7];
        obj['SEP'] = arrayData[i][8];
        obj['OCT'] = arrayData[i][9];
        obj['NOV'] = arrayData[i][10];
        obj['DEC'] = arrayData[i][11];
        finalData.push(obj);
    }
    finalData.columns = ['JAN', 'FEB', 'MAR', 'APR', 'APR', 'MAY', 'JUN', 'JUL', 'SEP', 'OCT', 'NOV', 'DEC']
    return finalData
}


// on year selection and submit, redraw the graph
const form = document.querySelector("form");

form.addEventListener(
  "submit",
  (event) => {
    const data = new FormData(form);
    let chosenYears = [];
    for (const entry of data) {
        chosenYears.push(entry[1]);
    }
    console.log(chosenYears);
    redrawRidgeline(chosenYears);
    event.preventDefault();
  },
  false
);

// by default, show all years
redrawRidgeline(['1993', '1997', '2001', '2005', '2009', '2013', '2017', '2021']);