document.addEventListener('DOMContentLoaded', () => {
    loadGenres();
    loadReleases();
});

/**
 * Fetches and loads distinct genres from the server and populates the genres dropdown menu.
 * The genres are divided into columns for better display and each genre is added as a link.
 *
 * @async
 * @function loadGenres
 * @returns {Promise<void>} A promise that resolves when genres are successfully fetched and loaded,
 *                          or logs an error to the console if the operation fails.
 *
 * @example
 * // Populates the #genreContainer element with genre links grouped into columns
 * loadGenres();
 */
async function loadGenres() {
    try {
        const response = await fetch('/springboot/distinctGenres');
        if (response.ok) {
            const genres = await response.json();
            const genreContainer = document.getElementById('genreContainer');

            const genresPerColumn = 7;
            const columns = Math.ceil(genres.length / genresPerColumn);

            for (let i = 0; i < columns; i++) {
                const colDiv = document.createElement('div');
                colDiv.classList.add('col-md-4');

                const start = i * genresPerColumn;
                const end = start + genresPerColumn;
                const columnGenres = genres.slice(start, end);

                columnGenres.forEach(genre => {
                    const genreLink = document.createElement('a');
                    genreLink.classList.add('dropdown-item');
                    genreLink.href = `/springboot/genres?genre=${encodeURIComponent(genre)}`;
                    genreLink.textContent = genre;
                    colDiv.appendChild(genreLink);
                });

                genreContainer.appendChild(colDiv);
            }
        } else {
            console.error('Failed to fetch genres:', response.status);
        }
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

/**
 * Fetches and loads distinct release dates from the server and populates the releases dropdown menu.
 * Each date is added as a link in a list item.
 *
 * @async
 * @function loadReleases
 * @returns {Promise<void>} A promise that resolves when release dates are successfully fetched and loaded,
 *                          or logs an error to the console if the operation fails.
 *
 * @example
 * // Populates the #releaseContainer element with release date links
 * loadReleases();
 */
async function loadReleases() {
    try {
        const response = await fetch('/springboot/distinctDates');
        if (response.ok) {
            const dates = await response.json();
            const releaseContainer = document.getElementById('releaseContainer');

            // Ajouter les années comme éléments de menu
            dates.forEach(date => {
                const releaseItem = document.createElement('li');
                const releaseLink = document.createElement('a');
                releaseLink.classList.add('dropdown-item');
                releaseLink.href = `/springboot/releases?date=${encodeURIComponent(date)}`;
                releaseLink.textContent = date;
                releaseItem.appendChild(releaseLink);
                releaseContainer.appendChild(releaseItem);
            });
        } else {
            console.error('Failed to fetch release dates:', response.status);
        }
    } catch (error) {
        console.error('Error fetching release dates:', error);
    }
}
