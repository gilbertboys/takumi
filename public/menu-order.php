<?php
//read posted data
$orderJson = $_POST["orderJson"] ?? "[]";
$taxRate = isset($_POST["taxRate"]) ? floatval($_POST["taxRate"]) : 0;
$order = json_decode($orderJson, true);
$deliveryFee = 5.00;
$errors = [];

//validate json decode
if (!is_array($order)) {
  $errors[] = "Invalid order data.";
  $order = [];
}

//safe access helper
function get_value($arr, $key, $default = "") {
  return isset($arr[$key]) ? $arr[$key] : $default;
}

//format dollars with rounding
function format_money($amount) {
  return number_format(round_money((float)$amount), 2);
}

//round to cents to match js
function round_money($amount) {
  return round($amount + 0.000000001, 2);
}

//sum item totals for a category
function subtotal_from_items($items) {
  $subtotal = 0;
  if (!is_array($items)) {
    return $subtotal;
  }

  foreach ($items as $item) {
    $price = isset($item["price"]) ? floatval($item["price"]) : 0;
    $quantity = isset($item["quantity"]) ? floatval($item["quantity"]) : 0;

    if ($price >= 0 && $quantity > 0) {
      $subtotal += $price * $quantity;
    }
  }

  return round_money($subtotal);
}

$entrees = get_value($order, "entrees", []);
$drinks = get_value($order, "drinks", []);
$desserts = get_value($order, "desserts", []);
$addOns = get_value($order, "addOns", []);

//calculate totals with rounding
$subtotal = subtotal_from_items($entrees)
  + subtotal_from_items($drinks)
  + subtotal_from_items($desserts)
  + subtotal_from_items($addOns);

$tipPercent = floatval(get_value($order, "tipPercent", 0));
$tip = round_money($subtotal * ($tipPercent / 100));
$tax = round_money($subtotal * $taxRate);
$delivery = round_money((!empty($order["delivery"]) && $subtotal > 0) ? $deliveryFee : 0);
$total = round_money($subtotal + $tip + $tax + $delivery);

//render a list of items with totals
function render_items($items) {
  if (!is_array($items) || count($items) === 0) {
    return "<li>None</li>";
  }

  $lines = [];
  foreach ($items as $item) {
    $name = htmlspecialchars($item["name"] ?? "", ENT_QUOTES, "UTF-8");
    $quantity = isset($item["quantity"]) ? intval($item["quantity"]) : 0;
    $price = isset($item["price"]) ? floatval($item["price"]) : 0;
    $lineTotal = round_money($price * $quantity);

    $lines[] = "<li>" . $name . " x " . $quantity . " - $" . format_money($lineTotal) . "</li>";
  }

  return implode("", $lines);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Takumi Sushi & Sake Bar - Order Confirmation</title>
  <link rel="stylesheet" href="styles/style.css">
  <link rel="stylesheet" href="styles/style-custom-munlyj.css">
  <link rel="stylesheet" href="styles/style-menu-munlyj.css">
</head>
<body>
  <header>
    <h1>Takumi Sushi & Sake Bar</h1>
    <nav class="nav-bar">
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="menu.html">Menu</a></li>
        <li><a href="order.html">Order</a></li>
        <li><a href="reviews.html">Reviews</a></li>
        <li><a href="menu-order.html">Interactive Order</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <h2>Order Confirmation</h2>

    <?php if (count($errors) > 0) { ?>
      <p><?php echo htmlspecialchars(implode(" ", $errors), ENT_QUOTES, "UTF-8"); ?></p>
    <?php } ?>

    <section>
      <h3>Customer Details</h3>
      <p><strong>Name:</strong> <?php echo htmlspecialchars(get_value($order, "customer"), ENT_QUOTES, "UTF-8"); ?></p>
      <p><strong>Phone:</strong> <?php echo htmlspecialchars(get_value($order, "phone"), ENT_QUOTES, "UTF-8"); ?></p>
      <p><strong>Date:</strong> <?php echo htmlspecialchars(get_value($order, "date"), ENT_QUOTES, "UTF-8"); ?></p>
      <p><strong>City:</strong> <?php echo htmlspecialchars(get_value($order, "city"), ENT_QUOTES, "UTF-8"); ?></p>
      <p><strong>Dining Method:</strong> <?php echo !empty($order["delivery"]) ? "Delivery" : "Pick-up"; ?></p>
      <p><strong>Pickup/Delivery Time:</strong> <?php echo htmlspecialchars(get_value($order, "time"), ENT_QUOTES, "UTF-8"); ?></p>
      <p><strong>Special Instructions:</strong> <?php echo htmlspecialchars(get_value($order, "instructions"), ENT_QUOTES, "UTF-8"); ?></p>
    </section>

    <section>
      <h3>Order Items</h3>
      <h4>Entrees</h4>
      <ul><?php echo render_items($entrees); ?></ul>

      <h4>Beverages</h4>
      <ul><?php echo render_items($drinks); ?></ul>

      <h4>Desserts</h4>
      <ul><?php echo render_items($desserts); ?></ul>

      <h4>Add-ons</h4>
      <ul><?php echo render_items($addOns); ?></ul>
    </section>

    <section>
      <h3>Order JSON</h3>
      <pre><?php echo htmlspecialchars($orderJson, ENT_QUOTES, "UTF-8"); ?></pre>
    </section>

    <section>
      <h3>Totals</h3>
      <p><strong>Subtotal:</strong> $<?php echo format_money($subtotal); ?></p>
      <p><strong>Tip (<?php echo intval($tipPercent); ?>%):</strong> $<?php echo format_money($tip); ?></p>
      <p><strong>Tax:</strong> $<?php echo format_money($tax); ?></p>
      <p><strong>Delivery Fee:</strong> $<?php echo format_money($delivery); ?></p>
      <p><strong>Total:</strong> $<?php echo format_money($total); ?></p>
    </section>
  </main>

  <footer>
    <p>&copy; 2026 TAKUMI</p>
    <p>Created by: Jacob Munly</p>
  </footer>
</body>
</html>
