console.log("ciao");

const BGCOLOR = "#F4EBDC";

function categoryToColor(category) {
    switch (category) {
        case "Chemistry":
            return "#8B0017";
        case "Economic Sciences":
            return "#00468B";
        case "Physics":
            return "seagreen";
        case "Literature":
            return "goldenrod";
        case "Medicine":
            return "#660066";
        case "Peace":
            return "salmon";
        default:
            return "black";
    }
}

d3.select("#graph")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "gray")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "2px")
    .style("padding", "5px")
    .style("position", "absolute")
    .style("width", "300px");


function hoverOnElement(event) {
    showTooltip(event);
    grayAllColoredParts(event.target);
}

function hoverOutElement(event) {
    ungrayAllColoredParts(event.target);
    hideTooltip(event);
}

function grayAllColoredParts(except) {
    // take every element in the page with a fill attribute and make it gray
    d3.selectAll("[fill]").each(function () {
        if (this.getAttribute("doNotGray")) {
            return;
        }
        if (this != except && this.getAttribute("fill") != "None" & this.getAttribute("fill") != "none") {
            this.setAttribute("fillMemory", this.getAttribute("fill"));
            this.setAttribute("fill", "gray");
        }
    });
    // do the same for the "stroke" attribute
    d3.selectAll("[stroke]").each(function () {
        if (this.getAttribute("doNotGray")) {
            return;
        }
        if (this != except & this.getAttribute("stroke") != "None" & this.getAttribute("stroke") != "none") {
            this.setAttribute("strokeMemory", this.getAttribute("stroke"));
            this.setAttribute("stroke", "gray");
        }
    });
    // make the except element opacity 1
    except.setAttribute("opacityMemory", except.getAttribute("opacity"));
    except.setAttribute("opacity", 1);
}

function ungrayAllColoredParts(except) {
    // take every element in the page with a fill attribute and make it gray
    d3.selectAll("[fillMemory]").each(function () {
        this.setAttribute("fill", this.getAttribute("fillMemory"));
        this.removeAttribute("fillMemory");
    });
    // do the same for the "stroke" attribute
    d3.selectAll("[strokeMemory]").each(function () {
        this.setAttribute("stroke", this.getAttribute("strokeMemory"));
        this.removeAttribute("strokeMemory");
    });
    // make the except element opacity 1
    except.setAttribute("opacity", except.getAttribute("opacityMemory"));
    except.removeAttribute("opacityMemory");
}

function showTooltip(event) {
    // get absolute x and y
    fill = event.target.getAttribute("fill");
    stroke = event.target.getAttribute("stroke");
    color = fill == "None" ? stroke : fill;
    // make it lighter
    color = d3.color(color).brighter(1.5);

    text = event.target.getAttribute("textOnHover");

    const tooltip = d3.select("#tooltip");
    tooltip.style("opacity", 1);
    tooltip.html(text);
    tooltip.style("left", (event.pageX + 10) + "px");
    tooltip.style("top", (event.pageY - 10) + "px")
    tooltip.style("background-color", color);
}

function hideTooltip(event) {
    const tooltip = d3.select("#tooltip");
    tooltip.style("opacity", 0);
    tooltip.html("");
    tooltip.style("left", "0px");
    tooltip.style("top", "0px");
}

/* text and legend */
function legendText() {
    // add 10 pixels of margin on the left
    const svg = d3.select('#graph')
        .append('svg')
        .attr('width', 440)
        .attr('height', 280)
        .style('background-color', BGCOLOR)

    const texts = ["Nobel Prizes", "and laureates,", "1901-2016"];
    var subtract_x = 30;
    texts.forEach(function (text, i) {
        svg.append('text')
            .text(text)
            .attr('x', 100 - subtract_x)
            .attr('y', 100 + i * 19)
            .attr('text-anchor', 'left')
            .attr('fill', 'black')
            .attr('font-size', 20)
            .attr("font-weight", 700)
            .attr('opacity', 1)
    });

    const texts2 = ["Visualized for each candidate are",
        "prize category, year the prize was",
        "awarded and age of the recipient",
        "at the time. Visualized for each",
        "category are the grade level, pricipal",
        "academic affiliations, and principal",
        "hometowns of laureates."];

    texts2.forEach(function (text, i) {
        svg.append('text')
            .text(text)
            .attr('x', 100 - subtract_x)
            .attr('y', 170 + i * 15)
            .attr('text-anchor', 'left')
            .attr('fill', 'black')
            .attr('font-size', 11)
            .attr("font-weight", 300)
            .attr('opacity', 1)
    });
    svg.append('line')
        .attr("stroke", "black")
        .style("stroke-width", 1)
        .attr("x1", 320 - subtract_x)
        .attr("y1", 100)
        .attr("x2", 320 - subtract_x)
        .attr("y2", 260);

    const texts3 = ["How to", "read it"];
    texts3.forEach(function (text, i) {
        svg.append('text')
            .text(text)
            .attr('x', 340 - subtract_x)
            .attr('y', 110 + i * 19)
            .attr('text-anchor', 'left')
            .attr('fill', 'black')
            .attr('font-size', 15)
            .attr("font-weight", 700)
            .attr('opacity', 1)
    });

    const texts4 = ["Each dot represents", "a Nobel laureate,", "each recipient is positioned", "according to the year the", "prize was awarded (x axis)", "and the age of the person", "at the time of", "the award (y axis)."];
    texts4.forEach(function (text, i) {
        svg.append('text')
            .text(text)
            .attr('x', 340 - subtract_x)
            .attr('y', 160 + i * 10)
            .attr('text-anchor', 'left')
            .attr('fill', 'black')
            .attr('font-size', 9)
            .attr("font-weight", 300)
            .attr('opacity', 1)
    });


}
legendText();

