$(document).ready(function () {
  //global stuff
  const apiKey = "b5c842f082af7c42b54113072b2a2dc6";
  const currentDay = moment().format("L");

  function getRequestUrl(cityName) {
    return `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=b5c842f082af7c42b54113072b2a2dc6&units=imperial`;
  }
  function requestUvIndex(lat, lon) {
    return `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=b5c842f082af7c42b54113072b2a2dc6&units=imperial`;
  }

  function requestForecast(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&appid=${apiKey}&units=imperial`;
  }

  function requestForecastDates(cityName) {
    return `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
  }

  //event listeners
  $("#searchBtn").on("click", function (e) {
    e.preventDefault();
    let cityName = $("#cityInput").val();
    getWeatherData(cityName);
    getForecastDates(cityName);
    createSearchHistory(cityName);
    $(".forecast").removeClass("hide");
    $("#cityInput").val("");
  });

  $(document).on("click", ".citySearched", function () {
    const cityName = $(this).text();
    $(".forecast").removeClass("hide");
    getWeatherData(cityName);
    getForecastDates(cityName);
  });

  $("#clearBtn").on("click", function () {
    localStorage.clear();
    $(".searchHistory").empty();
  });

  //functions
  function getWeatherData(cityName) {
    $.ajax({
      url: getRequestUrl(cityName),
      method: "GET",
    }).then(function (data) {
      // console.log(data);
      $("#location").text(data.name + " " + currentDay);
      $("#currentTemp").text("Temp: " + data.main.temp + " °F");
      $("#currentHumi").text("Humidity: " + data.main.humidity);
      $("#currentWS").text("Wind Speed: " + data.wind.speed);
      const lat = data.coord.lat;
      const lon = data.coord.lon;
      getUvIndex(lat, lon);
      getForecast(lat, lon);
    });
  }

  function getUvIndex(lat, lon) {
    $.ajax({
      url: requestUvIndex(lat, lon),
      method: "GET",
    }).then(function (data) {
      // console.log(data);
      $("#currentUV").text("UV Index: " + data.current.uvi);
    });
  }

  function getForecast(lat, lon) {
    $.ajax({
      url: requestForecast(lat, lon),
      method: "GET",
    }).then(function (data) {
      // console.log(data);
      const card = $(".forecastCard");
      for (let i = 0; i < 5; i++) {
        card[i].children[2].innerText = "Temp: " + data.daily[i].temp.day;
        card[i].children[3].innerText = "Humidity: " + data.daily[i].humidity;
        // card[0].children[0].innerText = data.list[0].dt_txt.split(" ")[0];
        // card[1].children[0].innerText = data.list[6].dt_txt.split(" ")[0];
        // card[2].children[0].innerText = data.list[14].dt_txt.split(" ")[0];
        // card[3].children[0].innerText = data.list[22].dt_txt.split(" ")[0];
        // card[4].children[0].innerText = data.list[30].dt_txt.split(" ")[0];
        let view = data.daily[i].weather[0].main;
        if (view === "Rain") {
          card[i].children[1].classList.remove(
            "fa-cloud",
            "fa-sun",
            "fa-snowflake"
          );
          card[i].children[1].classList.add("fa-cloud-rain");
          card[i].children[1].classList.add("fas");
        } else if (view === "Clouds") {
          card[i].children[1].classList.remove(
            "fa-cloud-rain",
            "fa-sun",
            "fa-snowflake"
          );
          card[i].children[1].classList.add("fa-cloud");
          card[i].children[1].classList.add("fas");
        } else if (view === "Clear") {
          card[i].children[1].classList.remove(
            "fa-cloud-rain",
            "fa-cloud",
            "fa-snowflake"
          );
          card[i].children[1].classList.add("fa-sun");
          card[i].children[1].classList.add("fas");
        } else if (view === "Snow") {
          card[i].children[1].classList.remove(
            "fa-cloud-rain",
            "fa-cloud",
            "fa-sun"
          );
          card[i].children[1].classList.add("fa-snowflake");
          card[i].children[1].classList.add("fas");
        }
      }
    });
  }

  function getForecastDates(cityName) {
    $.ajax({
      url: requestForecastDates(cityName),
      method: "GET",
    }).then(function (data) {
      console.log(data);
      const card = $(".forecastCard");
      card[0].children[0].innerText = data.list[0].dt_txt.split(" ")[0];
      card[1].children[0].innerText = data.list[7].dt_txt.split(" ")[0];
      card[2].children[0].innerText = data.list[15].dt_txt.split(" ")[0];
      card[3].children[0].innerText = data.list[23].dt_txt.split(" ")[0];
      card[4].children[0].innerText = data.list[31].dt_txt.split(" ")[0];
    });
  }

  function createSearchHistory(cityName) {
    if ($("#cityInput").val() === "") {
      alert("You need to enter a city!");
    } else {
      const newBtn = $("<button>");
      newBtn.addClass("citySearched");
      newBtn.text(cityName);
      newBtn.data("city", cityName);

      $(".searchHistory").prepend(newBtn);

      //Local Storage

      let citiesArray = JSON.parse(localStorage.getItem("nameOfCity")) || [];
      console.log(citiesArray);
      citiesArray.push(cityName);
      localStorage.setItem("nameOfCity", JSON.stringify(citiesArray));
    }
  }

  function displayStorage() {
    let citiesArray = JSON.parse(localStorage.getItem("nameOfCity")) || [];
    console.log(citiesArray);
    for (let i = 0; i < citiesArray.length; i++) {
      const newBtn = $("<button>");
      newBtn.addClass("citySearched");
      newBtn.text(citiesArray[i]);
      $(".searchHistory").prepend(newBtn);
    }
  }

  displayStorage();
});
