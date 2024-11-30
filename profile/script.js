document.addEventListener('DOMContentLoaded', () => {
    const historyContainer = document.getElementById('history-container');
    const favoritesContainer = document.getElementById('favorites-container');

    // Fetch data from JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Load Swap History Data
            data.swapHistory.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.classList.add('history-item');
                historyItem.innerHTML = `<p><strong>${item.date}</strong>: ${item.user} - ${item.amount}</p>`;
                historyContainer.appendChild(historyItem);
            });

            // Load Favorites Data
            data.favorites.forEach(favorite => {
                const img = document.createElement('img');
                img.src = favorite.image;
                img.alt = favorite.title;
                img.title = favorite.description;
                img.classList.add('favorite-item');
                favoritesContainer.appendChild(img);
            });
        })
        .catch(error => console.error('Error loading JSON data:', error));
});