function legendGraph() {

    // svg placed horizontally with respect to the previous one
    const svg = d3.select('#graph')
        .append('svg')
        .attr('width', 1000)
        .attr('height', 280)
        .style('background-color', BGCOLOR)
        .style('margin-left', 0)

    /* legend */
    var subtract_x = 300;
    // make a grid of 6 lines
    for (let nLine = 0; nLine < 6; nLine++) {
        svg.append('line')
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("opacity", 0.3)
            .attr("x1", (nLine > 3 ? 710 : 600) - subtract_x)
            .attr("y1", 120 + (nLine * 10))
            .attr("x2", 900 - subtract_x)
            .attr("y2", 120 + (nLine * 10));
    }

    // draw vertical lines at the center of the horizontal ones
    svg.append('line')
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr("opacity", 0.3)
        .attr("x1", 820 - subtract_x)
        .attr("y1", 120)
        .attr("x2", 820 - subtract_x)
        .attr("y2", 180);
    svg.append('line')
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr("opacity", 0.3)
        .attr("x1", 870 - subtract_x)
        .attr("y1", 120)
        .attr("x2", 870 - subtract_x)
        .attr("y2", 170);

    // draw 10 years indication
    svg.append("line")
        .attr("x1", 710 - subtract_x)
        .attr("y1", 160)
        .attr("x2", 710 - subtract_x)
        .attr("y2", 170)
        .attr("stroke", "gray")
        .attr("stroke-width", 0.8)
        .attr("opacity", 0.7);
    // dots at the extremes
    svg.append('circle')
        .attr('cx', 710 - subtract_x)
        .attr('cy', 160)
        .attr('r', 2)
        .attr('fill', "gray")
        .attr('opacity', 0.66)
    svg.append('circle')
        .attr('cx', 710 - subtract_x)
        .attr('cy', 170)
        .attr('r', 2)
        .attr('fill', "gray")
        .attr('opacity', 0.66)
    // "10 years text"
    svg.append("text")
        .text("10  years")
        .attr("x", 680 - subtract_x)
        .attr("y", 168)
        .attr("text-anchor", "middle")
        .attr("fill", "gray")
        .attr("font-size", 10)
        .attr('font-style', 'italic')


    // draw dots
    xs = [620, 680, 680, 700, 750, 780, 810, 840];
    ys = [142, 120, 132, 129, 140, 128, 139, 125];
    // draw them
    xs.forEach(function (x, i) {
        svg.append('circle')
            .attr('cx', x - subtract_x)
            .attr('cy', ys[i])
            .attr('r', 3)
            .attr('fill', categoryToColor("Chemistry"))
            .attr('opacity', 0.66)
    });
    // add 10 random points to lists.
    // x range is [610, 840], y range is [120, 140]
    for (let i = 0; i < 5; i++) {
        const x = 610 + Math.random() * 230;
        const y = 120 + Math.random() * 20;
        svg.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', 3)
            .attr('fill', "white")
            .attr('opacity', 0)
        // add x and y to list
        xs.push(x);
        ys.push(y);
    }
    // sort xy couples by x
    const xy = xs.map((x, i) => [x - subtract_x, ys[i]]);
    xy.sort((a, b) => a[0] - b[0]);
    // draw smoothed lines between each point
    const line = d3.line().curve(d3.curveCardinal.tension(0.8));
    svg.append('path')
        .attr('d', line(xy))
        .attr('stroke', categoryToColor("Chemistry"))
        .attr('stroke-width', 0.7)
        .attr('fill', 'none')
    // circle around the last one
    svg.append('circle')
        .attr('cx', 840 - subtract_x)
        .attr('cy', 125)
        .attr('r', 5)
        .attr('fill', 'none')
        .attr('stroke', "red")
        .attr('stroke-width', 1)
        .attr('opacity', 0.7)

    // line on the average
    svg.append('line')
        .attr("stroke", "black")
        .attr("x1", 510 - subtract_x)
        .attr("y1", 132)
        .attr("x2", 900 - subtract_x)
        .attr("y2", 132)
        .attr("stroke", categoryToColor("Chemistry"))
        .attr('opacity', 0.6)
        .attr('stroke-width', 1.5);

    // dashed line
    svg.append('line')
        .style("stroke", "black")
        .style("stroke-width", 1.3)
        .style("stroke-dasharray", ("5, 8"))
        .attr("x1", 510 - subtract_x)
        .attr("y1", 148)
        .attr("x2", 900 - subtract_x)
        .attr("y2", 148)
        .attr('opacity', 0.7);


    // texts
    svg.append('text')
        .text("average age")
        .attr('x', 540 - subtract_x)
        .attr('y', 160)
        .attr('text-anchor', 'end')
        .attr('fill', 'black')
        .attr('font-size', 9);
    svg.append('text')
        .text("of Nobel laureate")
        .attr('x', 540 - subtract_x)
        .attr('y', 170)
        .attr('text-anchor', 'end')
        .attr('fill', 'black')
        .attr('font-size', 9);

    svg.append('text')
        .text("average age for")
        .attr('x', 540 - subtract_x)
        .attr('y', 115)
        .attr('text-anchor', 'end')
        .attr('fill', categoryToColor("Chemistry"))
        .attr('font-size', 9);
    svg.append('text')
        .text("each category")
        .attr('x', 540 - subtract_x)
        .attr('y', 125)
        .attr('text-anchor', 'end')
        .attr('fill', categoryToColor("Chemistry"))
        .attr('font-size', 9)

    var texts5 = ["Nobel", "awarded to", "more than one", "person"];
    texts5.forEach(function (text, i) {
        svg.append('text')
            .text(text)
            .attr('x', 680 - subtract_x)
            .attr('y', 75 + i * 10)
            .attr('text-anchor', 'left')
            .attr('fill', "gray")
            .attr('font-size', 9)
            .attr("font-weight", 300)
            .attr('opacity', 1)
    });
    // short vertical line under it
    svg.append('line')
        .attr("stroke", "gray")
        .attr("x1", 680 - subtract_x)
        .attr("y1", 107)
        .attr("x2", 680 - subtract_x)
        .attr("y2", 120)
        .attr("opacity", 1)
        .attr("stroke-width", 0.5);

    // above the circled line, write man / woman
    svg.append('text')
        .text("man")
        .attr('x', 840 - subtract_x)
        .attr('y', 85)
        .attr('text-anchor', 'left')
        .attr('fill', "gray")
        .attr('font-size', 9);
    svg.append('text')
        .text("woman")
        .attr('x', 840 - subtract_x)
        .attr('y', 102)
        .attr('text-anchor', 'left')
        .attr('fill', "gray")
        .attr('font-size', 9);
    // draw the two dots
    svg.append('circle')
        .attr('cx', 830 - subtract_x)
        .attr('cy', 82)
        .attr('r', 3)
        .attr('fill', categoryToColor("Chemistry"))
        .attr('opacity', 0.7)
    // draw the two dots
    svg.append('circle')
        .attr('cx', 830 - subtract_x)
        .attr('cy', 100)
        .attr('r', 3)
        .attr('fill', categoryToColor("Chemistry"))
        .attr('opacity', 0.7)
    // circle arount it
    svg.append('circle')
        .attr('cx', 830 - subtract_x)
        .attr('cy', 100)
        .attr('r', 5)
        .attr('fill', 'none')
        .attr('stroke', "red")
        .attr('stroke-width', 1)
        .attr('opacity', 0.7)

    // draw the matrix
    const educationWidth = 58;
    const educationHeight = 61;
    const spaceBetweenCategories = 80;
    const spaceBetween5Years = 30;
    const ySpaceForYears = 100;
    const scatterWidth = 900;
    const educationTypes = ["PhD", "master", "bachelor", "no degree"];
    const x = scatterWidth + 15;
    const y = ySpaceForYears - 5;
    svg.append('rect')
        .attr('x', x - subtract_x)
        .attr('y', y + 20)
        .attr('width', educationWidth + 13)
        .attr('height', educationHeight)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 1.8)
        .attr('opacity', 0.66)
    svg.append('rect')
        .attr('x', x + 7 - subtract_x)
        .attr('y', y - 5)
        .attr('width', educationWidth - 1)
        .attr('height', 360)
        .attr('stroke', BGCOLOR)
        .attr('fill', BGCOLOR)
        .attr("doNotGray", true);

    // write educationTypes
    educationTypes.forEach(function (education, i) {
        svg.append('text')
            .text(education)
            .attr('x', x + 35 - subtract_x)
            .attr('y', y + 35 + i * 12)
            .attr('text-anchor', 'center')
            .attr('fill', categoryToColor("Chemistry"))
            .attr('font-size', 11)
            .attr('opacity', 0.7)
            .style("text-anchor", "middle")
    });
    svg.append('text')
        .text("grade")
        .attr('x', x + 35 - subtract_x)
        .attr('y', y + 7)
        .attr('text-anchor', 'center')
        .attr('fill', "gray")
        .attr('font-size', 11)
        .attr('opacity', 0.7)
        .style("text-anchor", "middle");
    svg.append('text')
        .text("level")
        .attr('x', x + 35 - subtract_x)
        .attr('y', y + 20)
        .attr('text-anchor', 'center')
        .attr('fill', "gray")
        .attr('font-size', 11)
        .attr('opacity', 0.7)
        .style("text-anchor", "middle");
    // vertical line besides it
    svg.append('line')
        .attr('x1', x + 80 - subtract_x)
        .attr('y1', y + 22)
        .attr('x2', x + 80 - subtract_x)
        .attr('y2', y + 75)
        .attr('stroke', categoryToColor("Chemistry"))
        .attr('stroke-width', 5)
        .attr('opacity', 0.66)
    // small lines across it
    const quasirandom_ys = [-4, 13, 25, 35];
    educationTypes.forEach(function (education, i) {
        svg.append('line')
            .attr('x1', x + 75 - subtract_x)
            .attr('y1', y + 30 + quasirandom_ys[i])
            .attr('x2', x + 85 - subtract_x)
            .attr('y2', y + 30 + quasirandom_ys[i])
            .attr('stroke', BGCOLOR)
            .attr('stroke-width', 1.7)
            .attr('opacity', 1)
            .attr("doNotGray", true);

    });

    // text text to it
    const texts6 = ["Principal", "university", "affiliations", "of Nobel", "laureates at", "the moment the Prize", "was awarded."];
    texts6.forEach(function (text, i) {
        svg.append('text')
            .text(text)
            .attr('x', x + 130 - subtract_x)
            .attr('y', y + 80 + i * 12)
            .attr('text-anchor', 'left')
            .attr('fill', categoryToColor("Chemistry"))
            .attr('font-size', 11)
            .attr('opacity', 0.7)
    });
    const startingPoint = [x + 85 - subtract_x, y + 22]
    const endingpoint = [x + 129 - subtract_x, y + 76];
    const points = [startingPoint, endingpoint];
    const curve = d3.line().curve(d3.curveBumpX);
    svg.append('path')
        .attr('d', curve(points))
        .attr('stroke', categoryToColor("Chemistry"))
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('opacity', 0.6);
}
legendGraph();

