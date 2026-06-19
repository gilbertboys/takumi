//orders.js – takumi sushi & sake bar sample order data

//sample order array for testing
const orders = [
  {
    customer: "Victoria",
    date: "2026-04-11",
	city: "Hillsboro",
    delivery: true,
    tipPercent: 20,
    entrees: [
      { name: "Salmon Teriyaki", quantity: 1 },
      { name: "California Roll", quantity: 2 }
    ],
    drinks: [
      { name: "Tea", quantity: 2 }
    ],
    desserts: [],
    addOns: []
  },
  {
    customer: "Willy",
    date: "2026-04-11",
	city: "Hillsboro",
    delivery: false,
    tipPercent: 15,
    entrees: [],
    drinks: [
      { name: "Soda", quantity: 1 }
    ],
    desserts: [
      { name: "Mochi", quantity: 1 }
    ],
    addOns: []
  },
  {
    customer: "Alex Byte",
    date: "2026-04-12",
	city: "Provo",
    delivery: true,
    tipPercent: 18,
    entrees: [
      { name: "Chicken Katsu", quantity: 2 }
    ],
    drinks: [
      { name: "Coffee", quantity: 1 },
      { name: "Soda", quantity: 1 }
    ],
    desserts: [
      { name: "Green Tea Ice Cream", quantity: 1 },
      { name: "Fruit Tart", quantity: 1 }
    ],
    addOns: ["extra cheese"]
  },
  {
    customer: "Riley",
    date: "2026-04-12",
	city: "Jackson",
    delivery: false,
    tipPercent: 10,
    entrees: [
      { name: "Waikiki Roll", quantity: 1 }
    ],
    drinks: [],
    desserts: [],
    addOns: ["side of rice"]
  },
  {
    customer: "Sammy",
    date: "2026-04-13",
	city: "Provo",
    delivery: true,
    tipPercent: 15,
    entrees: [
      { name: "Spicy Tuna Roll", quantity: 1 },
      { name: "Salmon Teriyaki", quantity: 1 }
    ],
    drinks: [
      { name: "Tea", quantity: 1 }
    ],
    desserts: [
      { name: "Green Tea Ice Cream", quantity: 1 }
    ],
    addOns: ["extra salsa"]
  },
  {
    customer: "Jordan",
    date: "2026-04-13",
	city: "Provo",
    delivery: false,
    tipPercent: 0,
    entrees: [
      { name: "California Roll", quantity: 1 }
    ],
    drinks: [
      { name: "Coffee", quantity: 1 }
    ],
    desserts: [],
    addOns: []
  },
  {
    customer: "Remy",
    date: "2026-04-15",
	city: "Jackson",
    delivery: false,
    tipPercent: 10,
    entrees: [
      { name: "Chicken Katsu", quantity: 1 },
      { name: "California Roll", quantity: 2 },
      { name: "Spicy Tuna Roll", quantity: 1 }
    ],
    drinks: [],
    desserts: [],
    addOns: []
  }
];

module.exports = orders;
