## Apply D3.js graphic techiniques

## Background

This assignment is about analyzing the current trends shaping people's lives, as well as creating charts, graphs, and interactive elements to help readers understand the findings.
This explains about the health risks facing particular demographics. It covers sifting through information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System.

The data set included with the assignment is based on 2014 ACS 1-year estimates: [https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml](https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml).
The current data set incldes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."


### Core Assignment: 

Created a scatter plot between two of the data variables such as `Healthcare vs. Poverty` or `Smokers vs. Age`.

Using the D3 techniques, created a scatter plot that represents each state with circle elements. This graphic code is present in the `app.js` file. The data is pulled from `data.csv` by using the `d3.csv` function. The scatter plot has following features included - 

* State abbreviations in the circles.
* Axes and labels created to the left and bottom of the chart.

### Bonus: 
Created a graph using D3 which we can intreact with the data.

#### 1. More Data, More Dynamics

Included more demographics and more risk factors. Placed additional labels in scatter plot and gave them click events so that users can decide which data to display. 
Animated the transitions for circles' locations as well as the range of axes. This was done for three risk factors for each axis. 



#### 2. Incorporate d3-tip

While the ticks on the axes allow us to infer approximate values for each circle, it's impossible to determine the true value without adding another layer of data. 
Implemented tooltips using d3 graphics  to reveal a specific element's data when the user hovers their cursor over the element. Added tooltips to circles and displayed each tooltip with the data that the user has selected. 
Used the `d3-tip.js` plugin developed by [Justin Palmer](https://github.com/Caged)

