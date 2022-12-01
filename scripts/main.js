// Our bundler automatically creates styling when imported in the main JS file!
import "../styles/style.css";

// We can use node_modules directely in the browser!
import * as d3 from "d3";

// (api)data importeren
fetch("lol.json")
  .then((response) => response.json())
  .then((dataSet) => {
    gold(dataSet), kills(dataSet), dmg(dataSet); //functie uitvoeren
  });

// functie maken + de lengte en breedte bepalen
function gold(dataSet) {
  const chartWidth = 400;
  const chartHeight = 160;

  // X-as
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataSet, (d) => d.Gold)])
    .range([0, chartWidth]);

  // Y-as
  const yScale = d3
    .scaleBand()
    .domain(d3.map(dataSet, (d) => d.Player))
    .range([0, chartHeight])
    .paddingInner(0.6);

  //maakt de bar aan
  const bars = d3.select("#bars").selectAll("g").data(dataSet).join("g");

  bars
    .append("rect")
    .attr("height", yScale.bandwidth())
    .attr("width", (d) => xScale(d.Gold))
    .attr("y", (d) => yScale(d.Player))
    .attr("rx", 7); //border-radius

  bars
    .append("text")
    .attr("y", (d) => yScale(d.Player) + yScale.bandwidth() / 2)
    .attr("x", (d) => xScale(d.Gold) + 40) //40= ruimte tussen het getal en bar
    .text((d) => d.Gold); //haalt het getal uit de json

  //namen van de spelers
  d3.select("#labels")
    .selectAll("text")
    .data(dataSet)
    .join("text")
    .attr("y", (d) => yScale(d.Player) + yScale.bandwidth() / 2)
    .text((d) => d.Player); //haalt de naam uit de json
}

// data van de vision score
const data1 = [
  { group: "Zeus", value: 1 },
  { group: "Oner", value: 1.75 },
  { group: "Faker", value: 0.95 },
  { group: "Gumayusi", value: 1.35 },
  { group: "Keria", value: 2.36 },
];

// data van de kda
const data2 = [
  { group: "Zeus", value: 3.2 },
  { group: "Oner", value: 4.5 },
  { group: "Faker", value: 2.8 },
  { group: "Gumayusi", value: 7.6 },
  { group: "Keria", value: 7.6 },
];

//bepaalt de lengte en breedte
const margin = { top: 30, right: 30, bottom: 70, left: 60 },
  width = 300 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;

const svg = d3
  .select(".my_dataviz") //selecteert de div met de class my_dataviz
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

  svg.selectAll(".domain").attr("stroke", "white"); //maakt de lijn wit

  svg.selectAll(".tick").select("line").attr("stroke", "white"); //maakt de streepjes wit

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
    .attr("fill", "#03bdc9"); //geeft kleur
}

// functie "update" uitvoeren
update(data1);

// selecteert de buttons
const button1 = document.querySelector("button");
const button2 = document.querySelector("button:nth-child(3)");

// voegt een click toe aan de button en voert een functie uit
button1.addEventListener("click", function () {
  update(data1);
});

button2.addEventListener("click", function () {
  update(data2);
});

// maakt een functie aan en haalt de data van de 2e speler in de array
function kills(dataSet, player = 2) {
  let pieData = [dataSet[player].Kill, 100 - dataSet[player].Kill];

  const text = "";
  const width = 180;
  const height = 180;
  const thickness = 20;
  const radius = Math.min(width, height) / 2;

  // functie eerste waarde wordt geel, tweede waarde wordt donkerblauw
  function color(d, i) {
    if (i === 0) {
      return "#e7bd3b";
    } else {
      return "#131c43";
    }
  }

  // selecteert de div met de class donut
  const svg = d3
    .select(".donut")
    .append("svg")
    .attr("class", "pie")
    .attr("width", width)
    .attr("height", height);

  const g = svg
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // cirkel in de donut
  const arc = d3
    .arc()
    .innerRadius(radius - thickness)
    .outerRadius(radius);

  const pie = d3
    .pie()
    .value(function (d) {
      return d;
    })
    .sort(null);

  const path = g
    .selectAll("path")
    .data(pie(pieData))
    .enter()
    .append("g")
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => color(d, i))
    .each(function (d, i) {
      this._current = i;
    });

  svg
    .append("svg:text")
    .attr("dx", "90px")
    .attr("dy", "100px")
    .attr("text-anchor", "middle")
    .attr("font-size", "40")
    .text(dataSet[player].Kill);
}

// maakt een functie aan en haalt de data van de 2e speler in de array
function dmg(dataSet, player = 2) {
  let pieData = [dataSet[player].Damage, 100 - dataSet[player].Damage];

  const text = "";
  const width = 180;
  const height = 180;
  const thickness = 20;
  const radius = Math.min(width, height) / 2;

  // functie eerste waarde wordt geel, tweede waarde wordt donkerblauw
  function color(d, i) {
    if (i === 0) {
      return "#e7bd3b";
    } else {
      return "#131c43";
    }
  }

  // selecteert de div met de class donut
  const svg = d3
    .select(".donut2")
    .append("svg")
    .attr("class", "pie")
    .attr("width", width)
    .attr("height", height);

  const g = svg
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // cirkel in de donut
  const arc = d3
    .arc()
    .innerRadius(radius - thickness)
    .outerRadius(radius);

  const pie = d3
    .pie()
    .value(function (d) {
      return d;
    })
    .sort(null);

  const path = g
    .selectAll("path")
    .data(pie(pieData))
    .enter()
    .append("g")
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => color(d, i))
    .each(function (d, i) {
      this._current = i;
    });

  svg
    .append("svg:text")
    .attr("dx", "90px")
    .attr("dy", "100px")
    .attr("text-anchor", "middle")
    .attr("font-size", "40")
    .text(dataSet[player].Damage);
}
