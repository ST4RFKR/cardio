'use strict';


const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputTemp = document.querySelector('.form__input--temp');
const inputClimb = document.querySelector('.form__input--climb');


class  Workout {
  date = new Date();
  id = ( Date.now() + '').slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}

class Running extends Workout {
  type = 'running'
  constructor(coords, distance, duration, temp) {
    super(coords, distance, duration);
    this.temp = temp;
    this.calcPace();
  }
  calcPace () {
    this.pace = this.duration / this.distance;
  }
}

class Cycling extends Workout {
  type = 'cycling'
  constructor(coords, distance, duration, climb) {
    super(coords, distance, duration);
    this.climb = climb;
    this.calcSpeed();
  }
  calcSpeed () {
    this.speed = this.distance / this.duration / 60;
  }
}

class App {

  #map;
  #mapEvent;
  #workouts = [];

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
      const {lat, lng} = this.#mapEvent.latlng;
      let workout;

      const areNumbers =  (...numbers) =>  numbers.every((numb) => Number.isInteger(numb));
      const areNumbersPositive = (...numbers) => numbers.every((numb) => numb > 0);
      const clearInput = () => {
        inputDistance.value = inputDuration.value = inputTemp.value = inputClimb.value = '';
      }
      //Получить данные из формы
      const type = inputType.value;
      const distance =  +inputDistance.value;
      const duration = +inputDuration.value;

      //Если тренировка является пробежкой создать обьект Running
      if (type === 'running') {
        const temp = +inputTemp.value;
          //Проверить валидность даннных
          if (
        //        !Number.isInteger(distance)
          //   || !Number.isInteger(duration)
          //   || !Number.isInteger(temp)
        !areNumbersPositive(distance,duration,temp) ||
        !areNumbers(distance,duration,temp))
            return clearInput(), alert('Введите число');
      workout = new Running([lat, lng] , distance, duration, temp);

      }
      //Если тренировка является пробежкой создать обьект Cycling
      if (type === 'cycling') {
        //Проверить валидность даннных
        const climb = +inputClimb.value;
        if (
          //        !Number.isInteger(distance)
          //   || !Number.isInteger(duration)
          //   || !Number.isInteger(climb)
          !areNumbersPositive(distance,duration) ||
          !areNumbers(distance,duration,climb))
          return clearInput(), alert('Введите число');
        workout = new Cycling([lat, lng] , distance, duration, climb);

      }

      this.#workouts.push(workout);
      console.log(workout);
      //Добаить новый обьект в массив тренироваок

      //Отобразить треноровнку на карте
      this.displayWorkout(workout);
      inputDistance.focus();



      //Очистить поля формы

      clearInput();

    }
    displayWorkout (workout) {
      L.marker(workout.coords)
        .addTo(this.#map)
        .bindPopup(L.popup({
          maxWidth : 250,
          maxHeight : 	100,
          autoClose : false,
          closeOnClick : false,
          className : `${workout.type}-popup`
        }))
        .setPopupContent(`Тренировка`)
        .openPopup();
    }
}

const app = new App();






