'use strict';

const priceMap = {
	"Salmon Teriyaki": 18.99,
	"Chicken Katsu": 16.50,
	"Waikiki Roll": 15.00,
	"California Roll": 7.00,
	"Spicy Tuna Roll": 7.00,
	"Coffee - Small": 2.50,
	"Coffee - Medium": 3.00,
	"Coffee - Large": 3.50,
	"Tea - Small": 2.00,
	"Tea - Medium": 2.50,
	"Tea - Large": 3.00,
	"Soda - Small": 2.25,
	"Soda - Medium": 2.75,
	"Soda - Large": 3.25,
	"Juice - Small": 3.00,
	"Juice - Medium": 3.50,
	"Juice - Large": 4.00,
	"Green Tea Ice Cream": 6.99,
	"Mochi": 5.50,
	"Fruit Tart": 7.25
};

const order = {
	customer: "Victoria",
	date: "2025-05-01",
	city: "Corvallis",
	delivery: true,
	tipPercent: 15,

	entrees: [
		{ name: "Salmon Teriyaki", quantity: 1 },
		{ name: "California Roll", quantity: 2 }
	],

	drinks: [
		{ name: "Coffee - Medium", quantity: 1 },
		{ name: "Tea - Small", quantity: 2 }
	],

	desserts: [
		{ name: "Mochi", quantity: 1 }
	],

	addOns: []
};

console.log(order.customer);
console.log(order.city);
console.log(order.entrees[0].name);
console.log(order.entrees[1].name);
console.log(order.drinks[0].quantity);

order.entrees.forEach(function(item) {
	console.log(item.name, item.quantity);
});

order.entrees.forEach((item) => {
	console.log(item.name, item.quantity);
});

for (let i = 0; i < order.entrees.length; i++) {
	console.log(order.entrees[i].name, order.entrees[i].quantity);
}

order.drinks.forEach(function(item) {
	console.log(item.name, item.quantity);
});
