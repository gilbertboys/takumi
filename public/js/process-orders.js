/*
  Name: Jacob Munly
  Date: 4/26/26
  Class: CS 290 – Web Development
  WebSite URL: https://web.engr.oregonstate.edu/~munlyj/cs290/hw3/
*/

const deliveryFee = 5.00;

//takumi sushi & sake bar menu price map

const priceMap = {
  "Salmon Teriyaki": 18.99,
  "Chicken Katsu": 16.50,
  "Waikiki Roll": 15.00,
  "California Roll": 7.00,
  "Spicy Tuna Roll": 7.00,
  "Coffee": 3.00,
  "Tea": 2.50,
  "Soda": 2.75,
  "Juice": 3.50,
  "Green Tea Ice Cream": 6.99,
  "Mochi": 5.50,
  "Fruit Tart": 7.25,
  "extra ginger and wasabi": 1.00,
  "miso soup": 2.00,
  "side of rice": 3.00,
  "chopsticks": 0.00,
  "napkins": 0.00,
  "DUMMY_ENTREE1": 10.00,
  "DUMMY_ENTREE2": 12.00,
  "DUMMY_DRINK": 2.00,
  "DUMMY_DESSERT": 4.00,
  "DUMMY_ADDON1": 1.00,
  "DUMMY_ADDON2": 2.00
};

//tax rates by city; unknown cities default to 0
const taxRates = {
  Hillsboro: 0.00,
  Provo: 0.07,
  Jackson: 0.06,
  Corvallis: 0.00,
  Golden: 0.05,
  Arcata: 0.08,
  DUMMYCITY1: 0.05,
  DUMMYCITY2: 0.00
};

