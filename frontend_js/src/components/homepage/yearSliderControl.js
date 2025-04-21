export class YearSliderControl {
    constructor({year, setYear, availableYears}) {
        this._year = Number(year);
        this._setYear = setYear;
        this._availableYears = availableYears.map(Number).sort((a, b) => a - b);
        this._playing = false;
        this._intervalId = null;
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

        const label = document.createElement('label');
        label.textContent = `Year: ${this._year}`;
        label.style.fontSize = '14px';
        label.style.display = 'block';
        label.style.marginBottom = '4px';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = Math.min(...this._availableYears);
        slider.max = Math.min(Math.max(...this._availableYears), 2025);
        slider.step = 1;
        slider.value = this._year;
        slider.style.width = '100%';

        slider.addEventListener('change', (event) => {
            const newYear = Number(event.target.value);
            label.textContent = `Year: ${newYear}`;
            this._year = newYear;
            this._setYear(newYear);
        });

        const playButton = document.createElement('button');
        playButton.textContent = '▶ Play';
        playButton.className = 'MuiButton-root MuiButton-contained MuiButton-sizeMedium MuiButton-containedPrimary';
        playButton.style.marginTop = '8px';
        playButton.style.fontSize = '14px';
        playButton.style.cursor = 'pointer';
        playButton.style.textTransform = 'none';
        playButton.style.border = 'none';
        playButton.style.padding = '6px 16px';
        playButton.style.color = '#fff';
        playButton.style.backgroundColor = '#1976d2';
        playButton.style.borderRadius = '4px';
        playButton.style.boxShadow = '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)';
        playButton.onmouseenter = () => playButton.style.backgroundColor = '#1565c0';
        playButton.onmouseleave = () => playButton.style.backgroundColor = '#1976d2';


        playButton.addEventListener('click', () => {
            if (this._playing) {
                this._stopPlayback(playButton);
            } else {
                this._startPlayback(playButton, label, slider);
            }
        });

        this._container.appendChild(label);
        this._container.appendChild(slider);
        this._container.appendChild(playButton);

        return this._container;
    }

    _startPlayback(button, label, slider) {
        this._playing = true;
        button.textContent = '⏸ Pause';

        this._intervalId = setInterval(() => {
            const currentIndex = this._availableYears.indexOf(this._year);
            const nextYear = this._availableYears[currentIndex + 1];

            if (nextYear && nextYear <= 2025) {
                this._year = nextYear;
                this._setYear(nextYear);
                label.textContent = `Year: ${nextYear}`;
                slider.value = nextYear;
            } else {
                this._stopPlayback(button);
            }
        }, 2000);
    }

    _stopPlayback(button) {
        this._playing = false;
        button.textContent = '▶ Play';
        clearInterval(this._intervalId);
    }

    onRemove() {
        if (this._intervalId) {
            clearInterval(this._intervalId);
        }
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }

    getDefaultPosition() {
        return 'top-left';
    }
}
