const temperature = 10;
const windSpeed = 5;

const calculateWindChill = (temperature, windSpeed) =>
    13.12 +
    (0.6215 * temperature) -
    (11.37 * Math.pow(windSpeed, 0.16)) +
    (0.3965 * temperature * Math.pow(windSpeed, 0.16));

const windChillElement = document.querySelector("#wind-chill");

if (temperature <= 10 && windSpeed > 4.8) {
    const windChill = calculateWindChill(temperature, windSpeed);

    windChillElement.textContent = `${windChill.toFixed(1)} °C`;
} else {
    windChillElement.textContent = "N/A";
}