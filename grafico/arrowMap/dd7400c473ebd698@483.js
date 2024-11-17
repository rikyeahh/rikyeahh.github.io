import define1 from "./a2e58f97fd5e8d7c@756.js";

function _1(md){return(
md`# Flow map`
)}

function _2(md){return(
md`<ins>WORK IN PROGRESS</ins>`
)}

function _f1(Range){return(
Range([0, 100], {
  step: 1,
  value: 40,
  label: "Factor (circles)"
})
)}

function _f2(Range){return(
Range([0, 100], {
  step: 1,
  value: 30,
  label: "Factor (arrows)"
})
)}

function _threshold(Range,d3,flows){return(
Range([0, d3.max(flows, (d) => d.fij)], {
  step: 1,
  value: 1000,
  label: "Threshold"
})
)}

function _map(d3,width,height,drawtemplate,arrows,threshold,intra,radius,getcentroids)
{
  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "#EEE");

  svg.call(drawtemplate);

  // svg
  //   .append("g")
  //   .attr("fill-opacity", 0.9)
  //   .attr("stroke", "#fff")
  //   .attr("stroke-width", 1)
  //   .selectAll("line")
  //   .data(flows)
  //   .join("line")
  //   .attr("stroke", "#6594ab")
  //   .attr("stroke-width", (d) => d.fij * 0.001)
  //   .attr("x1", (d) => d.xi)
  //   .attr("y1", (d) => d.yi)
  //   .attr("x2", (d) => d.xj)
  //   .attr("y2", (d) => d.yj);

  svg
    .append("g")
    .attr("fill-opacity", 0.9)
    .attr("stroke", "#fff")
    .attr("stroke-width", 1)
    .selectAll("line")
    .data(
      arrows
        .sort((a, b) => d3.ascending(a.properties.fij, b.properties.fij))
        .filter((d) => d.properties.fij >= threshold)
    )
    .join("path")
    .attr("stroke", "#95a1c9")
    .attr("fill", "#6594ab")
    .attr("stroke-width", 0.1)
    .attr("d", d3.geoPath());

  svg
    .append("g")
    .attr("fill-opacity", 0.9)
    .attr("stroke", "#fff")
    .attr("stroke-width", 1)
    .selectAll("circle")
    .data(intra.sort((a, b) => d3.ascending(+a.fij, +b.fij)))
    .join("circle")
    .attr("id", (d) => d.id)
    .attr("fill", "#739ec9")
    .attr("r", (d) => radius(d.fij))
    .attr("cx", (d) => getcentroids.get(+d.id)[0])
    .attr("cy", (d) => getcentroids.get(+d.id)[1]);

  return svg.node();
}


function _7(md){return(
md`**1. data**`
)}

function _subregions(d3,topojson){return(
d3
  .json(
    "https://raw.githubusercontent.com/neocarto/resources/master/datasets/UNmigrantstock/subregions.topojson"
  )
  .then((r) => topojson.feature(r, r.objects.subregions))
)}

function _intra(d3){return(
d3.csv(
  "https://raw.githubusercontent.com/neocarto/resources/master/datasets/UNmigrantstock/intra.csv"
)
)}

function _inter(d3){return(
d3.csv(
  "https://raw.githubusercontent.com/neocarto/resources/master/datasets/UNmigrantstock/inter.csv"
)
)}

function _11(md){return(
md`**2. Data Handling**`
)}

function _radius(d3,intra,f1){return(
d3.scaleSqrt([0, d3.max(intra, (d) => +d.fij)], [0, f1])
)}

function _size(d3,flows,f2){return(
d3
  .scaleLinear()
  .domain([1, d3.max(flows, (d) => d.fij)])
  .range([0, f2])
)}

function _getcentroids(subregions,path){return(
new Map(
  subregions.features
    .map((d) => {
      return d;
    })
    .map((d) => [d.properties.id, path.centroid(d)])
)
)}

function _getintra(intra){return(
new Map(
  intra
    .map((d) => {
      return d;
    })
    .map((d) => [+d.id, +d.fij])
)
)}

function _flows(inter,getintra,getcentroids){return(
inter.map((d) => ({
  i: +d.i,
  j: +d.j,
  i_intra: getintra.get(+d.i),
  j_intra: getintra.get(+d.j),
  xi: getcentroids.get(+d.i)[0],
  yi: getcentroids.get(+d.i)[1],
  xj: getcentroids.get(+d.j)[0],
  yj: getcentroids.get(+d.j)[1],
  fij: +inter.filter((e) => e.i == d.i).filter((e) => e.j == d.j)[0].fij
}))
)}

function _17(md){return(
md`**3. coordinates to arrows**`
)}

