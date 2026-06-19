const express = require('express');
const path = require('path');
const fs = require('fs');
const exphbs = require('express-handlebars');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  helpers: {
    eq: (a, b) => a === b
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

const reviewsFile = path.join(__dirname, 'data', 'reviews.json');
const ordersFile = path.join(__dirname, 'data', 'orders.json');

app.get('/reviews', (req, res) => {
  fs.readFile(reviewsFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading reviews.json:', err);
      return res.status(500).json({ error: 'Could not load reviews.' });
    }

    let reviews = [];
    try {
      reviews = JSON.parse(data);
    } catch (parseErr) {
      console.error('Invalid JSON format:', parseErr);
    }

    return res.json(reviews);
  });
});

app.post('/submit-review', (req, res) => {
  const newReview = req.body;

  fs.readFile(reviewsFile, 'utf8', (err, data) => {
    let reviews = [];

    if (!err && data) {
      try {
        reviews = JSON.parse(data);
      } catch (parseErr) {
        console.error('Error parsing existing reviews:', parseErr);
      }
    }

    reviews.push(newReview);

    fs.writeFile(reviewsFile, JSON.stringify(reviews, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error writing to reviews.json:', writeErr);
        return res.status(500).json({ error: 'Failed to save review.' });
      }

      return res.status(200).json({ message: 'Review saved successfully!' });
    });
  });
});

app.get('/manager-dashboard', (req, res) => {
  const cityFilter = req.query.city || 'All';
  const deliveryOnly = req.query.delivery === 'on' || req.query.delivery === 'true';

  fs.readFile(ordersFile, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error loading orders.');

    let orders = [];
    try {
      orders = JSON.parse(data);
    } catch (parseErr) {
      console.error('Invalid orders JSON format:', parseErr);
    }

    if (cityFilter && cityFilter !== 'All') {
      orders = orders.filter(order => order.city === cityFilter);
    }

    if (deliveryOnly) {
      orders = orders.filter(order => order.delivery === true);
    }

    const orderCount = orders.length;
    let totalRevenue = 0;
    let deliveryCount = 0;

    orders.forEach(order => {
      totalRevenue += order.total || 0;
      if (order.delivery) {
        deliveryCount += 1;
      }
    });

    const averageOrderTotal = orderCount > 0 ? totalRevenue / orderCount : 0;

    res.render('manager-dashboard', {
      title: 'Manager Dashboard',
      activePage: 'dashboard',
      extraStyles: '',
      orders,
      cityFilter,
      deliveryOnly,
      showCity: cityFilter === 'All',
      orderCount,
      deliveryCount,
      totalRevenue: totalRevenue.toFixed(2),
      averageOrderTotal: averageOrderTotal.toFixed(2)
    });
  });
});

app.listen(PORT, () => {
  console.log(`Byte Bistro server running at http://localhost:${PORT}`);
});