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
  
      slider.style.width = '150px';
  
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