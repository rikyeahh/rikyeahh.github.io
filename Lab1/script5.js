d3.csv("https://raw.githubusercontent.com/rikyeahh/rikyeahh.github.io/main/assets/data2.csv").then(function (data) {

    var WIDTH = 750, HEIGHT = 600;

    const margin = { top: 30, right: 30, bottom: 70, left: 200 }
    width = WIDTH - margin.left - margin.right;
    height = HEIGHT - margin.top - margin.bottom;

    widthSquares = 20;
    heightSquares = 5;

    const circoscrizioni = data.map(d => d.circoscrizione);
    const plants = Object.keys(data[0]).filter(d => d != "circoscrizione");

    for (let circoscrizione = 0; circoscrizione < circoscrizioni.length; circoscrizione++) {

        var values = Object.values(data[circoscrizione]).splice(1);
        //console.log(values);
        var total = values.reduce((a, b) => parseInt(a) + parseInt(b), 0)
        values = values.map(v => Math.round(v * 100 / total));
        //console.log(values, "eccess of", values.reduce((a, b) => a + b, 0) - 100);
        // fix the eccess/lack due to the rounding by adjusting the "other" class
        values[values.length - 1] -= values.reduce((a, b) => a + b, 0) - 100;
        //console.log(values);
        var sm_margin = 5;
        var sm_width = 150;
        var sm_height = 170;
        var plantColor = d3.schemeTableau10
        var squareDimension = 10
        var squarePadding = 2

        const svg5 = d3.select("#graph5")
            .append("svg")
            .attr("width", sm_width + sm_margin + 10)
            .attr("height", sm_height)
            .append("g")
            .attr("transform", `translate(${sm_margin},${50})`)

        svg5.append("text")
            .attr("transform", "translate(" + (sm_width / 2) + " ," + -10 + ")")
            .style("text-anchor", "middle")
            .style("font-size", "15")
            .text(circoscrizioni[circoscrizione])// + " " + values)

        // add tooltip
        const tooltip5 = d3.select("body")
        .append("div")
        .attr("class", "d3-tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("padding", "15px")
        .style("background", "rgba(0,0,0,0.6)")
        .style("border-radius", "5px")
        .style("color", "#fff")
        .text("a simple tooltip");

        var x = 0
        var y = 0
        for (let i = 0; i < values.length; i++) {
            for (let n_tree = 0; n_tree < values[i]; n_tree++) {
                //console.log("X", x, "Y", y);
                
                let className = "circ" + circoscrizione + plants[i].replaceAll(" ", "_");

                svg5.append("rect")
                    .attr("width", squareDimension)
                    .attr("height", squareDimension)
                    .attr("x", x)
                    .attr("y", y)
                    .attr("transform", `translate(${15},0)`)
                    .attr("fill", plantColor[i])
                    .attr("class", className)
                    // on mouseover: red bar and show tooltip
                    .on("mouseover", function (d, j) {
                        tooltip5.html(plants[i])
                            .style("visibility", "visible");
                        d3.selectAll("." + className).style("opacity", 0.7);
                    })
                    // move tooltip on move
                    .on("mousemove", function () {
                        tooltip5
                            .style("top", (event.pageY - 10) + "px")
                            .style("left", (event.pageX + 10) + "px");
                    })
                    // on mouseout: blue bar and hide tooltip
                    .on("mouseout", function () {
                        tooltip5.html(``).style("visibility", "hidden");
                        d3.selectAll("." + className).style("opacity", 1);
                    });

                x += squareDimension + squarePadding
                if (x != x % ((squareDimension + squarePadding) * 10))
                    y += squareDimension + squarePadding
                x %= (squareDimension + squarePadding) * 10
            }
        }
    }
});

/*
// https://evisat.github.io/6COSC006W-data-vis/dist/index.html

const dataUrl = 'https://raw.githubusercontent.com/evisat/6COSC006W-data-vis/89f39f8b26899fa85ca3bf99cb919aace6961e7a/src/assets/data/uowdata_clean.json?token=ACL2EJVOOQQVYYVO3M4VJ2S4656HG';

const div = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

async function fetchAsync () {
    let response = await fetch(dataUrl);
    let data = await response.json();

    return data
}

// trigger async function
// log response or catch error of fetch promise

fetchAsync()
    .then(data => {
  generateData(data)
})
    .catch(reason => console.log('error', reason.message))


function groupBy(xs, key) {
        return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

 function getData(d) {

        const groupedByLevels = this.groupBy(d, 'study_level')

        let ordered = {};
        Object.keys(groupedByLevels).sort().forEach(function(key) {
            ordered[key] = groupedByLevels[key];
        });

        let levels;
        for (let level in ordered) {
            levels = ordered[level]
            this.bakeWaffles(this.waffleData(levels), level);
        }
     
        this.generateLegend(this.waffleData(levels))
    }

function waffleData(data) {
        let newArr = [];
        data.forEach(function(d, i) {
            let obj = {};
            obj.age = d['accomm_type'];
            newArr.push(obj);
        });

        const newobj = [{
                age: "UoW Halls",
                population: newArr.filter((obj) => obj.age === "UoW Halls").length
            },
            {
                age: "Commuter",
                population: newArr.filter((obj) => obj.age === "Commuter").length
            },
            {
                age: "Other inc. Private Halls",
                population: newArr.filter((obj) => obj.age === "Other inc. Private Halls").length
            },
            {
                age: "Unknown",
                population: newArr.filter((obj) => obj.age === "Unknown").length
            }
        ]

        return newobj
    }

function getTotal(d) {
    let sum = 0
     for (let i in d) {
      sum += d[i].population
    }
     return sum
  }

function bakeWaffles(data, title) {
  const Total = getTotal(data);
  
        let total = 0;
        let width,
            height,
            widthSquares = 16,
            heightSquares = 9,
            squareSize = 25,
            squareValue = 0,
            gap = 1,
            theData = [];

        const myColors = d3.scaleOrdinal()
            .domain(["UoW Halls", "Commuter", "Other inc. Private Halls", "Unknown"])
            .range(["#EDAE49", "#D1495B", "#00798C", "#424B54"]);
  
  const ttColors = d3.scaleOrdinal()
            .domain(["UoW Halls", "Commuter", "Other inc. Private Halls", "Unknown"])
            .range(["#ba8839", "#91323f", "#00515e", "#23282d"]);

        //value of a square
        total = d3.sum(data, function(d) {
            return d.population;
        });
        squareValue = total / (widthSquares * heightSquares);

        //remap data
        data.forEach(function(d, i) {
            d.population = +d.population;
            d.units = Math.floor(d.population / squareValue);
            theData = theData.concat(
                Array(d.units + 1).join(1).split('').map(function() {
                    return {
                        squareValue: squareValue,
                        units: d.units,
                        population: d.population,
                        groupIndex: i
                    };
                })
            );
        });


        width = (squareSize * widthSquares) + widthSquares * gap + 25;
        height = (squareSize * heightSquares) + heightSquares * gap + 25;

        const svg = d3.select("#waffle-charts")
            .append("svg")
            .attr('class', 'waffle')
            .attr("width", width)
            .attr("height", height)

            svg.append("text")
            .attr("x", (width / 2.4))
            .attr("y", 30)
            .attr("dy", -10)
            .attr("class", "pie-title")
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-weight", "500")
            .text(title);

            svg.append("g")
            .attr('transform', "translate(0, 10)")
            .selectAll("div")
            .data(theData)
            .enter()
            .append("rect")
            .attr("width", squareSize)
            .attr("height", squareSize)
            .attr("class", d => 'class' + d.groupIndex + '' + title.replace(' ', ''))
            .attr("fill", d => myColors(data[d.groupIndex].age))
            .attr("x", function(d, i) {
                //group n squares for column
                let col = Math.floor(i / heightSquares);
                return (col * squareSize) + (col * gap);
            })
            .attr("y", function(d, i) {
                let row = i % heightSquares;
                return (heightSquares * squareSize) - ((row * squareSize) + (row * gap))
            })
            .on("mouseover", function(d){
              const classNameOfNodes = 'class' + d.groupIndex + '' + title.replace(' ', '')
                div.transition()
                .duration(100)
                .style("opacity", 1)
               
              var element = d3.selectAll('.' + classNameOfNodes)['_groups'][0]
              
              
              element.forEach(function(target, i) {
               element[i].setAttribute("fill", ttColors(data[d.groupIndex].age))
                
                 div.html("<span style = 'font-weight: bold'>" + (d["population"] / Total * 100).toFixed(2) + "%</span>")
                div.style("visibility", "visible")
                .style("left", (d3.event.pageX - 20) + "px")    
                .style("top", (d3.event.pageY - 35) + "px")
  });
              
               
          })
            .on("mousemove", function(d){
            div.style("left", (d3.event.pageX - 20) + "px")    
            .style("top", (d3.event.pageY - 65) + "px")
          })
          .on("mouseout", function(d){
            div.transition()
            .duration(500)
            div.style("visibility", "hidden")
             const classNameOfNodes = 'class' + d.groupIndex + '' + title.replace(' ', '')
             
              var element = d3.selectAll('.' + classNameOfNodes)['_groups'][0]
              element.forEach(function(target, i) {
               element[i].setAttribute("fill", myColors(data[d.groupIndex].age))
  });
              
           
          })
    }

function generateLegend(d) {
        const myColors = d3.scaleOrdinal()
            .domain(["UoW Halls", "Commuter", "Other inc. Private Halls", "Unknown"])
            .range(["#EDAE49", "#D1495B", "#00798C", "#424B54"]);


        const legendDiv = d3.select("#legend");

        const legendRow = legendDiv.selectAll("foo")
            .data(myColors.domain())
            .enter()
            .append("div")
            .attr('class', 'waffle-chart-legend--items')

        legendRow.append("div")
            .html("&nbsp")
            .attr("class", "rect")
            .style("background-color", d => myColors(d));

        legendRow.append("div")
            .attr('class', 'waffle-chart-legend--text')
            .html(d => d);

    }

function generateData(d) {

        for (let prop in d) {
            if (d.hasOwnProperty(prop)) {
                if (d[prop]['average_modulemark'] < 40) {
                    delete d[prop];
                }
            }
        };

        const groupedByDegree = this.groupBy(d, 'degree_type');
        let selectedDegree = groupedByDegree['BA'];


        this.getData(selectedDegree);

        const radios = document.getElementsByName('radio-class')

        for (let i = 0, max = radios.length; i < max; i++) {
            radios[i].onclick = () => {
                const self = this
                selectedDegree = groupedByDegree[radios[i].value];

                document.getElementById("degreeValue").innerHTML = radios[i].value;
                d3.selectAll('#waffle-charts svg').remove();
                d3.selectAll('#legend div').remove();
                this.getData(selectedDegree);
            }
        }
    }
*/