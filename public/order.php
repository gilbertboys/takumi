<?php
// Basic confirmation page with submitted values
// CS 290 Activity 5 and HW 1
// Modify by adding your header and footer code.
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Order Confirmation</title>
  <link rel="stylesheet" href="styles/style.css">
  <link rel="stylesheet" href="styles/style-custom-munlyj.css">
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
    </ul>
  </nav>
</header>

<main>
  <h2>Thank You for Your Order!</h2>

  <p><strong>Name:</strong> <?php echo htmlspecialchars($_POST["name"]); ?></p>
  <p><strong>Phone:</strong> <?php echo htmlspecialchars($_POST["phone"]); ?></p>
  <p><strong>Entrée:</strong> <?php echo htmlspecialchars($_POST["entree"]); ?></p>
  <p><strong>Beverage:</strong> <?php echo htmlspecialchars($_POST["beverage"]); ?></p>
  <p><strong>Dessert:</strong> <?php echo htmlspecialchars($_POST["dessert"]); ?></p>

  <p><strong>Add-ons:</strong>
    <?php
      if (isset($_POST["addons"])) {
        if (is_array($_POST["addons"])) {
          echo implode(", ", array_map('htmlspecialchars', $_POST["addons"]));
        } else {
          echo htmlspecialchars($_POST["addons"]);
        }
      } else {
        echo "None";
      }
    ?>
  </p>

  <p><strong>Dining Method:</strong> <?php echo htmlspecialchars($_POST["dining"]); ?></p>
  <p><strong>Pick-up/Delivery Time:</strong> <?php echo htmlspecialchars($_POST["time"]); ?></p>
  <p><strong>Special Instructions:</strong> <?php echo nl2br(htmlspecialchars($_POST["instructions"])); ?></p>
  <p><strong>Total:</strong> <?php echo htmlspecialchars($_POST["total"]); ?></p>
</main>

<footer>
  <p>&copy; 2026 TAKUMI</p>
  <p>Created by: Jacob Munly</p>
</footer>

</body>
</html>
