module.exports = {
    formatDuration: (minutes) => {
        if (isNaN(minutes) || minutes === null || minutes === undefined) {
            return 'No duration available';
        } else if (minutes < 60) {
            return `${minutes}min`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h${mins > 0 ? mins + 'min' : ''}`;
    },

    generateStarDisplay: (rating) => {
        if (rating === null || rating === undefined || isNaN(rating)) {
            return 'No rating available';
        }

        // Generate HTML for stars
        let starsHTML = '<div class="stars-container">';
        for (let i = 1; i <= 5; i++) {
            const fillPercentage = Math.min(1, Math.max(0, rating - (i - 1))) * 100;
            starsHTML += `<div class="star" style="--star-fill: ${fillPercentage}%;"></div>`;
        }
        starsHTML += '</div>';
        return starsHTML;
    }
};
