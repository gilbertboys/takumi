const reviewList = document.getElementById('reviewList');
const form = document.getElementById('reviewForm');

function renderReview(review, prepend = true) {
  if (!reviewList) {
    return;
  }

  const rating = Number(review.rating) || 0;
  const clampedRating = Math.max(0, Math.min(5, rating));
  const stars = '★'.repeat(clampedRating);

  const div = document.createElement('div');
  div.className = 'review-box';
  div.innerHTML = `
    <article>
      <div class="stars">${stars}</div>
      <h3 class="review-title">${review.title}</h3>
      <p>${review.comment}</p>
      <p class="review-meta">– ${review.name}, ${review.city}</p>
    </article>
  `;

  if (prepend) {
    reviewList.prepend(div);
  } else {
    reviewList.append(div);
  }
}

fetch('/reviews')
  .then((response) => response.json())
  .then((data) => {
    if (Array.isArray(data)) {
      data.forEach((review) => renderReview(review, false));
    }
  })
  .catch((error) => {
    console.error('Error loading reviews:', error);
  });

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const review = {
      name: document.getElementById('name').value.trim(),
      city: document.getElementById('city').value,
      rating: parseInt(document.getElementById('rating').value, 10),
      title: document.getElementById('title').value.trim(),
      comment: document.getElementById('comment').value.trim()
    };

    fetch('/submit-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    })
      .then((response) => response.json())
      .then(() => {
        renderReview(review, true);
        form.reset();
      })
      .catch((error) => {
        console.error('Error saving review:', error);
      });
  });
}
