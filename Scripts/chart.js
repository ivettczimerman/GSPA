
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
	.range(["#FA8072","#3399ff","#3CB371", "#ff9933"]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  data=chartData;

  var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "Configuration"; });

  data.forEach(function(d) {
    d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
  });

  x0.domain(data.map(function(d) { return d.Configuration; }));
  x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")

      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Capacity");

  var Configuration = svg.selectAll(".Configuration")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x0(d.Configuration) + ",0)"; });

  Configuration.selectAll("rect")
      .data(function(d) { return d.ages; })
    .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return color(d.name); });

  var legend = svg.selectAll(".legend")
      .data(ageNames.slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
	 
  svg.append("text")
      .attr("x", width - 24)
      .attr("y", 90)
	  .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text("Desired Capacity");

	  raportul=d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; });})/height;
	  console.log(desiredcap2);
	  if(desiredcap2==undefined){
		  var desiredCapacity=[];
		  var previously=0;
		  for(var i =0;i<desiredcap.length;i++){
			  desiredCapacity.push({"desired":((height*raportul)-desiredcap[i].desired)/raportul});
			  var line = svg.append("line")
					.attr("x1", previously)
					.attr("y1", desiredCapacity[i].desired)
					.attr("x2", previously+width/desiredcap.length)
					.attr("y2", desiredCapacity[i].desired)
					.attr("stroke-width", 3)          
					.attr("stroke", "black");
			  previously+=width/desiredcap.length;
			  
		  }		  
	  }else{
		    raportul=d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; });})/height;
			var desiredCapacity=(height*raportul)-desiredcap2;

			//Draw the line
			var line = svg.append("line")
				.attr("x1", 10)
				.attr("y1", desiredCapacity/raportul)
				.attr("x2", width)
				.attr("y2", desiredCapacity/raportul)
				.attr("stroke-width", 3)          
				.attr("stroke", "black");
	  }


 var line = svg.append("line")
				.attr("x1", width-20)
				.attr("y1", 90)
				.attr("x2", width)
				.attr("y2", 90)
				.attr("stroke-width", 2)          
				.attr("stroke", "black");		 