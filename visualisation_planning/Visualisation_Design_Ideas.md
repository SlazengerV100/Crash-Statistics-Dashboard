# Visualisation Design Ideas

----
## Alex
### Title: Heatmap of Crash Hotspots
![Heat map hue](https://gitlab.ecs.vuw.ac.nz/course-work/swen422/2025/assignment1/team3/team-3-assignment-1/-/raw/main/visualisation_planning/Heat%20map%20-%20hue.png)
![Heat map lightness](https://gitlab.ecs.vuw.ac.nz/course-work/swen422/2025/assignment1/team3/team-3-assignment-1/-/raw/main/visualisation_planning/Heat%20map%20-%20lightness.png)
### Description: 
- A geographic heatmap displaying crash densities across New Zealand. 
- The map will use colour intensity to indicate crash frequency, with red for high-density areas and blue for lower-density areas. 
- Users can filter data by year (with a slider), vehicle type (selector).
- Reveal data for region at that point in time on hover 
- Maybe display an image on each region of the vehicle type that it comparitvely has the most crashes for for that period


### Justification of design:  
- **Colour**: The use of **heatmap colours** (red → blue) clearly communicates crash density, making high-risk areas stand out at a glance.
- **Position & Spatial Encoding**: The **geographic mapping** allows for natural **spatial understanding** of crash hotspots.
- **Transparency & Layering**: Allows filtering by **year** and **vehicle type**, helping to track trends over time without overwhelming the user.
- **Image Representation**: Associating a **vehicle image** with the highest crash type reinforces recognition and adds an intuitive **symbolic** element.
- **Interactive Elements**: **Hover effects** enhance engagement, making the data more accessible.

### Title: Linegraph comparisons of crashes in different regions
![Crashes by region](visualisation_planning/Crashes_by_region.png)
### Description: 
- Users can **select up to 4 regions** to compare crash trends.
- **X-axis**: Time (adjustable & animated).
- **Y-axis**: Number of crashes.
- **Filters**: Crash **Severity** and **Vehicle Type**.

### Justification of design:  
- Allows easy comaprision of crash stats between regions over time
- **Line Thickness & Colour**: Different regions will be represented by **distinct line colours**, ensuring easy differentiation.
- **Motion (Animation)**: Time-based changes are animated to allow for smooth trend visualisation.
- **Position & Alignment**: Ensures clear comparisons of crash patterns over time.
- **Filtering & Focus**: Allows users to refine data views, preventing visual overload.


### Title: Horizontal bar graph comparing most common speed of crashes

### Description: 
- A **horizontal bar graph** showing the number of crashes for each **speed limit** during a selected time period.
- **Displayed alongside the heatmap** for cross-referencing crash locations with speed limits.
- Uses **road sign icons** as a visual key (e.g., **speed limit signs**) to match the road safety theme.
- They should smoothly change positions
- Example https://rtl.co.nz/product/rg0130-132/speed-limit-signs

### Justification of design:  
- **Length & Position**: The **bar length** directly represents crash frequency, making differences easy to compare.
- **Icons & Symbols**: Using **speed limit signs** instead of just numbers improves readability and thematic consistency.
- **Categorical Colour Coding**: Different speed categories (e.g., urban vs. highway speeds) can be **colour-coded** to reinforce the meaning.
- **Dual Representation**: Placing it **next to the heatmap** allows for an immediate connection between speed limits and crash-prone areas.
---
## Z'Arn
### Title: Breakdown of Crashes by Road Features

### Descripton: 
- A **bar graph** showing the number of crashes bero
- Features such as *signage*, *stop signs*, and *lanes* may impact the chances of crashes. These could be explored by using something such as a radio buttons.
- Grouping by severity could provide additional breadth of information for those interested.

### Justification of design:
- **Length and Position:** by using frequency in bar plots, we make it easy to make Quantitative comparisons between different groups. 
- **Interactive Elements** from radio buttons allow for more depth in data to be displayed on the same chart. It may also allow for limited comparison between different features correlation with crash severity. 
- **Distinct Grouping** using bars for various severities allow users to differentiate injus 
- This design would be very useful for civil engineers such as Anton. Here, he would have interest in how features impact road incidents.

### Title: Time Series of Crashes
![Crashes by severity](visualisation_planning/Crashes%20per%20year%20by%20severity.png)
### Descripton: 
- A Time Series of crashes over time, with data displayed via a line graph.
- **x-axis** involves year.
- **y-axis** involves frequencies of crashes.
- Can be broken down by region. Can be picked out from a larger map.
- Additionally, the graph can be split by severity (e.g., minor, serious, fatal), with separate lines for each severity group, allowing for comparison over time.Can break down things by severity, with seperate groups on a line graph. 


### Justification of design: 
-  Longitudinal view allows users to track trends and patterns in crashes over time. The line graph effectively communicates the progression of crashes from year to year, making it easy to identify peaks, declines, or consistent trends.
Breakdown by region provides a way for users to focus on specific areas and understand how crashes have evolved in different locations across New Zealand.
- Severity breakdown adds another layer of insight, allowing users to differentiate between crash types and assess if certain severity levels have increased or decreased over time.
- Intuitive design with clear time-based progression and the ability to filter by regions and severity ensures that users can quickly derive meaningful insights from the data.
- This design is beneficial for transportation agencies, city planners, and policymakers who need to understand long-term crash trends and target specific regions or crash types for further investigation or intervention.

### Title: Crash Trends by Weather Conditions 

### Descripton: 
- A line graph or stacked area chart that shows crash trends in relation to weather conditions (rain, snow, fog, clear).
- The graph would display the number of crashes over time, grouped by weather condition.
- Allows users to compare how weather patterns impact crash frequencies.
### Justification of design: 
- Weather Influence is a key factor in many road accidents, and this graph would provide actionable insights into how weather affects crash frequency.
- Comparison over time allows users to track how weather-related crashes have changed or worsened over the years.
- Civil engineers and road safety officials could use this data to plan road improvements, weather-related warnings, and allocate resources during adverse conditions.
----
## Kahu
### Title: 
Interactive Bar chart breakdown by region

### Descripton: 
make use of a geo map which outlines the different regions within New Zealand. Upon hovering over a region, the bar chart
will display quick, easily digestible statistical information (average crashes/fatalities per year, ratio of minor/medium and severe crashes)
breakdowns. Upon clicking on a region, this will add the region to their selection. Users can add multiple selections to compare.

A user can click a play button, which will play a ~20 sec visualisation on a bar chart showing the changes in crash
statistics compared to the other regions in their selected regions.

This "simulation" will allow users to see how the crash statistics have changed over time in their selected regions, allowing them to pause,
rewind, and fast-forward to see the changes in statistics. (should add an option to swap to normalised data vs raw data)

### Justification of design:
- **Interactive Elements**: The use of a map and bar chart allows for a more interactive experience, allowing users to quickly compare regions and see how they stack up against each other.
- **Position & Spatial Encoding**: The use of a map allows for a more natural understanding of the data, as users can see where the regions are in relation to each other.
- **Transparency & Layering**: The use of a play button allows for a more dynamic experience, allowing users to see how the data changes over time.

### Title: Region crash location overview
Continuing on, a user can double click on a region fro the map above, this will zoom in to a overview of the region, showing a more detailed version
which will still look like a map and will show the locations of the crashes. the user can also so the same thing and play a simulation
of crashes over time, with color indications of the severity of the crashes.


### Descripton:
- **Position & Spatial Encoding**: The use of a map allows for a more natural understanding of the data, as users can see where the regions are in relation to each other.
- **Transparency & Layering**: The use of a play button allows for a more dynamic experience, allowing users to see how the data changes over time.
- **Interactive Elements**: Use of time bar to show the changes in crash statistics over time, allowing users to see how the data changes over time.

### Justification of design: 
- **Interactive Elements**: The use of a map and bar chart allows for a more interactive experience, allowing users to quickly compare regions and see how they stack up against each other.
- **Position & Spatial Encoding**: The use of a map allows for a more natural understanding of the data, as users can see where diffrent crashes happen.

### Title:
Crash Risk Factors Breakdown

### Descripton:
This visualization will use either a Bubble Chart or a Parallel Coordinates Plot to analyze the 
key factors contributing to crashes and their severity. The goal is to uncover patterns in crash 
causes, such as road conditions, weather, time of day, and vehicle type.

### Justification of design:
- **Multivariate Analysis:** Allows users to explore multiple crash factors at once and identify high-risk conditions.
- **Visual Encoding:** Bubble size and color make it easy to see which factors contribute the most to crashes.
- **Interactivity:** Users can filter by region, time, vehicle type, or weather conditions to customize their analysis.
- **Temporal Insights:** A timeline slider helps track how crash risk factors change over time.