function _linetoarrow(radius,size){return(
(points) => {
  let x1 = points.xi;
  let x2 = points.xj;
  let y1 = points.yi;
  let y2 = points.yj;
  const r1 = radius(points.i_intra) + 3;
  const r2 = radius(points.j_intra) + 3;
  //const dist = points.fij / 2;
  const dist = size(points.fij);

  const slope = (y2 - y1) / (x2 - x1);
  const angle = Math.atan(slope);
  const linelength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  let x3;
  let y3;
  if (x1 > x2) {
    x1 = x1 - cos * r1;
    y1 = y1 - sin * r1;
    x2 = x2 + cos * r2;
    y2 = y2 + sin * r2;
    x3 = x2 + cos * dist;
    y3 = y2 + sin * dist;
  } else {
    x1 = x1 + cos * r1;
    y1 = y1 + sin * r1;
    x2 = x2 - cos * r2;
    y2 = y2 - sin * r2;
    x3 = x2 - cos * dist;
    y3 = y2 - sin * dist;
  }

  if (dist + r1 + r2 > linelength) {
    x3 = x1;
    y3 = y1;
  }

  let coords;
  if (r1 + r2 >= linelength) {
    coords = [];
  } else {
    let x1bis = x1 + sin * dist;
    let y1bis = y1 - cos * dist;
    let x1ter = x1 - sin * dist;
    let y1ter = y1 + cos * dist;

    let x3bis = x3 + sin * dist;
    let y3bis = y3 - cos * dist;
    let x3ter = x3 - sin * dist;
    let y3ter = y3 + cos * dist;

    coords = [
      [
        [x1bis, y1bis],
        [x1ter, y1ter],
        [x3ter, y3ter],
        [x2, y2],
        [x3bis, y3bis],
        [x1bis, y1bis]
      ]
    ];
  }

  return coords;
  // return {
  //   type: "Feature",
  //   geometry: {
  //     type: "Polygon",
  //     coordinates: coords
  //   },
  //   properties: { var: points.var }
  // };
}
)}

function _linetoarrows(flows,linetoarrow){return(
() => {
  let result = [];
  flows.forEach((e) => {
    let output = Object.assign({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: linetoarrow(e)
      },
      properties: e
    });
    result.push(output);
  });
  return result;
}
)}

function _arrows(linetoarrows){return(
linetoarrows()
)}

function _21(md){return(
md`**4. Map template**`
)}

function _height(){return(
900
)}

function _projection(d3,width,height){return(
d3
  .geoAzimuthalEquidistant()
  .scale(250)
  .rotate([0, -90])
  .translate([width / 2, height / 2 - 100])
  .clipAngle(120)
)}

function _path(d3,projection){return(
d3.geoPath(projection)
)}

function _sphere(){return(
{ type: "Sphere" }
)}

function _drawtemplate(sphere,path,d3,subregions){return(
(selection) => {
  selection
    .append("g")
    .append("path")
    .datum(sphere)
    .attr("fill", "  #a9daeb")
    .attr("d", path);

  selection
    .append("g")
    .append("path")
    .datum(d3.geoGraticule10())
    .attr("d", path)
    .style("fill", "none")
    .style("stroke", "white")
    .style("stroke-width", 0.8)
    .style("stroke-opacity", 0.5)
    .style("stroke-dasharray", 2);

  selection
    .append("path")
    .datum(subregions)
    .attr("fill", "#d1c1b8")
    .attr("stroke", "white")

    .attr("stroke-width", 0.2)
    .attr("d", path);
}
)}

function _27(md){return(
md`# Appendix`
)}

function _topojson(require){return(
require("topojson")
)}

function _d3(require){return(
require("d3@6")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("viewof f1")).define("viewof f1", ["Range"], _f1);
  main.variable(observer("f1")).define("f1", ["Generators", "viewof f1"], (G, _) => G.input(_));
  main.variable(observer("viewof f2")).define("viewof f2", ["Range"], _f2);
  main.variable(observer("f2")).define("f2", ["Generators", "viewof f2"], (G, _) => G.input(_));
  main.variable(observer("viewof threshold")).define("viewof threshold", ["Range","d3","flows"], _threshold);
  main.variable(observer("threshold")).define("threshold", ["Generators", "viewof threshold"], (G, _) => G.input(_));
  main.variable(observer("map")).define("map", ["d3","width","height","drawtemplate","arrows","threshold","intra","radius","getcentroids"], _map);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("subregions")).define("subregions", ["d3","topojson"], _subregions);
  main.variable(observer("intra")).define("intra", ["d3"], _intra);
  main.variable(observer("inter")).define("inter", ["d3"], _inter);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("radius")).define("radius", ["d3","intra","f1"], _radius);
  main.variable(observer("size")).define("size", ["d3","flows","f2"], _size);
  main.variable(observer("getcentroids")).define("getcentroids", ["subregions","path"], _getcentroids);
  main.variable(observer("getintra")).define("getintra", ["intra"], _getintra);
  main.variable(observer("flows")).define("flows", ["inter","getintra","getcentroids"], _flows);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer("linetoarrow")).define("linetoarrow", ["radius","size"], _linetoarrow);
  main.variable(observer("linetoarrows")).define("linetoarrows", ["flows","linetoarrow"], _linetoarrows);
  main.variable(observer("arrows")).define("arrows", ["linetoarrows"], _arrows);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("projection")).define("projection", ["d3","width","height"], _projection);
  main.variable(observer("path")).define("path", ["d3","projection"], _path);
  main.variable(observer("sphere")).define("sphere", _sphere);
  main.variable(observer("drawtemplate")).define("drawtemplate", ["sphere","path","d3","subregions"], _drawtemplate);
  main.variable(observer()).define(["md"], _27);
  const child1 = runtime.module(define1);
  main.import("Range", child1);
  main.variable(observer("topojson")).define("topojson", ["require"], _topojson);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
