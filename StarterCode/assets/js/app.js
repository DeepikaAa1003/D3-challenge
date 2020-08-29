// @TODO: YOUR CODE HERE!

// The code for the chart is wrapped inside a function that
// automatically resizes the chart

function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    const svgArea = d3.select("body").select("svg");

    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }

    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    const svgWidth = window.innerWidth ;
    const svgHeight = window.innerHeight ;

    const margin = {
      top: 20,
      right: 40,
      bottom: 100,
      left: 80
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

      // Import Data
      d3.csv("assets/data/data.csv").then(function (censusData) {

        


        // Step 1: Parse Data/Cast as numbers
        // ==============================
        censusData.forEach(function (data) {
          data.poverty = +data.poverty;
          data.healthcare = +data.healthcare;
          data.age = +data.age;
          data.income = +data.income;
          data.obesity = +data.obesity;
          data.smokes = +data.smokes;
        });

        // Step 2: Create scale functions
        // ==============================
       

        // xLinearScale function 
        let xLinearScale = xScale(censusData, chosenXAxis, width);

       
        // yLinearScale function 
        let yLinearScale = yScale(censusData, chosenYAxis, height);

        // Step 3: Create axis functions
        // ==============================
        const bottomAxis = d3.axisBottom(xLinearScale);
        const leftAxis = d3.axisLeft(yLinearScale);

        // Step 4: Append Axes to the chart
        // ==============================
        let xAxis = chartGroup.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(bottomAxis);

        let yAxis = chartGroup.append("g")
          .call(leftAxis);

        // append circles group to data points
        let circlesGroup = chartGroup.selectAll("g circle")
        .data(censusData)
        .enter()
        .append("g");
        
         // append initial circles
        let circlesList = circlesGroup.append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 10)
        .classed("stateCircle", true);

         // append initial text inside circles
        let stateTextCircles = circlesGroup.append("text")
          .text(d => d.abbr)
          .attr("dx",  d => xLinearScale(d[chosenXAxis]))
          .attr("dy", d => yLinearScale(d[chosenYAxis]))
          .classed("stateText", true);

        // ==========Create group for three x-axis labels
        const xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

        const povertyLabel = xlabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 20)
          .attr("value", "poverty") // value to grab for event listener
          .classed("active aText", true)
          .text("In Poverty(%)");

        const ageLabel = xlabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 40)
          .attr("value", "age") // value to grab for event listener
          .classed("inactive aText inactive:hover", true)
          .text("Age(Median)");

        const incomeLabel = xlabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 60)
          .attr("value", "income") // value to grab for event listener
          .classed("inactive aText inactive:hover", true)
          .text("HouseHold Income(Median)");

        // Create group for three y-axis labels
        const ylabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${margin.bottom - 60}, ${0- (margin.left - 40)})`);

        console.log(`height = ${height}  and width = ${width} and leftmargin = ${margin.left} and bottommargin = ${margin.bottom}`)

        const healthcareLabel = ylabelsGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .attr("value", "healthcare") // value to grab for event listener
          .classed("active aText", true)
          .text("Lacks HealthCare(%)");

        const smokesLabel = ylabelsGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - (margin.left + 20))
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .attr("value", "smokes") // value to grab for event listener
          .classed("inactive aText inactive:hover", true)
          .text("Smokes(%)");

        const obesityLabel = ylabelsGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - (margin.left + 40))
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .attr("value", "obesity") // value to grab for event listener
          .classed("inactive aText inactive:hover", true)
          .text("Obese(%)");

           // updateToolTip function above csv import
           circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
          
//=====================================================================================================
          // x axis labels event listener
       xlabelsGroup.selectAll("text")
        .on("click", function () {
          // get value of selection
          const value = d3.select(this).attr("value");
          if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = value;

            // console.log(chosenXAxis)

            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(censusData, chosenXAxis, width);

            // updates x axis with transition
            xAxis = renderXAxis(xLinearScale, xAxis);

            // updates circles with new x values
            circlesList = renderCircles(circlesList, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);
            // updates text inside circles with new info
            stateTextCircles = renderCirclesText(stateTextCircles, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            // changes classes to change bold text
            if (chosenXAxis === "age") {
              ageLabel
                .classed("active", true)
                .classed("inactive", false)
                .classed("inactive:hover", false);
              povertyLabel
                .classed("active", false)
                .classed("inactive", true)
                .classed("inactive:hover", true);
              incomeLabel
                .classed("active", false)
                .classed("inactive", true)
                .classed("inactive:hover", true);
            }
            else if (chosenXAxis === "income") {
              incomeLabel
                .classed("active", true)
                .classed("inactive", false)
                .classed("inactive:hover", false);
              povertyLabel
                .classed("active", false)
                .classed("inactive", true)
                .classed("inactive:hover", true);
              ageLabel
                .classed("active", false)
                .classed("inactive", true)
                .classed("inactive:hover", true);

            }
            else {
              povertyLabel
                .classed("active", true)
                .classed("inactive", false)
                .classed("inactive:hover", false);
              incomeLabel
                .classed("active", false)
                .classed("inactive", true)
                .classed("inactive:hover", true);
              ageLabel
                .classed("active", false)
                .classed("inactive", true)
                .classed("inactive:hover", true);
            }
          }
        });



//============================================================================================================

//========================================Ylabel On Click=====================================================


    ylabelsGroup.selectAll("text")
        .on("click", function () {
          // get value of selection
          const valueY = d3.select(this).attr("value");
          if (valueY !== chosenYAxis) {

            // replaces chosenXAxis with value
            chosenYAxis = valueY;

            // console.log(chosenXAxis)

            // functions here found above csv import
            // updates x scale for new data
            yLinearScale = yScale(censusData, chosenYAxis, height);

            // updates x axis with transition
            yAxis = renderYAxis(yLinearScale, yAxis);

            // updates circles with new x values
            circlesList = renderCircles(circlesList, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);

            // updates text inside circles with new x values
            stateTextCircles = renderCirclesText(stateTextCircles, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            
            // changes classes to change bold text
            if (chosenYAxis === "obesity") {
              obesityLabel
                .classed("active", true)
                .classed("inactive", false)
                .classed("inactive:hover", false);
              healthcareLabel
                .classed("active", false)
                .classed("inactive", true)
                .classed("inactive:hover", true);
              smokesLabel
                .classed("active", false)
                .classed("inactive", true)
                .classed("inactive:hover", true);
            }
            else if (chosenYAxis === "healthcare") {
              healthcareLabel
                .classed("active", true)
                .classed("inactive", false)
                .classed("inactive:hover", false);
              obesityLabel
                .classed("active", false)
                .classed("inactive", true)
                .classed("inactive:hover", true);
              smokesLabel
                .classed("active", false)
                .classed("inactive", true)
                .classed("inactive:hover", true);

            }
            else {
              smokesLabel
                .classed("active", true)
                .classed("inactive", false)
                .classed("inactive:hover", false);
              healthcareLabel
                .classed("active", false)
                .classed("inactive", true)
                .classed("inactive:hover", true);
              obesityLabel
                .classed("active", false)
                .classed("inactive", true)
                .classed("inactive:hover", true);
            }
          }
        });


//============================================================================================================



      }).catch(function (error) {
        console.log(error);
      });


}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
