const setup = () => {
  $(`#searchButton`).on(`click`, searchLocation);
  if (localStorage.getItem(`locationData`) == null);
  localStorage.setItem(`locationData`, `Gent`);
  loadForecast();
};

const getDayForIndex = (i) => {
  switch (i) {
    case 1:
      return `Maandag`;
    case 2:
      return `Dinsdag`;
    case 3:
      return `Woensdag`;
    case 4:
      return `Donderdag`;
    case 5:
      return `Vrijdag`;
    case 6:
      return `Zaterdag`;
    case 7:
      return `Zondag`;
  }
};

const getCurrentWeather = (location) => {
  let urlUser = `http://api.weatherapi.com/v1/current.json`;
  $.ajax({
    url: urlUser,
    type: `get`,
    data: {
      q: location,
      key: `bfceef9ed8b94bc2be9101720202910`,
      lang: `NL`,
    },
    success: function (result) {
      let currentWeather = {
        icon: `https:${result.current.condition.icon}`,
        locationName: result.location.name,
        lastUpdated: result.current.last_updated,
        temp: result.current.temp_c + `°C`,
      };
      setCurrentWeather(currentWeather);
    },
  });
};

const getForecastWeather = (location) => {
  let urlUser = `http://api.weatherapi.com/v1/forecast.json?`;
  $.ajax({
    url: urlUser,
    type: `get`,
    data: {
      q: location,
      key: `bfceef9ed8b94bc2be9101720202910`,
      days: 3,
      lang: `NL`,
    },
    success: function (result) {
      $(`#forecastList`).empty();
      let dayindex = new Date().getDay();
      $.each(result.forecast.forecastday, function (i, item) {
        let dayName = `Vandaag`;
        if (i != 0) {
          dayName = getDayForIndex(dayindex + i);
        }

        let forecastItem = {
          icon: `https:${item.day.condition.icon}`,
          status: item.day.condition.text,
          minTemp: item.day.mintemp_c + `°C`,
          maxTemp: item.day.maxtemp_c + `°C`,
          date: item.date,
          rainChance: item.day.daily_chance_of_rain,
          maxWindSpeed: item.day.maxwind_kph,
          dayText: dayName,
        };
        addListItem(forecastItem, i);
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("Locatie niet gevonden.");
    },
  });
};

const setCurrentWeather = (currentWeather) => {
  $(`#weatherNowIcon`).attr(`src`, currentWeather.icon);
  $(`#weatherNowLocationName`).text(currentWeather.locationName);
  $(`#weatherNowLastUpdated`).text(currentWeather.lastUpdated);
  $(`#weatherNowTemp`).text(currentWeather.temp);
};

const addListItem = (item, i) => {
  let list = $(`#forecastList`);
  list.append(`<li id="${i}">
  <table >
  <tr>
  <td rowspan="2" style="width: 5%; text-align: left">
  <img src="${item.icon}"/>
  </td>
  <td style="width: 25%; text-align: left">
  <span>${item.dayText}</span>
  </td>
  <td style="width: 70%; text-align: right">
  <span>Min: ${item.minTemp}</span>
  </td>
  </tr>
  <tr>
  <td style="width: 25%; text-align: left">
  <span>${item.status}</span>
  </td>
  <td style="width: 70%; text-align: right">
  <span>Max: ${item.maxTemp}</span>
  </td>
  </tr>
  </table>
  </li>`);
  let listItem = $(`#${i}`);
  listItem.data(`idData`, JSON.stringify(item));
  listItem.attr(`onClick`, `onItemClick(this.id)`);
};

const onItemClick = (i) => {
  let extraInfo = $(`#extraInfo`);
  extraInfo.empty();
  let listItem = JSON.parse($(`#${i}`).data(`idData`));
  extraInfo.append(`<table>
  <tr>
  <td>
  <span>Datum: <strong>${listItem.date}</strong></span>
  <td/>
  </tr>
  <tr>
  <td>
  <span>Kans op regen: <strong>${listItem.rainChance}%</strong></span>
  <td/>
  </tr>
  <tr>
  <td>
  <span>Windsnelheid: <strong>${listItem.maxWindSpeed} km/u</strong></span>
  <td/>
  </tr>
  </table>`);
};

const searchLocation = () => {
  let input = $(`#locationIn`).val();
  if (input == null || input == ``) {
    alert(`Geef aub een locatie in.`);
  } else {
    localStorage.setItem(`locationData`, input);
    getCurrentWeather(localStorage.getItem(`locationData`));
    getForecastWeather(localStorage.getItem(`locationData`));
    let extraInfo = $(`#extraInfo`);
    extraInfo.empty();
  }
};

const loadForecast = () => {
  console.log(`reload`);
  getCurrentWeather(localStorage.getItem(`locationData`));
  getForecastWeather(localStorage.getItem(`locationData`));
  let extraInfo = $(`#extraInfo`);
  extraInfo.empty();

  window.setTimeout(loadForecast, 60000);
};

$(setup);
