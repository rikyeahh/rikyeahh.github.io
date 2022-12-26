function buildFoodBarplot(filename) {
    document.getElementById("foodBarplot").innerHTML = ''
    d3.csv(filename).then(function (data) {

        //console.log(data);
        var foodCategories = [...new Set(data.map(d => d.Type))]

        //console.log(foodCategories);

        const margin = { top: 20, right: 30, bottom: 40, left: 90 }
        const width = 700 - margin.left - margin.right
        const height = 500 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select("#foodBarplot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left + 30}, ${margin.top - 10})`);


        var color = d => {
            switch (d) {
                case "Meat": return "#ff0000";
                case "Fruit": return "#ffff00";
                case "Vegetable": return "#00ff00";
                case "Cereal": return "#0000ff";
                case "Other": return "#aaaaaa";
                default: return "#000000";
            }
        }

        // Add X axis
        const x = d3.scaleLinear()
            .domain([0, Math.max(...data.map(d => d.LandUse))])
            .range([0, width - 160]).nice()
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "begin")


        // Y axis
        const y = d3.scaleBand()
            .range([0, height])
            .domain(data.map(d => d.Entity))
            .padding(.1);
        svg.append("g")
            .call(d3.axisLeft(y))
            .style("font-size", "13px")


        //Bars
        svg.selectAll("myRect")
            .data(data)
            .join("rect")
            .attr("x", x(0))
            .attr("y", d => y(d.Entity))
            .attr("width", d => x(d.LandUse))
            .attr("height", y.bandwidth())
            .attr("fill", d => color(d.Type))

        svg.append('g')
            .selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr("x", d => x(d.LandUse) + 5)
            .attr("y", d => y(d.Entity) + 1)
            .text(d => Math.round(parseFloat(d.LandUse)) + " m²")
            .attr("transform", `translate(0, 13)`)


        // color legend
        for (let i = 0; i < foodCategories.length; i++) {
            const element = foodCategories[i];
            //console.log(element);
            svg.append("text")
                .attr("x", 400)
                .attr("y", 300 + 16 * i)
                .text(element)
            svg.append("circle")
                .attr("r", 5)
                .attr("cx", 390)
                .attr("cy", 293 + 16 * i)
                .style("fill", color(element))
        }

        const label = filename == 'landUsePer1000Kcal.csv' ? '1000 Kcal' :
            filename == 'landUsePer100gProteins.csv' ? '100 g of proteins' :
                filename == 'landUsePer1Kg.csv' ? '1 Kg of product' : "ERROR"
        // x axis label
        svg.append("text")
            .attr("x", 150)
            .attr("y", 480)
            .text("m² of land required to produce " + label)

        // TODO add vertical grid
    })
}

buildFoodBarplot("landUsePer1000Kcal.csv")
