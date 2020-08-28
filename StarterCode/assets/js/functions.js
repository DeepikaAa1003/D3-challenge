
// Initial Params
let chosenXAxis = "poverty";
let chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  const xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.9,
    d3.max(censusData, d => d[chosenXAxis]) * 1.1
    ])
    .range([0, width]);

  return xLinearScale;

}
// function used for updating y-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
    // create scales
    const yLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[chosenYAxis]) - 2,
      d3.max(censusData, d => d[chosenYAxis]) + 2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  
  }

// function used for updating xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {
  const bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}


// function used for updating yAxis var upon click on axis label
function renderYAxis(newYScale, yAxis) {
    const leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
   

  return circlesGroup;
}

function renderCirclesText(circlesText, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesText.transition()
    .duration(1000)
    .attr("dx",  d => newXScale(d[chosenXAxis]))
    .attr("dy", d => newYScale(d[chosenYAxis]));
   

  return circlesText;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  let labelX;
  let labelY;
  let percent;

  if (chosenXAxis === "poverty") {
    labelX = "Poverty:";
    percent = "%";
  }
  else if (chosenXAxis === "age") {
    labelX = "Age:";
    percent = "";
  }
  else if (chosenXAxis === "income") {
    labelX = "Income:";
    percent = "";
  }

  if (chosenYAxis === "healthcare") {
    labelY = "HealthCare:";
    
  }
  else if (chosenYAxis === "obesity") {
    labelY = "Obesity:";
    
  }else if (chosenYAxis === "smokes") {
    labelY = "Smokes:";
    
  }


  const toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>${labelX} ${d[chosenXAxis]} ${percent} <br> ${labelY} ${d[chosenYAxis]}%`);
    });

  chartGroup.call(toolTip);

  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}