//round to cents for consistent totals
function roundMoney(amount) {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/*
  Returns the first order whose customer name matches the provided name.
  Uses Array.find to search through the orders list.
*/
function findOrderByCustomer(orders, name) {
  return orders.find(function(order) {
    return order.customer === name;
  });
}

/*
  Calculates the subtotal for an order by summing:
  entree, drink, and dessert item price * quantity, plus add-on prices.
  Invalid item names are logged and skipped.
*/
function calculateSubtotal(order, prices) {
  let subtotal = 0;

  if (Array.isArray(order.entrees)) {
    order.entrees.forEach(function(item) {
      if (typeof prices[item.name] !== "number") {
        console.log("Invalid entree: " + item.name);
        return;
      }
      subtotal += prices[item.name] * item.quantity;
    });
  }

  if (Array.isArray(order.drinks)) {
    order.drinks.forEach(function(item) {
      if (typeof prices[item.name] !== "number") {
        console.log("Invalid drink: " + item.name);
        return;
      }
      subtotal += prices[item.name] * item.quantity;
    });
  }

  if (Array.isArray(order.desserts)) {
    order.desserts.forEach(function(item) {
      if (typeof prices[item.name] !== "number") {
        console.log("Invalid dessert: " + item.name);
        return;
      }
      subtotal += prices[item.name] * item.quantity;
    });
  }

  if (Array.isArray(order.addOns)) {
    order.addOns.forEach(function(item) {
      const unitPrice = (item && typeof item.price === "number" && !isNaN(item.price))
        ? item.price
        : prices[item.name];

      if (typeof unitPrice !== "number" || isNaN(unitPrice)) {
        console.log("Invalid add-on: " + item.name);
        return;
      }

      const qty = (item && typeof item.quantity === "number") ? item.quantity : 1;
      subtotal += unitPrice * qty;
    });
  }

  return roundMoney(subtotal);
}

/*
  Calculates tip using the subtotal and tip percent.
  Example: subtotal * (percent / 100)
*/
function calculateTip(subtotal, percent) {
  return roundMoney(subtotal * (percent / 100));
}


/*
  Prints a full receipt to the console for one order.
  Includes each item line, subtotal, tip, tax, delivery cost, and final total.
*/
function printReceipt(order, prices, rates) {
  const activeRates = rates || taxRates;
  const subtotal = calculateSubtotal(order, prices);
  const tip = calculateTip(subtotal, order.tipPercent);
  const tax = calculateTax(subtotal, order.city, activeRates);
  const deliveryCost = roundMoney((subtotal > 0 && order.delivery) ? deliveryFee : 0);
  const total = roundMoney(subtotal + tip + tax + deliveryCost);

  let receipt = "";
  receipt += "TAKUMI SUSHI & SAKE BAR RECEIPT - " + order.customer + "\n";
  receipt += "Date: " + order.date + "\n";
  receipt += "----------------------------------------\n";

  if (Array.isArray(order.entrees)) {
    order.entrees.forEach(function(item) {
      if (typeof prices[item.name] !== "number") {
        receipt += "Invalid entree: " + item.name + "\n";
        return;
      }
      const cost = roundMoney(prices[item.name] * item.quantity);
      receipt += "Entree: " + item.name + " x" + item.quantity + " - $" + cost.toFixed(2) + "\n";
    });
  }

  if (Array.isArray(order.drinks)) {
    order.drinks.forEach(function(item) {
      if (typeof prices[item.name] !== "number") {
        receipt += "Invalid drink: " + item.name + "\n";
        return;
      }
      const cost = roundMoney(prices[item.name] * item.quantity);
      receipt += "Drink: " + item.name + " x" + item.quantity + " - $" + cost.toFixed(2) + "\n";
    });
  }

  if (Array.isArray(order.desserts)) {
    order.desserts.forEach(function(item) {
      if (typeof prices[item.name] !== "number") {
        receipt += "Invalid dessert: " + item.name + "\n";
        return;
      }
      const cost = roundMoney(prices[item.name] * item.quantity);
      receipt += "Dessert: " + item.name + " x" + item.quantity + " - $" + cost.toFixed(2) + "\n";
    });
  }

  if (Array.isArray(order.addOns)) {
    order.addOns.forEach(function(item) {
      const unitPrice = (item && typeof item.price === "number" && !isNaN(item.price))
        ? item.price
        : prices[item.name];

      if (typeof unitPrice !== "number" || isNaN(unitPrice)) {
        receipt += "Invalid add-on: " + item.name + "\n";
        return;
      }

      const qty = (item && typeof item.quantity === "number") ? item.quantity : 1;
      const cost = roundMoney(unitPrice * qty);
      receipt += "Add-on: " + item.name + " x" + qty + " - $" + cost.toFixed(2) + "\n";
    });
  }

  receipt += "SUBTOTAL: $" + subtotal.toFixed(2) + "\n";
  receipt += "TIP: $" + tip.toFixed(2) + "\n";
  receipt += "TAX: $" + tax.toFixed(2) + "\n";
  receipt += "DELIVERY: $" + deliveryCost.toFixed(2) + "\n";
  receipt += "TOTAL: $" + total.toFixed(2) + "\n";

  console.log(receipt);
  return receipt;
}


/*
  Validates that order includes required fields and at least one menu item
  in entrees, drinks, or desserts.
*/
function validateOrder(order) {
  if (!order || !order.customer || !order.date || !order.city) {
    return false;
  }

  const hasEntrees = Array.isArray(order.entrees) && order.entrees.length > 0;
  const hasDrinks = Array.isArray(order.drinks) && order.drinks.length > 0;
  const hasDesserts = Array.isArray(order.desserts) && order.desserts.length > 0;

  return hasEntrees || hasDrinks || hasDesserts;
}

/*
  Adds a new order only when it passes validation.
  Returns true when added and false when rejected.
*/
function addOrder(orders, newOrder) {
  if (validateOrder(newOrder)) {
    orders.push(newOrder);
    return true;
  }

  console.log("Order is invalid and was not added.");
  return false;
}


// --- HW 3 ONLY ---
// These functions will be completed later.
// Ignore for Activity 8.
/*
  Calculates tax for a subtotal using the provided city and tax table.
  If the city is not found, tax is 0.
*/
function calculateTax(subtotal, city, rates) {
  if (!rates || typeof rates[city] !== "number") {
    return 0;
  }
  return roundMoney(subtotal * rates[city]);
}

/*
  Calculates the final order total.
  Total = subtotal + tip + tax + delivery fee (when applicable).
*/
function calculateTotal(order, prices, rates) {
  const activeRates = rates || taxRates;
  const subtotal = calculateSubtotal(order, prices);
  const tip = calculateTip(subtotal, order.tipPercent);
  const tax = calculateTax(subtotal, order.city, activeRates);
  const deliveryCost = roundMoney((subtotal > 0 && order.delivery) ? deliveryFee : 0);

  return roundMoney(subtotal + tip + tax + deliveryCost);
}

module.exports = {
  deliveryFee,
  priceMap,
  taxRates,
  findOrderByCustomer,
  calculateSubtotal,
  calculateTip,
  printReceipt,
  validateOrder,
  addOrder,
  calculateTax,
  calculateTotal
};


// --- TESTING SECTION (Call Your Functions Below) ---

/*
const orders = require('./orders.js');
// Find a customer's order and print it
const order = findOrderByCustomer(orders, "Willy");
if (order) printReceipt(order, priceMap);

// Add a new order
const newOrder = {
  customer: "Test Customer",
  date: "2025-04-23",
  city: "Corvallis",
  delivery: true,
  tipPercent: 12,
  entrees: [{ name: "Chicken Katsu", quantity: 1 }],
  drinks: [{ name: "Tea", quantity: 1 }],
  desserts: [{ name: "Mochi", quantity: 1 }],
  addOns: ["extra cheese"]
};
addOrder(orders, newOrder);

// Invalid order (should fail validation)
const badOrder = {
  customer: "Bad Customer",
  date: "2025-04-24",
  city: "Corvallis",
  delivery: false,
  tipPercent: 15,
  entrees: [],
  drinks: [],
  desserts: [],
  addOns: []
};
addOrder(orders, badOrder);

// Print all receipts and daily summary
orders.forEach(function(order) {
  printReceipt(order, priceMap);
});
*/