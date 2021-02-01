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

  function requestForecast(cityName) {
    return `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`;
  }

  //event listeners
  $("#searchBtn").on("click", function (e) {
    e.preventDefault();
    let cityName = $("#cityInput").val();
    getWeatherData(cityName);
    getForecast(cityName);
    createSearchHistory(cityName);
    $(".forecast").removeClass("hide");
    $("#cityInput").val("");
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

  function getForecast(cityName) {
    $.ajax({
      url: requestForecast(cityName),
      method: "GET",
    }).then(function (data) {
      console.log(data);
      const card = $(".forecastCard");
      for (let i = 0; i < 5; i++) {
        card[i].children[2].innerText = "Temp: " + data.list[i].main.temp;
        card[i].children[3].innerText =
          "Humidity: " + data.list[i].main.humidity;
        card[0].children[0].innerText = data.list[0].dt_txt.split(" ")[0];
        card[1].children[0].innerText = data.list[6].dt_txt.split(" ")[0];
        card[2].children[0].innerText = data.list[14].dt_txt.split(" ")[0];
        card[3].children[0].innerText = data.list[22].dt_txt.split(" ")[0];
        card[4].children[0].innerText = data.list[30].dt_txt.split(" ")[0];
        let view = data.list[i].weather[0].main;
        console.log(view);
        if (view == "Rain") {
          card[i].children[1].classList.add("fas fa-cloud-rain");
        }
      }
    });
  }

  function createSearchHistory(cityName) {
    if ($("#cityInput").val() === "") {
      alert("You need to enter a city!");
    } else {
      const newBtn = $("<button>");
      newBtn.addClass("citySearched");
      newBtn.text(cityName);
      $(".searchHistory").prepend(newBtn);
    }
  }

  let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
});
