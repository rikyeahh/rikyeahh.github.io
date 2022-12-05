// radarchart

var RadarChart = {
    draw: function (id, d, options) {
        var cfg = {
            radius: 5,
            w: 1000,
            h: 600,
            factor: 1,
            factorLegend: .85,
            levels: 3,
            maxTemp: 0,
            radians: 2 * Math.PI,
            opacityArea: 0.1,
            ToRight: 5,
            TranslateX: 30,
            TranslateY: 30,
            ExtraWidthX: 100,
            ExtraWidthY: 100,
            color: d3.scaleOrdinal(d3.schemeCategory10)
        };

        if ('undefined' !== typeof options) {
            for (var i in options) {
                if ('undefined' !== typeof options[i]) {
                    cfg[i] = options[i];
                }
            }
        }
        cfg.maxTemp = Math.max(cfg.maxTemp, d3.max(d, function (i) { return d3.max(i.map(function (o) { return o.temp; })) }));
        var allYear = (d[0].map(function (i, j) { return i.month }));
        var total = allYear.length;
        var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
        var Format = d => parseInt(d) + "°C";
        d3.select(id).select("svg").remove();

        var g = d3.select(id)
            .append("svg")
            .attr("width", cfg.w + cfg.ExtraWidthX)
            .attr("height", cfg.h + cfg.ExtraWidthY)
            .append("g")
            .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
        ;


        //Circular segments
        for (var j = 0; j < cfg.levels - 1; j++) {
            var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
            g.selectAll(".levels")
                .data(allYear)
                .enter()
                .append("svg:line")
                .attr("x1", function (d, i) { return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total)); })
                .attr("y1", function (d, i) { return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total)); })
                .attr("x2", function (d, i) { return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total)); })
                .attr("y2", function (d, i) { return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total)); })
                .attr("class", "line")
                .style("stroke", "grey")
                .style("stroke-opacity", "0.75")
                .style("stroke-width", "0.3px")
                .attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
        }

        //Text indicating at what % each level is
        var legendLabels = []
        for (let i = 0; i < cfg.maxTemp; i += (cfg.maxTemp - cfg.minTemp) / cfg.levels) {
            legendLabels.push(i);
        }
        for (var j = 0; j < cfg.levels; j++) {
            var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
            g.selectAll(".levels")
                .data([1]) //dummy data
                .enter()
                .append("svg:text")
                .attr("x", function (d) { return levelFactor * (1 - cfg.factor * Math.sin(0)); })
                .attr("y", function (d) { return levelFactor * (1 - cfg.factor * Math.cos(0)); })
                .attr("class", "legend")
                .style("font-family", "sans-serif")
                .style("font-size", "10px")
                .attr("transform", "translate(" + (cfg.w / 2 - levelFactor + cfg.ToRight) + ", " + (cfg.h / 2 - levelFactor) + ")")
                .attr("fill", "#737373")
                .text(Format(legendLabels[j]));
        }

        var series = 0;

        var year = g.selectAll(".month")
            .data(allYear)
            .enter()
            .append("g")
            .attr("class", "year");

        year.append("line")
            .attr("x1", cfg.w / 2)
            .attr("y1", cfg.h / 2)
            .attr("x2", function (d, i) { return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total)); })
            .attr("y2", function (d, i) { return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total)); })
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-width", "1px");

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        year.append("text")
            .attr("class", "legend")
            .text(function (d) { return months[d - 1] })
            .style("font-family", "sans-serif")
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "1.5em")
            .attr("transform", function (d, i) { return "translate(0, -10)" })
            .attr("x", function (d, i) { return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total); })
            .attr("y", function (d, i) { return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total); });


        d.forEach(function (y, x) {
            dataTemps = [];
            g.selectAll(".nodes")
                .data(y, function (j, i) {
                    dataTemps.push([
                        cfg.w / 2 * (1 - (parseFloat(Math.max(j.temp, 0)) / cfg.maxTemp) * cfg.factor * Math.sin(i * cfg.radians / total)),
                        cfg.h / 2 * (1 - (parseFloat(Math.max(j.temp, 0)) / cfg.maxTemp) * cfg.factor * Math.cos(i * cfg.radians / total))
                    ]);
                });
            dataTemps.push(dataTemps[0]);
            g.selectAll(".area")
                .data([dataTemps])
                .enter()
                .append("polygon")
                .attr("class", "radar-chart-serie" + series)
                .style("stroke-width", "1px")
                .style("stroke", cfg.color(series))
                .attr("points", function (d) {
                    var str = "";
                    for (var pti = 0; pti < d.length; pti++) {
                        str = str + d[pti][0] + "," + d[pti][1] + " ";
                    }
                    return str;
                })
                .style("fill", function (j, i) { return cfg.color(series) })
                .style("fill-opacity", cfg.opacityArea)
                .on('mouseover', function (d) {
                    z = "polygon." + d3.select(this).attr("class");
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0.1);
                    g.selectAll(z)
                        .transition(200)
                    //.style("fill-opacity", .7);
                })
                .on('mouseout', function () {
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", cfg.opacityArea);
                });
            series++;
        });
        series = 0;

        d.forEach(function (y, x) {
            g.selectAll(".nodes")
                .data(y).enter()
                .append("svg:circle")
                .attr("class", "radar-chart-serie" + series)
                .attr('r', cfg.radius)
                .attr("alt", function (j) { return Math.max(j.temp, 0) })
                .attr("cx", function (j, i) {
                    dataTemps.push([
                        cfg.w / 2 * (1 - (parseFloat(Math.max(j.temp, 0)) / cfg.maxTemp) * cfg.factor * Math.sin(i * cfg.radians / total)),
                        cfg.h / 2 * (1 - (parseFloat(Math.max(j.temp, 0)) / cfg.maxTemp) * cfg.factor * Math.cos(i * cfg.radians / total))
                    ]);
                    return cfg.w / 2 * (1 - (Math.max(j.temp, 0) / cfg.maxTemp) * cfg.factor * Math.sin(i * cfg.radians / total));
                })
                .attr("cy", function (j, i) {
                    return cfg.h / 2 * (1 - (Math.max(j.temp, 0) / cfg.maxTemp) * cfg.factor * Math.cos(i * cfg.radians / total));
                })
                .attr("data-id", function (j) { return j.month })
                .style("fill", cfg.color(series)).style("fill-opacity", .9)
                .on('mouseover', function (d) {
                    return;
                })
                .on('mouseout', function () {
                    return;
                })
                .append("svg:title")
                .text(function (j) { return Math.max(j.temp, 0) });

            series++;
        });
    }
};


//Options for the Radar chart, other than default
var mycfg = {
    w: 600,
    h: 600,
    maxTemp: 37,
    minTemp: 0,
    levels: 10,
    ExtraWidthX: 100
}

//Call function to draw the Radar chart
//Will expect that data is in %'s
d3.csv("../assets/data10.csv").then(data => {

    data = data.filter(line => line.year.slice(-3) == "avg")
    mycfg.minTemp = Math.min(...data.map(line => line.temp))
    mycfg.maxTemp = Math.max(...data.map(line => line.temp))
    const sumstat = d3.group(data, d => d.year);
    arrayData = [];
    sumstat.forEach(element => {
        //console.log(element);
        arrayData.push(element)
    });

    RadarChart.draw("#graph2", arrayData, mycfg);
});