/* main part */
d3.json("complete_processed.json").then(function (data) {

    // keep data only until 2016
    data = data.filter(d => d.awardYear <= 2016);

    const svg = d3.select('#graph')
        .append('svg')
        .attr('width', 1280)
        .attr('height', 580)
        .style('background-color', BGCOLOR);

    // unique values in data.category values
    const categories = ["Chemistry", "Economic Sciences", "Physics", "Literature", "Medicine", "Peace"];

    const ySpaceForYears = 100;
    const scatterWidth = 900;

    const spaceBetweenCategories = 80;

    // for each one, print its text right-aligned
    categories.forEach(function (category, i) {
        svg.append('text')
            .text(category.toUpperCase())
            .attr('x', 200)
            .attr('y', ySpaceForYears + (i * spaceBetweenCategories) + 10)
            .attr('text-anchor', 'end')
            .attr('fill', categoryToColor(category));
    });


    categories.forEach(function (category, i) {
        // draw 6 horizontal lines spaced by 5 pixels
        for (let nLine = 0; nLine < 6; nLine++) {
            svg.append('line')
                .style("stroke", "black")
                .style("stroke-width", 1)
                .attr("opacity", 0.3)
                .attr("x1", 210)
                .attr("y1", ySpaceForYears + (nLine * 10) + (i * spaceBetweenCategories))
                .attr("x2", scatterWidth + 7)
                .attr("y2", ySpaceForYears + (nLine * 10) + (i * spaceBetweenCategories));
        }
    });

    // draw vertical lines
    const spaceBetween5Years = 30;
    for (let i = 0; i < 24; i++) {
        svg.append('line')
            .style("stroke", (i % 6 == 0 ? "black" : "gray"))
            .style("stroke-width", (i % 6 == 0 ? 1.2 : 1))
            .attr("opacity", 0.3)
            .attr("x1", 210 + (i * spaceBetween5Years))
            .attr("y1", ySpaceForYears - (i % 2 == 0 ? 20 : 10))
            .attr("x2", 210 + (i * spaceBetween5Years))
            .attr("y2", ySpaceForYears * 5 + 50 + (i % 6 == 0 ? 10 : 0));
        years = [1901, 1911, 1921, 1931, 1941, 1951, 1961, 1971, 1981, 1991, 2001, 2011];
        if (i % 2 == 0) {
            svg.append('text')
                .text(years[i / 2])
                .attr('x', 210 + (i * spaceBetween5Years))
                .attr('y', ySpaceForYears - 25)
                .attr('text-anchor', 'middle')
                .attr('fill', 'black')
                .attr('font-size', (i % 3 == 0 ? 15 : 10))
        }
        if (i % 6 == 0) {
            svg.append('text')
                .text(years[i / 2])
                .attr('x', 210 + (i * spaceBetween5Years))
                .attr('y', ySpaceForYears * 5 + 50 + 25)
                .attr('text-anchor', 'middle')
                .attr('fill', 'black')
                .attr('font-size', (i % 3 == 0 ? 15 : 10))
        }
    }
    // small aesthetic adjustment on the first vertical line
    categories.forEach(function (category) {
        svg.append('line')
            .style("stroke-width", 1)
            .attr("stroke", categoryToColor(category))
            .attr("x1", 210)
            .attr("y1", ySpaceForYears + (categories.indexOf(category) * spaceBetweenCategories))
            .attr("x2", 210)
            .attr("y2", ySpaceForYears + (categories.indexOf(category) * spaceBetweenCategories) + 50)
        svg.append('line')
            .style("stroke-width", categories.indexOf(category) == categories.length - 1 ? 0 : 2)
            .attr("stroke", BGCOLOR)
            .attr("x1", 210)
            .attr("y1", ySpaceForYears + (categories.indexOf(category) * spaceBetweenCategories) + 50)
            .attr("x2", 210)
            .attr("y2", ySpaceForYears + (categories.indexOf(category) * spaceBetweenCategories) + spaceBetweenCategories)
    });

    // draw points
    const minAge = d3.min(data, d => d.age);
    const maxAge = d3.max(data, d => d.age);
    data.forEach(function (d) {
        const year = d.awardYear;
        const category = d.category;
        const age = d.age;
        const x = 210 + (year - 1901) * (spaceBetween5Years / 5);
        // interpolate between min (ySpaceForYears) and max (ySpaceForYears + 50)
        const y = ySpaceForYears + 50 + categories.indexOf(category) * spaceBetweenCategories - (age - minAge) * (50 / (maxAge - minAge));
        svg.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', 3)
            .attr('fill', categoryToColor(category))
            .attr('opacity', 0.66)
            .attr('textOnHover', `<b>${d.name}</b> (${d.age} years) <br><hr> Awarded in ${d.awardYear} ${d.motivation}.`)
            .on("mouseover", (e) => { hoverOnElement(e) })
            .on("mouseout", (e) => { hoverOutElement(e) })
            .on("click", (e) => { window.location.href = d.laureate_link });
        // if female make a small empty circle around
        if (d.gender == "female") {
            svg.append('circle')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', 5)
                .attr('fill', 'none')
                .attr('stroke', "red")
                .attr('stroke-width', 1)
                .attr('opacity', 0.7)
        }
    });


    // for each category, draw a line connecting the points
    categories.forEach(function (category) {
        const filteredData = data.filter(d => d.category == category);
        const line = d3.line()
            .x(d => 210 + (d.awardYear - 1901) * (spaceBetween5Years / 5))
            .y(d => ySpaceForYears + 50 + categories.indexOf(category) * spaceBetweenCategories - (d.age - minAge) * (50 / (maxAge - minAge)))
        svg.append('path')
            .datum(filteredData)
            .attr('d', line)
            .attr('stroke', categoryToColor(category))
            .attr('stroke-width', 0.7)
            .attr('fill', 'none')
    });

    // draw dashed line on 59 years for each category
    categories.forEach(function (category) {
        const y = ySpaceForYears + 50 + categories.indexOf(category) * spaceBetweenCategories - (59 - minAge) * (50 / (maxAge - minAge));
        svg.append('line')
            .style("stroke", "black")
            .style("stroke-width", 1.3)
            .style("stroke-dasharray", ("5, 8"))
            .attr("x1", 210 - 7)
            .attr("y1", y)
            .attr("x2", scatterWidth)
            .attr("y2", y)
            .attr('opacity', 0.7);
        svg.append('text')
            .text("(59 years)")
            .attr('x', 210 - 12)
            .attr('y', y + 2)
            .attr('text-anchor', 'end')
            .attr('fill', 'black')
            .attr('font-size', 12);
    });

    // draw average line for each category
    categories.forEach(function (category) {
        const filteredData = data.filter(d => d.category == category);
        const avgAge = d3.mean(filteredData, d => d.age);
        const y = ySpaceForYears + 50 + categories.indexOf(category) * spaceBetweenCategories - (avgAge - minAge) * (50 / (maxAge - minAge));
        svg.append('line')
            .attr("stroke", categoryToColor(category))
            .attr("x1", 210 - 7)
            .attr("y1", y)
            .attr("x2", scatterWidth)
            .attr("y2", y)
            .attr('opacity', 0.7)
            .attr('stroke-width', 1.5);
    });

    /***************** Education distribution */

    // make a matrix shape on the right of each category
    const educationWidth = 58;
    const educationHeight = 61;
    categories.forEach(function (category) {
        svg.append('rect')
            .attr('x', scatterWidth + 15)
            .attr('y', ySpaceForYears - 5 + categories.indexOf(category) * spaceBetweenCategories)
            .attr('width', educationWidth)
            .attr('height', educationHeight)
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 1.8)
            .attr('opacity', 0.66)

    });
    svg.append('rect')
        .attr('x', scatterWidth + 22)
        .attr('y', ySpaceForYears - 10)
        .attr('width', educationWidth - 15)
        .attr('height', ySpaceForYears - 25 + 5 * spaceBetweenCategories)
        .attr('stroke', BGCOLOR)
        .attr('fill', BGCOLOR)
        .attr("doNotGray", true)

    // draw education distribution
    categories.forEach(function (category) {
        const filteredData = data.filter(d => d.category == category);
        const educationTypes = ["PhD", "Master degree", "Bachelor degree", "No degree"];
        var educationCounts = d3.rollup(filteredData, v => v.length, d => _.sample(educationTypes));
        // order educationCounts by educationTypes
        educationCounts = new Map([...educationCounts.entries()].sort((a, b) => educationTypes.indexOf(a[0]) - educationTypes.indexOf(b[0])));
        const total = d3.sum(Array.from(educationCounts.values()));
        let y = ySpaceForYears + categories.indexOf(category) * spaceBetweenCategories;
        educationCounts.forEach(function (count, education) {
            const width = count / total * educationHeight;
            svg.append('rect')
                .attr('x', scatterWidth + 20)
                .attr('y', y)
                .attr('width', width)
                .attr('height', 8.5)
                .attr('fill', categoryToColor(category))
                .attr('opacity', 0.66)
                .attr('textOnHover', `${count} ${education}s in ${category}`)
                .on("mouseover", (e) => { hoverOnElement(e) })
                .on("mouseout", (e) => { hoverOutElement(e) });
            y += 14;
            svg.append("line")
                .attr("x1", scatterWidth + 20)
                .attr("y1", ySpaceForYears + categories.indexOf(category) * spaceBetweenCategories + (educationTypes.indexOf(education) * 14) + 8.5 / 2)
                .attr("x2", scatterWidth + 20 + 45)
                .attr("y2", ySpaceForYears + categories.indexOf(category) * spaceBetweenCategories + (educationTypes.indexOf(education) * 14) + 8.5 / 2)
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("opacity", 0.44)
        });
        svg.append("line")
            .attr("x1", scatterWidth + 20 + 58)
            .attr("y1", ySpaceForYears + categories.indexOf(category) * spaceBetweenCategories)
            .attr("x2", scatterWidth + 20 + 58)
            .attr("y2", ySpaceForYears + categories.indexOf(category) * spaceBetweenCategories + 5 * 10)
            .attr("stroke", categoryToColor(category))
            .attr("stroke-width", 1.2)
            .attr("opacity", 0.5)
    });

    /********** Sankey diagram */

    // apply mapping
    data.forEach(function (d) {
        if (d.affiliation_1 == "Harvard University, Cambridge, MA, USA") {
            d.affiliation_1 = "Harvard";
        } else if (d.affiliation_1 == "Massachusetts Institute of Technology (MIT), Cambridge, MA, USA") {
            d.affiliation_1 = "MIT";
        } else if (d.affiliation_1 == "Stanford University, Stanford, CA, USA") {
            d.affiliation_1 = "Stanford";
        } else if (d.affiliation_1 == "University of California, Berkeley, CA, USA") {
            d.affiliation_1 = "Berkeley";
        } else if (d.affiliation_1 == "California Institute of Technology (Caltech), Pasadena, CA, USA") {
            d.affiliation_1 = "Caltech";
        } else if (d.affiliation_1 == "University of Cambridge, Cambridge, United Kingdom") {
            d.affiliation_1 = "Cambridge";
        } else if (d.affiliation_1 == "Columbia University, New York, NY, USA") {
            d.affiliation_1 = "Columbia";
        } else {
            d.affiliation_1 = "Others";
        }
    });
    // remove others
    data = data.filter(d => d.affiliation_1 != "Others");

    var maxCountInCategories = 0;
    categories.forEach(function (category) {
        const filteredData = data.filter(d => d.category == category);
        const affiliations = d3.rollup(filteredData, v => v.length, d => d.affiliation_1);
        const total = d3.sum(Array.from(affiliations.values()));
        if (total > maxCountInCategories) {
            maxCountInCategories = total;
        }
    });
    const singleValueWidth = 50 / maxCountInCategories;


    var affiliationShifts = new Map();
    const affiliationsUniq = ["Harvard", "MIT", "Stanford", "Caltech", "Columbia", "Cambridge", "Berkeley"];
    affiliationsUniq.forEach(function (affiliation) {
        affiliationShifts.set(affiliation, 0);
    });
    categories.forEach(function (category) {

        const filteredData = data.filter(d => d.category == category);
        // counts of d.affiliation_1 for each category
        const affiliations = d3.rollup(filteredData, v => v.length, d => d.affiliation_1);
        // sort affiliations by having the same order as affiliationsUniq
        const sortedAffiliations = new Map();
        affiliationsUniq.forEach(function (affiliation) {
            sortedAffiliations.set(affiliation, affiliations.get(affiliation) || 0);
        });

        var prevWidth = 0;
        var cumulativeWidth = 0;
        sortedAffiliations.forEach(function (count, affiliation) {
            if (count == 0) {
                return;
            }

            const width = singleValueWidth * count

            const yShift = prevWidth / 2 + width / 2;
            const y_start = ySpaceForYears + categories.indexOf(category) * spaceBetweenCategories + cumulativeWidth + yShift;
            const x_start = scatterWidth + 15 + educationWidth + 10;

            const yShiftEnd = affiliationShifts.get(affiliation) + width / 2;
            const y_end = ySpaceForYears + affiliationsUniq.indexOf(affiliation) * 43 + yShiftEnd + 85;
            const x_end = 1130;

            affiliationShifts.set(affiliation, affiliationShifts.get(affiliation) + width + 1);

            const startingPoint = [x_start, y_start]
            const endingpoint = [x_end, y_end];
            const points = [startingPoint, endingpoint];

            const curve = d3.line().curve(d3.curveBumpX);
            const names = filteredData.filter(d => d.affiliation_1 == affiliation).map(d => d.name);
            const years = filteredData.filter(d => d.affiliation_1 == affiliation).map(d => d.awardYear);
            const infoString = names.map((name, i) => `${name} (${years[i]})`).join("<br>");
            svg.append('path')
                .attr('d', curve(points))
                .attr('stroke', categoryToColor(category))
                .attr('stroke-width', width)
                .attr('fill', 'None')
                .attr('opacity', 0.66)
                .attr('textOnHover', `<b>${count}</b> ${category} laureates are affiliated to <b>${affiliation}</b>: <br><hr>${infoString}`)
                .on("mouseover", (e) => { hoverOnElement(e) })
                .on("mouseout", (e) => { hoverOutElement(e) });

            prevWidth = width;
            cumulativeWidth += yShift + 1;
        });
    });

    affiliationShifts.forEach(function (shift, affiliation) {
        const y = ySpaceForYears + affiliationsUniq.indexOf(affiliation) * 43 + 85;
        // in italic and bold
        svg.append('text')
            .text(affiliation)
            .attr('x', 1145)
            .attr('y', y + shift)
            .attr('text-anchor', 'start')
            .attr('fill', 'black')
            .attr('font-size', 14)
            .attr('opacity', 0.8)
            .attr('font-style', 'italic')
            .attr('font-weight', 'bold')

        svg.append('line')
            .attr('x1', 1132.5)
            .attr('y1', y)
            .attr('x2', 1132.5)
            .attr('y2', y + shift)
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('opacity', 0.7)
    });
});

