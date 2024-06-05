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
  _setDescription () {
    this.type === 'running' ? this.description = `Пробежка ${new Intl.DateTimeFormat('ru-Ru').format(this.date)}` : this.description = `Велотренировка ${new Intl.DateTimeFormat('ru-Ru').format(this.date)}`

  }
}

class Running extends Workout {
  type = 'running'
  constructor(coords, distance, duration, temp) {
    super(coords, distance, duration);
    this.temp = temp;
    this.calcPace();
    this._setDescription();
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
    this._setDescription();
  }
  calcSpeed () {
    this.speed = this.distance / this.duration * 60;
  }
}

class App {

  #map;
  #mapEvent;
  #workouts = [];

    constructor() {

       this._getPositiont();

       this._getLocalStorageData();
      form.addEventListener('submit', this._newWorkout.bind(this))
      inputType.addEventListener('change', this._toggleClimbField);
      containerWorkouts.addEventListener('click', this._moveToWorkout.bind(this))
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
              // .addTo(this.#map)
              // .bindPopup('')
              // .openPopup();

      this.#map.on('click', this._showForm.bind(this));
      this.#workouts.forEach(workout => {
        this._displayWorkout(workout)
      })

    }
    _showForm (e) {
      this.#mapEvent = e;
      form.classList.remove('hidden');
      inputDistance.focus();
    }
    _hideInputForm (){
      form.classList.add('hidden');
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
      this._displayWorkout(workout);
      inputDistance.focus();
      //Отобразить треноровку в списке
      this._displayWorkoutOnSidebar(workout)
      //Очистить поля формы
      this._hideInputForm();
      clearInput();
      //Добавить в localStorage
      this._addWorkoutsToLocalStorage();

    }
    _displayWorkout (workout) {
      L.marker(workout.coords)
        .addTo(this.#map)
        .bindPopup(L.popup({
          maxWidth : 250,
          maxHeight : 	100,
          autoClose : false,
          closeOnClick : false,
          className : `${workout.type}-popup`
        }))
        .setPopupContent(`${workout.type === 'running' ? `🏃` : `🚵‍♂️`} ${workout.description}`)
        .openPopup();
    }
    _displayWorkoutOnSidebar (workout) {
      let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
            <h2 class="workout__title">${workout.description}</h2>
            <div class="workout__details">
              <span class="workout__icon">${workout.type === 'running' ? `🏃` : `🚵‍♂️`}</span>
              <span class="workout__value">${workout.distance}</span>
              <span class="workout__unit">км</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⏱</span>
              <span class="workout__value">${workout.duration}</span>
              <span class="workout__unit">мин</span>
            </div>
      `;
      if (workout.type === 'running'){
        html += `
           <div class="workout__details">
            <span class="workout__icon">📏⏱</span>
            <span class="workout__value">${workout.pace.toFixed(2)}</span>
            <span class="workout__unit">мин/км</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">👟⏱</span>
            <span class="workout__value">${workout.temp}</span>
            <span class="workout__unit">шаг/мин</span>
          </div>
        </li>
        `
      }
      if (workout.type === 'cycling'){
        html += `
          <div class="workout__details">
            <span class="workout__icon">📏⏱</span>
            <span class="workout__value">${workout.speed.toFixed(2)}</span>
            <span class="workout__unit">км/ч</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🏔</span>
            <span class="workout__value">${workout.climb}</span>
            <span class="workout__unit">м</span>
          </div>
        </li>
        `
      }

      form.insertAdjacentHTML('afterend', html)
    }
  _moveToWorkout(e) {
      const workoutElem = e.target.closest('.workout');
      if (!workoutElem) return;
      const workout = this.#workouts.find((item) => item.id === workoutElem.dataset.id);
      this.#map.setView(workout.coords, 14, {
        animate : true,
        pan : {
          duration : 1,
        }
      })

  }

  _addWorkoutsToLocalStorage () {
      localStorage.setItem('workouts', JSON.stringify(this.#workouts));

  }
  _getLocalStorageData () {
     const data = JSON.parse(localStorage.getItem('workouts'));
    // console.log(data);
    if (!data) return;
    this.#workouts = data;
    this.#workouts.forEach(workout => {
      this._displayWorkoutOnSidebar(workout);

    })
  }
  reset () {
      localStorage.removeItem('workouts');
      location.reload();
  }
}

const app = new App();






