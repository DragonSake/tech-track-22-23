// Our bundler automatically creates styling when imported in the main JS file!
import "../styles/style.css";

// We can use node_modules directely in the browser!
import * as d3 from "d3";

fetch("lol.json")
  .then((response) => response.json())
  .then((dataSet) =>  {
    gold(dataSet),
    visionkda(dataSet),
    kills(dataSet);
  } );

function gold(dataSet)  {
    const chartWidth = 400;
    const chartHeight = 160;
    
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataSet, (d) => d.Gold)])
      .range([0, chartWidth]);
    
    const yScale = d3
      .scaleBand()
      .domain(d3.map(dataSet, (d) => d.Player))
      .range([0, chartHeight])
      .paddingInner(0.6);
    
    const bars = d3.select("#bars").selectAll("g").data(dataSet).join("g");
    
    bars
      .append("rect")
      .attr("height", yScale.bandwidth())
      .attr("width", (d) => xScale(d.Gold))
      .attr("y", (d) => yScale(d.Player))
      .attr("rx", 7);
    
    bars
      .append("text")
      .attr("y", (d) => yScale(d.Player) + yScale.bandwidth() / 2)
      .attr("x", (d) => xScale(d.Gold) + 40)
      .text((d) => d.Gold);
    
    d3.select("#labels")
      .selectAll("text")
      .data(dataSet)
      .join("text")
      .attr("y", (d) => yScale(d.Player) + yScale.bandwidth() / 2)
      .text((d) => d.Player);
}

function visionkda(dataSet){

}

const data1 = [
  { group: "Zeus", value: 1 },
  { group: "Oner", value: 1.75 },
  { group: "Faker", value: 0.95 },
  { group: "Gumayusi", value: 1.35 },
  { group: "Keria", value: 2.36 },
];

const data2 = [
  { group: "Zeus", value: 3.2 },
  { group: "Oner", value: 4.5 },
  { group: "Faker", value: 2.8 },
  { group: "Gumayusi", value: 7.6 },
  { group: "Keria", value: 7.6 },
];

const margin = { top: 30, right: 30, bottom: 70, left: 60 },
  width = 300 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;

const svg = d3
  .select(".my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const x = d3
  .scaleBand()
  .range([0, width])
  .domain(
    data1.map((d) => {
      return d.group;
    })
  )
  .padding(0.2);
svg
  .append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");

const y = d3.scaleLinear().domain([0, 5]).range([height, 0]);

svg.append("g").attr("class", "myYaxis").call(d3.axisLeft(y));

function update(data) {
  const newY = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, (d) => {
        return d.value;
      }),
    ])
    .range([height, 0]);

  svg.select(".myYaxis").call(d3.axisLeft(newY));

  svg.selectAll(".domain").attr("stroke", "white");

  svg.selectAll(".tick").select("line").attr("stroke", "white");

  const u = svg.selectAll("rect").data(data);

  u.enter()
    .append("rect")
    .merge(u)
    .transition()
    .duration(1000)
    .attr("x", (d) => {
      return x(d.group);
    })
    .attr("y", (d) => {
      return newY(d.value);
    })
    .attr("width", x.bandwidth())
    .attr("height", (d) => {
      return height - newY(d.value);
    })
    .attr("fill", "#03bdc9");
}

update(data1);

const button1 = document.querySelector("button");

const button2 = document.querySelector("button:nth-child(2)");

button1.addEventListener("click", function () {
  update(data1);
});

button2.addEventListener("click", function () {
  update(data2);
});

function kills(dataSet, player = 2){
    console.log("kill data", dataSet[player]);
    
    let pieData = [dataSet[player].Kill, 100-dataSet[player].Kill];
    
    var text = "";
  
    var width = 180;
    var height = 180;
    var thickness = 20;
    
    var radius = Math.min(width, height) / 2;
    
    function color(d, i){
      if (i === 0){
        return '#e7bd3b'
      }else {
        return "#131c43"
      }
    }
    
    var svg = d3.select(".donut")
    .append('svg')
    .attr('class', 'pie')
    .attr('width', width)
    .attr('height', height);
    
    var g = svg.append('g')
    .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');
    
    var arc = d3.arc()
    .innerRadius(radius - thickness)
    .outerRadius(radius);
    
    var pie = d3.pie()
    .value(function(d) { return d })
    .sort(null);
    
    var path = g.selectAll('path')
    .data(pie(pieData))
    .enter()
    .append("g")
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(d, i))
      .each(function(d, i) { this._current = i; });
    
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .text(text);
    
    svg.append("svg:text")
        .attr("dx", "90px")
        .attr("dy", "100px")
        .attr("text-anchor", "middle")
        .attr("font-size","40")
        .text(dataSet[player].Kill);
}
  
function dmg(dataSet, player = 2){
    console.log("kill data", dataSet[player]);
    
    let pieData = [dataSet[player].Damage, 100-dataSet[player].Damage];
    
    var text = "";
  
    var width = 180;
    var height = 180;
    var thickness = 20;
    
    var radius = Math.min(width, height) / 2;
    
    function color(d, i){
      if (i === 0){
        return '#e7bd3b'
      }else {
        return "#131c43"
      }
    }
    
    var svg = d3.select(".donut2")
    .append('svg')
    .attr('class', 'pie')
    .attr('width', width)
    .attr('height', height);
    
    var g = svg.append('g')
    .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');
    
    var arc = d3.arc()
    .innerRadius(radius - thickness)
    .outerRadius(radius);
    
    var pie = d3.pie()
    .value(function(d) { return d })
    .sort(null);
    
    var path = g.selectAll('path')
    .data(pie(pieData))
    .enter()
    .append("g")
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(d, i))
      .each(function(d, i) { this._current = i; });
    
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .text(text);
    
    svg.append("svg:text")
        .attr("dx", "90px")
        .attr("dy", "100px")
        .attr("text-anchor", "middle")
        .attr("font-size","40")
        .text(dataSet[player].Damage);
}