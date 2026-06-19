'use strict';

//state arrays for selected items
let entrees = [];
let beverages = [];
let desserts = [];

//wire up menu item interactions
document.querySelectorAll('.menu-item').forEach(function(item) {
  item.addEventListener('click', handleItemClick);

  const confirmBtn = item.querySelector('.confirm-btn');
  const removeBtn = item.querySelector('.remove-btn');

  confirmBtn.addEventListener('click', confirmSelectedItem);
  removeBtn.addEventListener('click', removeSelectedItem);
});

//show quantity controls on card click
function handleItemClick(event) {
  const item = event.currentTarget;

  const name = item.dataset.name;
  const price = parseFloat(item.dataset.price);
  const category = item.dataset.category;

  console.log(`Clicked: ${name} | Price: ${price} | Category: ${category}`);

  const qtyInput = item.querySelector('.qty-input');
  const confirmBtn = item.querySelector('.confirm-btn');
  const removeBtn = item.querySelector('.remove-btn');

  qtyInput.style.display = 'inline-block';
  confirmBtn.style.display = 'inline-block';
  removeBtn.style.display = 'inline-block';

  item.classList.add('selected');
  qtyInput.focus();
}

//confirm item and update selection arrays
function confirmSelectedItem(event) {
  event.stopPropagation();

  const item = event.target.closest('.menu-item');
  const name = item.dataset.name;
  const price = parseFloat(item.dataset.price);
  const category = item.dataset.category;
  const qtyInput = item.querySelector('.qty-input');
  const quantity = parseInt(qtyInput.value, 10);

  if (isNaN(quantity) || quantity < 1) {
    console.log(`Please enter a valid quantity for ${name}.`);
    return;
  }

  const selectedItem = {
    name: name,
    price: price,
    quantity: quantity
  };

  updateSelectedArray(category, selectedItem);
  updateLiveOrder();

  console.log(`Confirmed: ${name} x ${quantity}`);
}

//remove item and reset controls
function removeSelectedItem(event) {
  event.stopPropagation();

  const item = event.target.closest('.menu-item');
  const name = item.dataset.name;
  const category = item.dataset.category;

  removeFromSelectedArray(category, name);

  const qtyInput = item.querySelector('.qty-input');
  const confirmBtn = item.querySelector('.confirm-btn');
  const removeBtn = item.querySelector('.remove-btn');

  qtyInput.value = '';
  qtyInput.style.display = 'none';
  confirmBtn.style.display = 'none';
  removeBtn.style.display = 'none';

  item.classList.remove('selected');

  updateLiveOrder();

  console.log(`Removed item: ${name}`);
}

//add or update selected item in category array
function updateSelectedArray(category, selectedItem) {
  if (category === 'entree') {
    const existingItem = entrees.find(function(item) {
      return item.name === selectedItem.name;
    });

    if (existingItem) {
      existingItem.quantity = selectedItem.quantity;
    } else {
      entrees.push(selectedItem);
    }
  } else if (category === 'beverage') {
    const existingItem = beverages.find(function(item) {
      return item.name === selectedItem.name;
    });

    if (existingItem) {
      existingItem.quantity = selectedItem.quantity;
    } else {
      beverages.push(selectedItem);
    }
  } else if (category === 'dessert') {
    const existingItem = desserts.find(function(item) {
      return item.name === selectedItem.name;
    });

    if (existingItem) {
      existingItem.quantity = selectedItem.quantity;
    } else {
      desserts.push(selectedItem);
    }
  }
}

//refresh the live order lists
function updateLiveOrder() {
  updateList('entree-list', entrees);
  updateList('beverage-list', beverages);
  updateList('dessert-list', desserts);
}

//render a category list
function updateList(listId, items) {
  const list = document.getElementById(listId);
  list.innerHTML = '';

  items.forEach(function(item) {
    const li = document.createElement('li');
    li.textContent = `${item.name} x ${item.quantity}`;
    list.appendChild(li);
  });
}

//remove an item from a category array
function removeFromSelectedArray(category, name) {
  if (category === 'entree') {
    entrees = entrees.filter(function(item) {
      return item.name !== name;
    });
  } else if (category === 'beverage') {
    beverages = beverages.filter(function(item) {
      return item.name !== name;
    });
  } else if (category === 'dessert') {
    desserts = desserts.filter(function(item) {
      return item.name !== name;
    });
  }
}

//format today's date for the order object
function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

//collect selected add-ons into the order format
function getSelectedAddOns() {
  const addOnsList = document.querySelectorAll('input[name="addOns"]:checked');
  const addOns = [];

  addOnsList.forEach(function(item) {
    addOns.push({
      name: item.value,
      price: parseFloat(item.dataset.price),
      quantity: 1
    });
  });

  return addOns;
}

//build the full order object for preview/submit
function buildOrderObject() {
  const selectedCity = document.querySelector('input[name="city"]:checked');
  const selectedDiningMethod = document.querySelector('input[name="diningMethod"]:checked');
  const diningMethod = selectedDiningMethod ? selectedDiningMethod.value : 'pickup';

  const order = {
    customer: document.getElementById('customerName').value,
    phone: document.getElementById('phone').value,
    time: document.getElementById('time').value,
    instructions: document.getElementById('instructions').value,
    date: getTodayDateString(),
    city: selectedCity ? selectedCity.value : '',
    delivery: diningMethod === 'delivery',
    tipPercent: parseFloat(document.getElementById('tipPercent').value),
    entrees: entrees,
    drinks: beverages,
    desserts: desserts,
    addOns: getSelectedAddOns()
  };

  return order;
}

//generate and display the receipt preview
function previewReceipt() {
  const order = buildOrderObject();
  const receipt = printReceipt(order, priceMap);

  document.getElementById('receiptOutput').textContent = receipt;
  document.getElementById('orderJson').value = JSON.stringify(order);
  document.getElementById('taxRate').value = taxRates[order.city] || 0;
}

//preview button handler
const previewButton = document.getElementById('previewBtn');
if (previewButton) {
  previewButton.addEventListener('click', previewReceipt);
}

//submit handler to fill hidden fields
const orderForm = document.getElementById('order-form');
if (orderForm) {
  orderForm.addEventListener('submit', function() {
    const order = buildOrderObject();
    document.getElementById('orderJson').value = JSON.stringify(order);
    document.getElementById('taxRate').value = taxRates[order.city] || 0;
  });
}
