var apiKey = "my api key";

function getRequestUrl(cityName) {
  return `api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
}

function getWeatherData(cityName) {
  $.ajax({
    url: getRequestUrl(cityName),
    method: "GET",
  }).then(function (data) {
    console.log(data);
  });
}

$("#button").on("click", function () {
  let cityName = $("#input-id").val();
  getWeatherData(cityName);
});