/* stacked histogram */
d3.json("complete_processed.json").then(function (data) {
    const svg = d3.select('#graph')
        .append('svg')
        .attr('width', 1280)
        .attr('height', 220)
        .style('background-color', BGCOLOR);

    const cities = ["Chicago", "Washington", "New York", "Boston", "London", "Paris", "Munich", "Berlin", "Vienna", "Budapest", "Moscow"]
    // values from data.awardYear starting from 1901 and every 30 years
    const years = [];
    const start = 1901;
    for (let i = 0; i < d3.max(data, d => d.awardYear) - start; i += 30) {
        years.push(start + i);
    }
    // vertical lines for these years
    const spaceFor30Years = 30 / 5;
    years.forEach(function (year) {
        const x = 210 + (year - 1901) * spaceFor30Years;
        svg.append('line')
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("opacity", 0.3)
            .attr("x1", x)
            .attr("y1", 2)
            .attr("x2", x)
            .attr("y2", 200)

        // all data between year and next year
        const filteredData = data.filter(d => d.awardYear >= year && d.awardYear < year + 30);
        cities.forEach(function (city, i) {

            // fill city nulls with empty string
            filteredData.forEach(function (d) {
                if (d.birth_cityNow == null) {
                    d.birth_cityNow = "";
                }
            });
            const cityData = filteredData.filter(d => d.birth_cityNow.includes(city));
            const cityDataCount = cityData.length;
            const y = 15 + i * 15;

            // stacked barplot for each category
            const categories = ["Chemistry", "Economic Sciences", "Physics", "Literature", "Medicine", "Peace"];
            const categoryCounts = d3.rollup(cityData, v => v.length, d => d.category);
            let prevWidth = 0;
            categories.forEach(function (category) {
                const count = categoryCounts.get(category) || 0;
                const width = count * 6;
                const names = cityData.filter(d => d.category == category).map(d => d.name);
                const years = cityData.filter(d => d.category == category).map(d => d.awardYear);
                const infoString = names.map((name, i) => `${name} (${years[i]})`).join("<br>");
                svg.append('rect')
                    .attr('x', x + prevWidth)
                    .attr('y', y)
                    .attr('width', width)
                    .attr('height', 6)
                    .attr('fill', categoryToColor(category))
                    .attr('opacity', 0.66)
                    .attr('textOnHover', `${count} ${category} laureates are from ${city}:<br><hr>${infoString}`)
                    .on("mouseover", (e) => { hoverOnElement(e) })
                    .on("mouseout", (e) => { hoverOutElement(e) });
                prevWidth += width;
            });
            if (cityDataCount != 0) {
                svg.append('text')
                    .text(cityDataCount)
                    .attr('x', x + prevWidth + 5)
                    .attr('y', y + 7)
                    .attr('text-anchor', 'left')
                    .attr('fill', 'black')
                    .attr('font-size', 11)
                    .attr('opacity', 0.8)
            }
            // add city name
            svg.append('text')
                .text(city)
                .attr('x', 200)
                .attr('y', y + 7)
                .attr('text-anchor', 'end')
                .attr('fill', 'black')
                .attr('font-size', 11)
                .attr("font-weight", 200)
                .attr('opacity', 0.7)

            // add horizontal grid lines behind the bars
            svg.append('line')
                .style("stroke", "black")
                .style("stroke-width", 0.3)
                .attr("opacity", 0.05)
                .attr("x1", 210)
                .attr("y1", y + 6 / 2)
                .attr("x2", 930)
                .attr("y2", y + 6 / 2)
        });
    });
    // for each city print the total
    cities.forEach(function (city, i) {
        const cityData = data.filter(d => d.birth_cityNow.includes(city));
        const cityDataCount = cityData.length;
        const y = 15 + i * 15;
        svg.append('text')
            .text(cityDataCount)
            .attr('x', 930 + 5)
            .attr('y', y + 7)
            .attr('text-anchor', 'left')
            .attr('fill', 'black')
            .attr('font-size', 11)
            .attr('opacity', 0.8)
    });

    const texts = ["principal", "hometowns", "of laureates"];
    texts.forEach(function (text, i) {
        svg.append('text')
            .text(text)
            .attr('x', 110)
            .attr('y', 20 + i * 12)
            .attr('text-anchor', 'end')
            .attr('fill', 'black')
            .attr('font-size', 11)
            .attr("font-weight", 200)
            .attr('opacity', 1)
    });

    const texts2 = ["total of", "laureate", "for each city"];
    texts2.forEach(function (text, i) {
        svg.append('text')
            .text(text)
            .attr('x', 1000)
            .attr('y', 20 + i * 12)
            .attr('text-anchor', 'left')
            .attr('fill', 'black')
            .attr('font-size', 11)
            .attr("font-weight", 200)
            .attr('opacity', 1)
    });
});

