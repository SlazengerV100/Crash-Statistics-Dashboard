export class YearSliderControl {
    constructor({ year, setYear, availableYears }) {
      this._year = year;
      this._setYear = setYear;
      this._availableYears = availableYears;
      console.log(`Available years: ${this._availableYears}`);
    }
  
    onAdd(map) {
      this._map = map;
      this._container = document.createElement('div');
      this._container.className = 'maplibregl-ctrl custom-slider-ctrl';
      this._container.style.backgroundColor = 'white';
      this._container.style.padding = '12px';
      this._container.style.borderRadius = '8px';
      this._container.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
      this._container.style.display = 'flex';
      this._container.style.flexDirection = 'column';
      this._container.style.alignItems = 'center';
      this._container.style.width = '300px';

      // Build slider
      const label = document.createElement('label');
      label.textContent = `Year: ${this._year}`;
      label.style.fontSize = '14px';
      label.style.display = 'block';
      label.style.marginBottom = '4px';
  
      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = Math.min(...this._availableYears);
      slider.max = Math.max(...this._availableYears);
      slider.step = 1;
      slider.value = this._year;
      
      // slider fills width of container
      slider.style.width = '100%';
  
      slider.oninput = (e) => {
        const selectedYear = parseInt(e.target.value);
        label.textContent = `Year: ${selectedYear}`;
        this._setYear(selectedYear);
      };
  
      this._container.appendChild(label);
      this._container.appendChild(slider);
  
      return this._container;
    }
  
    onRemove() {
      this._container.parentNode.removeChild(this._container);
      this._map = undefined;
    }
  
    getDefaultPosition() {
      return 'top-left'; // or 'bottom-right', etc.
    }
  }