const cityData = {
	"city-city1": {
		name: "Hillsboro, Oregon",
		mapImage: "images/hillsboromap.png",
		mapLink: "https://www.google.com/maps/d/u/0/edit?mid=1BdFxIR_eEmcD8hqfK-x64GYckSMdSnI&usp=sharing",
		address: "2215 Allie Ave, Hillsboro, OR",
		coordinates: {
			latitude: 45.5229,
			longitude: -122.9898
		},
		hoursDisplay: {
			weekday: "Monday - Friday: 11:00 AM - 2:30 PM, 4:00 PM - 9:00 PM",
			weekend: "Saturday - Sunday: 12:00 PM - 9:00 PM"
		},
		hoursSchedule: {
			weekday: [
				{ start: "11:00", end: "14:30" },
				{ start: "16:00", end: "21:00" }
			],
			weekend: [
				{ start: "12:00", end: "21:00" }
			]
		}
	},
	"city-city2": {
		name: "Provo, Utah",
		mapImage: "images/provomap.png",
		mapLink: "https://www.google.com/maps/d/u/0/edit?mid=1PDUamLemrdXy8d4dle_Q-RbxF-9ibrs&usp=sharing",
		address: "1600 W 1200 S, Provo, UT",
		coordinates: {
			latitude: 40.2338,
			longitude: -111.6585
		},
		hoursDisplay: {
			weekday: "Monday - Friday: 10:30 AM - 2:00 PM, 4:30 PM - 9:30 PM",
			weekend: "Saturday - Sunday: 11:00 AM - 9:30 PM"
		},
		hoursSchedule: {
			weekday: [
				{ start: "10:30", end: "14:00" },
				{ start: "16:30", end: "21:30" }
			],
			weekend: [
				{ start: "11:00", end: "21:30" }
			]
		}
	},
	"city-city3": {
		name: "Jackson, Mississippi",
		mapImage: "images/jacksonmap.png",
		mapLink: "https://www.google.com/maps/d/u/0/edit?mid=14A2GmddUQWWuBG3AIfK8-a4EbVglLfs&usp=sharing",
		address: "224 Bailey Ave, Jackson, MS",
		coordinates: {
			latitude: 32.2988,
			longitude: -90.1848
		},
		hoursDisplay: {
			weekday: "Monday - Friday: 11:30 AM - 2:30 PM, 4:30 PM - 10:00 PM",
			weekend: "Saturday - Sunday: 12:00 PM - 10:00 PM"
		},
		hoursSchedule: {
			weekday: [
				{ start: "11:30", end: "14:30" },
				{ start: "16:30", end: "22:00" }
			],
			weekend: [
				{ start: "12:00", end: "22:00" }
			]
		}
	}
};

const weatherApiUrls = {
	"city-city1": "https://api.open-meteo.com/v1/forecast?latitude=45.5229&longitude=-122.9898&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=auto",
	"city-city2": "https://api.open-meteo.com/v1/forecast?latitude=40.2338&longitude=-111.6585&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=auto",
	"city-city3": "https://api.open-meteo.com/v1/forecast?latitude=32.2988&longitude=-90.1848&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=auto"
};

const weatherIcons = {
	sunny: {
		day: "images/sunnyday.png",
		night: "images/clearnight.png"
	},
	cloudy: {
		day: "images/cloudyday.png",
		night: "images/cloudynight.png"
	},
	rainy: {
		day: "images/rainyday.png",
		night: "images/rainynight.png"
	}
};

function updateCityInfo() {
	const selectedCity = document.querySelector('input[name="city"]:checked').id;

	updateMap(selectedCity);
	updateHours(selectedCity);
	fetchWeatherAndTime(selectedCity);
}

function updateMap(city) {
	const data = cityData[city];

	if (!data) {
		return;
	}

	const mapImage = document.getElementById("map-image");
	mapImage.src = data.mapImage;
	mapImage.alt = `Map of ${data.name}`;

	const mapLink = document.getElementById("map-link");
	mapLink.href = data.mapLink;

	const mapAddress = document.getElementById("map-address");
	mapAddress.innerText = data.address;
}

