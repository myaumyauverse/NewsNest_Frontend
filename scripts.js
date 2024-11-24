const apiKey = '3cb831ba482e4b6b9261344af8d83022'; // Replace with your own NewsAPI key

// Function to fetch news based on category
const loadNews = (category = 'technology') => {
  const flashCardsContainer = document.querySelector('.flash-cards');
  flashCardsContainer.innerHTML = '<p>Loading...</p>'; // Display loading text

  const timestamp = new Date().getTime(); // Cache-busting
  fetch(`https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}&_=${timestamp}`)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'error') {
        flashCardsContainer.innerHTML = `<p>Error: ${data.message}</p>`;
        return;
      }

      const articles = data.articles || [];
      flashCardsContainer.innerHTML = articles.length
        ? ''
        : '<p>No news found for this category.</p>';

      articles.forEach(article => {
        const card = document.createElement('div');
        card.classList.add('card');
        const savedPosts = JSON.parse(localStorage.getItem('savedPosts')) || [];
        const isSaved = savedPosts.some(post => post.title === article.title);

        card.innerHTML = `
          <img src="${article.urlToImage || 'https://via.placeholder.com/400x200'}" alt="${article.title}" class="card-img">
          <div class="card-body">
            <h3 class="card-title">${article.title}</h3>
            <p class="card-description">${article.description || 'No description available'}</p>
            <a href="${article.url}" class="card-link" target="_blank">Read more</a>
            <button class="save-btn">
              <img src="${isSaved ? 'filled-bookmark-icon.png' : 'bookmark-icon.png'}" alt="Save Post" />
            </button>
          </div>
        `;

        const saveBtn = card.querySelector('.save-btn');
        saveBtn.addEventListener('click', () => {
          if (isSaved) {
            removePost(article.title);
            saveBtn.querySelector('img').src = 'bookmark-icon.png';
          } else {
            savePost({
              title: article.title,
              description: article.description || 'No description available',
              url: article.url,
              image: article.urlToImage || 'https://via.placeholder.com/400x200',
            });
            saveBtn.querySelector('img').src = 'filled-bookmark-icon.png';
          }
        });

        flashCardsContainer.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error fetching news:', error);
      flashCardsContainer.innerHTML = '<p>Failed to load news. Please try again later.</p>';
    });
};

// Save post to LocalStorage
const savePost = post => {
  const savedPosts = JSON.parse(localStorage.getItem('savedPosts')) || [];
  if (!savedPosts.some(savedPost => savedPost.title === post.title)) {
    savedPosts.push(post);
    localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
    alert('Post saved successfully!');
  } else {
    alert('This post is already saved.');
  }
};

// Remove post from LocalStorage
const removePost = postTitle => {
  const savedPosts = JSON.parse(localStorage.getItem('savedPosts')) || [];
  localStorage.setItem('savedPosts', JSON.stringify(savedPosts.filter(post => post.title !== postTitle)));
  alert('Post removed from saved posts!');
};

// Load default news on page load
window.onload = () => loadNews('technology');
document.querySelectorAll('.category-btn').forEach(button =>
  button.addEventListener('click', () => loadNews(button.textContent.toLowerCase()))
);
