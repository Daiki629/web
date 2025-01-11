const apiKey = "530970000fc340dab4303f8962675dd5"; // OpenWeatherMapのAPIキーを入力

async function checkUmbrella() {
  const city = document.getElementById("city").value;
  const result = document.getElementById("result");
  const weatherIcon = document.getElementById("weather-icon");

  if (!city) {
    result.textContent = "都市名を入力してください。";
    weatherIcon.style.display = "none";
    return;
  }

  result.textContent = "確認中...";
  weatherIcon.style.display = "none";

  try {
    // 都市名から緯度・経度を取得
    const geocodeResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    );
    if (!geocodeResponse.ok) throw new Error("都市が見つかりませんでした。");
    const geocodeData = await geocodeResponse.json();
    if (geocodeData.length === 0) throw new Error("都市が見つかりませんでした。");

    const { lat, lon } = geocodeData[0];

    // 天気情報を取得
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=ja`
    );
    if (!weatherResponse.ok) throw new Error("天気情報を取得できませんでした。");

    const weatherData = await weatherResponse.json();
    const weather = weatherData.weather[0].description;
    const rain = weatherData.rain ? weatherData.rain["1h"] : 0;

    // 結果表示
    if (rain > 0 || weather.includes("雨")) {
      result.textContent = `現在の天気: ${weather}。傘を持って行った方が良いでしょう！`;
      weatherIcon.src = "images/rainy.png"; // 雨のアイコン画像
    } else if (weather.includes("曇")) {
      result.textContent = `現在の天気: ${weather}。曇りです。`;
      weatherIcon.src = "images/cloudy.png"; // 曇りのアイコン画像
    } else if (weather.includes("晴")) {
      result.textContent = `現在の天気: ${weather}。傘は必要ありません。`;
      weatherIcon.src = "images/sunny.png"; // 晴れのアイコン画像
    } else {
      result.textContent = `現在の天気: ${weather}。雪に注意してください。`;
      weatherIcon.src = "images/other.png"; // 雪マークのアイコン画像
    }
    weatherIcon.style.display = "block";
  } catch (error) {
    result.textContent = `エラー: ${error.message}`;
    weatherIcon.style.display = "none";
  }
}