function updateHours(city) {
	const data = cityData[city];

	if (!data) {
		return;
	}

	const weekdayHours = document.getElementById("weekday-hours");
	const weekendHours = document.getElementById("weekend-hours");

	weekdayHours.innerText = data.hoursDisplay.weekday;
	weekendHours.innerText = data.hoursDisplay.weekend;
}

async function fetchWeatherAndTime(city) {
	const data = cityData[city];
	const apiUrl = weatherApiUrls[city];

	if (!data || !apiUrl) {
		return;
	}

	try {
		const response = await fetch(apiUrl);
		const weatherData = await response.json();

		const temperature = weatherData.current.temperature_2m;
		const weatherCode = weatherData.current.weather_code;
		const timeZone = weatherData.timezone;

		const localTime = getLocalTimeInfo(timeZone);
		const isDaytime = localTime.hour >= 6 && localTime.hour < 20;
		const weatherCategory = getWeatherCategory(weatherCode);
		const iconSet = weatherIcons[weatherCategory];

		const weatherIcon = document.getElementById("weather-icon");
		weatherIcon.src = isDaytime ? iconSet.day : iconSet.night;
		weatherIcon.alt = `${weatherCategory} weather`;

		document.getElementById("temperature").innerText = `${Math.round(temperature)}°F`;

		const bistroOpen = isBistroOpen(city, localTime);
		const bistroStatus = document.getElementById("bistro-status");
		const patioStatus = document.getElementById("patio-status");

		if (bistroOpen) {
			bistroStatus.innerText = `Restaurant is open. Local time: ${localTime.display}`;
			patioStatus.innerText = getPatioStatusMessage(temperature, weatherCode, localTime);
		} else {
			bistroStatus.innerText = `Restaurant is closed. Local time: ${localTime.display}`;
			patioStatus.innerText = "";
		}
	} catch (error) {
		const bistroStatus = document.getElementById("bistro-status");
		const patioStatus = document.getElementById("patio-status");

		bistroStatus.innerText = "Restaurant status unavailable.";
		patioStatus.innerText = "Weather data unavailable.";
	}
}

function getLocalTimeInfo(timeZone) {
	const now = new Date();
	const display = now.toLocaleTimeString("en-US", {
		timeZone,
		hour: "numeric",
		minute: "2-digit",
		hour12: true
	});
	const hourFormatter = new Intl.DateTimeFormat("en-US", {
		timeZone,
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
		weekday: "short"
	});

	const parts = hourFormatter.formatToParts(now);
	const hour = Number(parts.find((part) => part.type === "hour").value);
	const minute = Number(parts.find((part) => part.type === "minute").value);
	const weekday = parts.find((part) => part.type === "weekday").value;

	return {
		hour,
		minute,
		weekday,
		display
	};
}

function isBistroOpen(city, localTime) {
	const schedule = cityData[city].hoursSchedule;
	const isWeekend = localTime.weekday === "Sat" || localTime.weekday === "Sun";
	const ranges = isWeekend ? schedule.weekend : schedule.weekday;
	const currentMinutes = localTime.hour * 60 + localTime.minute;

	return ranges.some((range) => {
		const startMinutes = timeToMinutes(range.start);
		const endMinutes = timeToMinutes(range.end);

		return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
	});
}

function timeToMinutes(timeString) {
	const [hours, minutes] = timeString.split(":").map(Number);
	return hours * 60 + minutes;
}

function getWeatherCategory(weatherCode) {
	if (weatherCode === 0) {
		return "sunny";
	}

	if ((weatherCode >= 1 && weatherCode <= 3) || (weatherCode >= 45 && weatherCode <= 48)) {
		return "cloudy";
	}

	if (weatherCode >= 51) {
		return "rainy";
	}

	return "cloudy";
}

function getPatioStatusMessage(temperature, weatherCode, localTime) {
	const isDaytime = localTime.hour >= 6 && localTime.hour < 20;

	if (!isDaytime) {
		return "Patio is closed for the night.";
	}

	if (temperature < 55 || temperature > 95 || weatherCode >= 55) {
		return "Patio is closed due to weather.";
	}

	return "Patio is open!";
}

document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll('input[name="city"]').forEach((radio) => {
		radio.addEventListener("change", updateCityInfo);
	});

	updateCityInfo();
});
