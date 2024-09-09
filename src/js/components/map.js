import { lazyLoadFunc } from "../functions/lazyLoadFunc.js";
import { scrollTo } from "../functions/scrollTo.js";

const mapOptions = {
  center: [52.63374771515907, 50.45407973046877],
  // координаты филиалов
  branches: [
    {
      lat: 53.51226532980854,
      lon: 49.42618732568197,
    },
    {
      lat: 53.07929190101195,
      lon: 46.65281019921874,
    },
    {
      lat: 51.290066243507866,
      lon: 51.37693129296874,
    },
    {
      lat: 55.72958952717553,
      lon: 37.5986928024558,
    },
  ]
}

function init() {
  let map = new ymaps.Map('map', {
    center: mapOptions.center,
    zoom: 7,
    controls: ['routePanelControl']
  });

  map.controls.remove('geolocationControl');
  map.controls.remove('searchControl');
  map.controls.remove('trafficControl');
  map.controls.remove('typeSelector');
  map.controls.remove('fullscreenControl');
  map.controls.remove('zoomControl');
  map.controls.remove('rulerControl');
  map.behaviors.disable(['scrollZoom']);

  const control = map.controls.get('routePanelControl');

  // Функция для получения текущей геолокации
  const getCurrentLocation = (callback) => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(callback.success, callback.error, options);
  };

  // Добавление слушателя для кнопок
  document.querySelectorAll('[data-coords]').forEach((btn) => {
    btn.addEventListener('click', function () {
      const coords = this.dataset.coords;

      // Получаем текущую геолокацию
      getCurrentLocation({
        success: (pos) => {
          const crd = pos.coords;
          control.routePanel.state.set({
            type: 'masstransit',
            fromEnabled: false,
            from: `${crd.latitude}, ${crd.longitude}`, // Устанавливаем текущую геолокацию
            toEnabled: true,
            to: coords, // Устанавливаем координаты из атрибута data-coords
          });
          scrollTo(document.querySelector('.map'), 'top')
        },
        error: (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
        }
      });
    });
  });

  // Добавление меток на карту
  mapOptions.branches.forEach((item) => {
    const placemark = new ymaps.Placemark([item.lat, item.lon], {}, {
      iconLayout: 'default#image',
      iconImageHref: 'img/svg/marker.svg',
      iconImageSize: [36, 40],
      iconImageOffset: [0, 0]
    });

    map.geoObjects.add(placemark);
  });
}

// Загружаем карту по прокрутке
lazyLoadFunc(
  document.querySelectorAll('.map'), // triggerElems
  0.3, // threshold
  true, // unobserve
  () => ymaps.ready(init) // callback
);
