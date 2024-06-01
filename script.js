'use strict';


const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputTemp = document.querySelector('.form__input--temp');
const inputClimb = document.querySelector('.form__input--climb');

let map, mapEvent;

if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
        function(positin)
        {
            const {latitude} = positin.coords;
            const {longitude} = positin.coords;
            // console.log(`https://www.google.com.ua/maps/@${latitude}.${longitude}z?entry=ttu`);

            const coords = [latitude, longitude]

            map = L.map('map').setView(coords, 12.5);


            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            L.marker(coords)
                .addTo(map)
                .bindPopup('A pretty CSS popup.<br> Easily customizable.')
                .openPopup();

        map.on('click', function(event){
            mapEvent = event;
            form.classList.remove('hidden');
            inputDistance.focus();


        });
  
 
        },
        function () {
            alert('НЕВОЗМОЖНО ПОЛУЧИТЬ ВАШЕ МЕСТОПОЛОЖЕНИЕ')
        })
}
form.addEventListener('submit', function(e){
    e.preventDefault();  
    inputDistance.value = inputDuration.value = inputTemp.value = inputClimb.value = '';
    inputDistance.focus();
    const {lat, lng} = mapEvent.latlng;
            L.marker([lat,lng])
            .addTo(map)
            .bindPopup(L.popup({
                maxWidth : 250,
                maxHeight : 	100,
                autoClose : false,
                closeOnClick : false,
                className : `running-popup`
            }))
            .setPopupContent(`Тренировка`)
            .openPopup();

        } )
inputType.addEventListener('change', function () {
    inputClimb.closest('.form__row').classList.toggle('form__row--hidden');
    inputTemp.closest('.form__row').classList.toggle('form__row--hidden');
})