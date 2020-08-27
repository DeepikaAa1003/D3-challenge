// @TODO: YOUR CODE HERE!

//x axis is poverty column
//y axis is healthcare column
//circle label is abbr of state
//x ais label ( In Poverty (%))
//y axis label (Lacks Healthcare(%))


// The code for the chart is wrapped inside a function that
// automatically resizes the chart



const svgWidth = 800;
const svgHeight = 500;

const margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
const svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  function makeResponsive() {
// Import Data
d3.csv("assets/data/data.csv").then(function (censusData) {

  // Step 1: Parse Data/Cast as numbers
  // ==============================
  censusData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // Step 2: Create scale functions
  // ==============================
  const xLinearScale = d3.scaleLinear()
    .domain([ d3.min(censusData, d => d.poverty) * 0.9, d3.max(censusData, d => d.poverty) * 1.1])
    .range([0, width]);

  const yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.healthcare) -1 , d3.max(censusData, d => d.healthcare) + 1])
    .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
  const bottomAxis = d3.axisBottom(xLinearScale);
  const leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);


    let circlesGroup = chartGroup.selectAll("g circle")
    .data(censusData)
    .enter()
    .append("g");
  
  let circlesXY = circlesGroup.append("circle")
    .attr("cx",  d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 15)
    .classed("stateCircle", true);
  
  let circlesText = circlesGroup.append("text")
    .text(d => d.abbr)
    .attr("dx",  d => xLinearScale(d.poverty))
    .attr("dy", d => yLinearScale(d.healthcare) + 5)
    .classed("stateText", true);
 
  

  // Step 6: Initialize tool tip
  // ==============================
  const toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.abbr}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
    });

  // Step 7: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "aText")
    .text("Lacks Healthcare(%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "aText")
    .text("In Poverty (%)");
}).catch(function (error) {
  console.log(error);
});


}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);