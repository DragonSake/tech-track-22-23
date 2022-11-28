// Our bundler automatically creates styling when imported in the main JS file!
import '../styles/style.css'

// We can use node_modules directely in the browser!
import * as d3 from 'd3';

console.log('Hello, world!');

fetch('lol.json')
    .then((response) => response.json())
    .then((data) => console.log(data));


    const dataSet = [
        { speler: "Zeus", Gold: 21.9 },
        { speler: "Oner", Gold: 18.7 },
        { speler: "Faker", Gold: 20.5 },
        { speler: "Gumayusi", Gold: 24.8 },
        { speler: "Keria", Gold: 14.1 }
      ];
      
      const chartWidth = 400;
      const chartHeight = 160;
      
      const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataSet, d => d.Gold)])
        .range([0, chartWidth]);
      
      const yScale = d3
        .scaleBand()
        .domain(d3.map(dataSet, d => d.speler))
        .range([0, chartHeight])
        .paddingInner(0.60);
      
      const bars = d3.select("#bars")
        .selectAll("g")
        .data(dataSet)
        .join("g");
      
      bars.append("rect")
        .attr("height", yScale.bandwidth())
        .attr("width", d => xScale(d.Gold))
        .attr("y", d => yScale(d.speler))
        .attr("rx", 7);
      
      bars.append("text")
        .attr("y", d => yScale(d.speler) + yScale.bandwidth() / 2)
        .attr("x", d => xScale(d.Gold) + 40)
        .text(d => d.Gold);
      
      d3.select("#labels")
        .selectAll("text")
        .data(dataSet)
        .join("text")
        .attr("y", d => yScale(d.speler) + yScale.bandwidth() / 2)
        .text(d => d.speler);
      
        var data1 = [
            {group: "Zeus", value: 1},
            {group: "Oner", value: 1.75},
            {group: "Faker", value: 0.95},
            {group: "Gumayusi", value: 1.35},
            {group: "Keria", value: 2.36}
         ];
         
         var data2 = [
            {group: "Zeus", value: 3.2},
            {group: "Oner", value: 4.5},
            {group: "Faker", value: 2.8},
            {group: "Gumayusi", value: 7.6},
            {group: "Keria", value: 7.6}
         ];
         
         var margin = {top: 30, right: 30, bottom: 70, left: 60},
             width = 300 - margin.left - margin.right,
             height = 450 - margin.top - margin.bottom;
         
         var svg = d3.select(".my_dataviz")
           .append("svg")
             .attr("width", width + margin.left + margin.right)
             .attr("height", height + margin.top + margin.bottom)
           .append("g")
             .attr("transform",
                   "translate(" + margin.left + "," + margin.top + ")");
         
         var x = d3.scaleBand()
           .range([ 0, width ])
           .domain(data1.map(function(d) { return d.group; }))
           .padding(0.2)
           svg.append("g")
           .attr("transform", "translate(0," + height + ")")
           .call(d3.axisBottom(x))
           .selectAll("text")
             .attr("transform", "translate(-10,0)rotate(-45)")
             .style("text-anchor", "end");
         
         var y = d3.scaleLinear()
           .domain([0, 5])
           .range([ height, 0]);


         svg.append("g")
           .attr("class", "myYaxis")
           .call(d3.axisLeft(y));
         
         function update(data) {
  var newY = d3.scaleLinear().domain([0, d3.max(data, function(d) { return d.value }) ]).range([ height, 0]);

         
          svg.select('.myYaxis')
           .call(d3.axisLeft(newY))
  
            svg.selectAll('.domain')
                .attr('stroke', 'white');

            svg.selectAll('.tick')
                .select('line')
                .attr('stroke', 'white')

           var u = svg.selectAll("rect")
             .data(data)
         
           u
             .enter()
             .append("rect")
             .merge(u)
             .transition()
             .duration(1000)
               .attr("x", function(d) { return x(d.group); })
               .attr("y", function(d) { return newY(d.value); })
               .attr("width", x.bandwidth())
               .attr("height", function(d) { return height - newY(d.value); })
               .attr("fill", "#03bdc9")
         }
         
         update(data1);

         var button1 = document.querySelector("button");

         var button2 = document.querySelector("button:nth-child(2)");

         button1.addEventListener("click", function(){
            update(data1);
        });

        button2.addEventListener("click", function(){
            update(data2);
        });