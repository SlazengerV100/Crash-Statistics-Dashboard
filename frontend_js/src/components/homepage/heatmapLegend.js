export const heatmapLegend = (map) => {
    // Create a legend container
    const legendContainer = document.createElement('div');
    legendContainer.className = 'maplibregl-ctrl custom-heatmap-legend';
    legendContainer.style.position = 'absolute';
    legendContainer.style.top = '130px';
    legendContainer.style.left = '10px';
    legendContainer.style.backgroundColor = 'white';
    legendContainer.style.padding = '12px';
    legendContainer.style.borderRadius = '8px';
    legendContainer.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    legendContainer.style.width = '300px';
    
    // Title of the legend
    const title = document.createElement('div');
    title.textContent = 'Crash Density';
    title.style.fontSize = '14px';
    title.style.marginBottom = '10px';
    legendContainer.appendChild(title);
    
    // Create the color gradient for the legend
    const gradientContainer = document.createElement('div');
    gradientContainer.style.height = '20px';
    gradientContainer.style.background = 'linear-gradient(to right, rgba(33,102,172,0) 0%, rgb(103,169,207) 30%, rgb(209,229,240) 50%, rgb(253,219,199) 70%, rgb(239,138,98) 90%, rgb(178,24,43) 100%)';
    gradientContainer.style.marginBottom = '10px';
    legendContainer.appendChild(gradientContainer);
    
    // Add the legend labels below the gradient
    const labelsContainer = document.createElement('div');
    labelsContainer.style.display = 'flex';
    labelsContainer.style.justifyContent = 'space-between';
    
    const labels = ['Low', 'Medium', 'High'];
    labels.forEach(labelText => {
      const label = document.createElement('div');
      label.textContent = labelText;
      label.style.fontSize = '12px';
      label.style.color = '#444';
      labelsContainer.appendChild(label);
    });
    
    legendContainer.appendChild(labelsContainer);
    
    // Append the legend to the map's container
    map.getContainer().appendChild(legendContainer);
  };
  