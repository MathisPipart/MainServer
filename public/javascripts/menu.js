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

document.addEventListener('DOMContentLoaded', () => {
    loadGenres();
});
