'use strict';


const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputTemp = document.querySelector('.form__input--temp');
const inputClimb = document.querySelector('.form__input--climb');



class App {

  #map;
  #mapEvent;
    constructor() {
      this._getPositiont();

      form.addEventListener('submit', this._newWorkout.bind(this))
      inputType.addEventListener('change', this._toggleClimbField);
    }

    _getPositiont () {
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
              this._loadMap.bind(this),
              function () {
                  alert('НЕВОЗМОЖНО ПОЛУЧИТЬ ВАШЕ МЕСТОПОЛОЖЕНИЕ')
              })
        }
    }
    _loadMap (position) {
            const {latitude} = position.coords;
            const {longitude} = position.coords;
            // console.log(`https://www.google.com.ua/maps/@${latitude}.${longitude}z?entry=ttu`);

            const coords = [latitude, longitude]

            this.#map = L.map('map').setView(coords, 12.5);


            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.#map);

            L.marker(coords)
              .addTo(this.#map)
              .bindPopup('A pretty CSS popup.<br> Easily customizable.')
              .openPopup();

      this.#map.on('click', this._showForm.bind(this));

    }
    _showForm (e) {
      this.#mapEvent = e;
      form.classList.remove('hidden');
      inputDistance.focus();
    }
    _toggleClimbField () {
      inputClimb.closest('.form__row').classList.toggle('form__row--hidden');
      inputTemp.closest('.form__row').classList.toggle('form__row--hidden');
    }
    _newWorkout (e) {
      e.preventDefault();
      inputDistance.value = inputDuration.value = inputTemp.value = inputClimb.value = '';
      inputDistance.focus();
      const {lat, lng} = this.#mapEvent.latlng;
      L.marker([lat,lng])
        .addTo(this.#map)
        .bindPopup(L.popup({
          maxWidth : 250,
          maxHeight : 	100,
          autoClose : false,
          closeOnClick : false,
          className : `running-popup`
        }))
        .setPopupContent(`Тренировка`)
        .openPopup();
    }
}

const app = new App();
// app._getPositiont();