// Load world shape and list of connection
Promise.all([
    d3.json("world.geojson"),  // World shape
    d3.csv("complete_processed.csv") // Position of circles
]).then(
    function (initialize) {

        const svg = d3.select("#graphMap")
        width = +svg.attr("width"),
            height = +svg.attr("height");

        // Map and projection
        const projection = d3.geoEquirectangular()
            .scale(200)
            .translate([width / 2, height / 2 * 1.3])

        // A path generator
        const path = d3.geoPath()
            .projection(projection);

        let dataGeo = initialize[0]
        // remove antartica from dataGeo
        dataGeo.features = dataGeo.features.filter(d => d.id != "ATA")
        let data = initialize[1]

        // for each element in data, append the "category" value fo each (birth_zone_lon, birth_zone_lat, affiliation_zone_lon, affiliation_zone_lat) group
        var topCategoryPerZone = new Map();
        data.forEach(function (d) {
            coords = [d.birth_zone_lon, d.birth_zone_lat, d.affiliation_zone_lon, d.affiliation_zone_lat];
            // append the category value to each group
            topCategoryPerZone[coords] = topCategoryPerZone[coords] ? topCategoryPerZone[coords] + "__###__" + d.category : d.category;
        });
        // console log it
        // deep copy it
        topCategoryPerZoneCopy = JSON.parse(JSON.stringify(topCategoryPerZone));
        console.log(topCategoryPerZoneCopy);
        
        // split the string by __###___ and take the most occurring value
        Object.keys(topCategoryPerZone).forEach(function (key) {
            if (topCategoryPerZone[key].length == 0) {
                topCategoryPerZone[key] = "Others";
                return;
            }
            topCategoryPerZone[key] = topCategoryPerZone[key].split("__###__")
            // count the occurrences
            var counts = {};
            topCategoryPerZone[key].forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
            // get the most occurring value
            topCategoryPerZone[key] = Object.keys(counts).reduce(function (a, b) { return counts[a] > counts[b] ? a : b });
        });

        // Reformat the list of link. Note that columns in csv file are called long1, long2, lat1, lat2
        var link = []
        data.forEach(function (row) {
            source = [+row.birth_zone_lon, +row.birth_zone_lat]
            target = [+row.affiliation_zone_lon, +row.affiliation_zone_lat]
            topush = { type: "LineString", coordinates: [source, target] }
            // exclude the 0,0
            if (source[0] == 0 && source[1] == 0 || target[0] == 0 && target[1] == 0)
                return;
            if (source[0] == target[0] || source[1] == target[1])
                return;
            link.push(topush);
        })

        // count occurrences
        var categoryCounts = new Map();
        link.forEach(function (d) {
            d = d.coordinates;
            categoryCounts[d] = categoryCounts[d] ? categoryCounts[d] + 1 : 1;
        });
        // remove duplicates
        link = link.filter((v, i, a) => a.findIndex(t => (t.coordinates[0][0] === v.coordinates[0][0] && t.coordinates[0][1] === v.coordinates[0][1] && t.coordinates[1][0] === v.coordinates[1][0] && t.coordinates[1][1] === v.coordinates[1][1])) === i)

        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(dataGeo.features)
            .join("path")
            .attr("fill", "#b8b8b8")
            .attr("d", path)
            .style("stroke", "#fff")
            .style("stroke-width", 0)
            .attr("doNotGray", true);

        // add the path
        link.forEach(function (d) {
            var search_key = d.coordinates[0].join(",") + "," + d.coordinates[1].join(",");
            //console.log(topCategoryPerZone, search_key)
            var cur_path = svg.append("path")
                .attr("d", path(d))
                .attr("fill", "none")
                //.attr("stroke", "#69b3a2")
                .attr("stroke", categoryToColor(topCategoryPerZone[search_key]))
                .attr("stroke-width", categoryCounts[d.coordinates])
                .attr("stroke-linecap", "round")
                .attr("opacity", 0.7)
            var totalLength = cur_path.node().getTotalLength();

            function repeat() {
                // Animate the path by setting the initial offset and dasharray and then transition the offset to 0
                cur_path.attr("stroke-dasharray", totalLength + " " + totalLength)
                    .attr("stroke-dashoffset", totalLength)
                    .transition()
                    .ease(d3.easeLinear)
                    .attr("stroke-dashoffset", 0)
                    .duration(3000)
                    .on("end", () => setTimeout(repeat, 1000)); // this will repeat the animation after waiting 1 second
            };
            repeat();
        });

        // for each location, draw a diamond

        data.forEach(function (d) {
            if (d.birth_zone_lon == 0 && d.birth_zone_lat == 0) {
                return;
            }
            var coords = [d.birth_zone_lon, d.birth_zone_lat];
            var category = topCategoryPerZone[coords];
            var x = projection(coords)[0];
            var y = projection(coords)[1];

            // diamond on affiliation_zone
            if (d.affiliation_zone_lon == 0 && d.affiliation_zone_lat == 0) {
                return;
            }
            var coords = [d.affiliation_zone_lon, d.affiliation_zone_lat];
            var category = topCategoryPerZone[coords];
            var x = projection(coords)[0];
            var y = projection(coords)[1];

            const bornHere = data.filter(d => d.birth_zone_lon == coords[0] && d.birth_zone_lat == coords[1]);
            const bornHereCategories = bornHere.map(d => d.category);
            // count the categories and sort them by count
            var counts = {};
            bornHereCategories.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
            // sort dict by counts
            const countsSortedBorn = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
            // build string category: count
            const infoStringBorn = countsSortedBorn.map((category) => `${category}: ${counts[category]}`).join("<br>");

            const affiliatedHere = data.filter(d => d.affiliation_zone_lon == coords[0] && d.affiliation_zone_lat == coords[1]);
            const affiliatedHereCategories = affiliatedHere.map(d => d.category);
            // count the categories and sort them by count
            var counts = {};
            affiliatedHereCategories.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
            // sort dict by counts
            const countsSortedAffiliated = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
            // build string category: count
            const infoStringAffiliated = countsSortedAffiliated.map((category) => `${category}: ${counts[category]}`).join("<br>");

            var infoString = "";
            if (infoStringBorn != "") {
                infoString += `<b>Born in ${bornHere[0].birth_zone}:</b><hr>${infoStringBorn}<hr>`;
            }
            if (infoStringAffiliated != "") {
                infoString += `<b>Affiliated in ${affiliatedHere[0].affiliation_zone}:</b><hr>${infoStringAffiliated}`;
            }

            svg.append("circle")
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", 10)
                .attr("fill", "lightgray")
                .attr("stroke", "black")
                .attr("opacity", 1)
                .attr("textOnHover", `${infoString}`)
                .on("mouseover", (e) => { hoverOnElement(e) })
                .on("mouseout", (e) => { hoverOutElement(e) });
        });

    })