module.exports = {
    /**
     * Formats a duration in minutes into a human-readable string.
     *
     * @param {number} minutes - The duration in minutes.
     * @returns {string} A formatted string representing the duration in hours and minutes (e.g., "1h30min"),
     *                   or "No duration available" if the input is invalid or undefined.
     * @example
     * formatDuration(45); // Returns "45min"
     * formatDuration(120); // Returns "2h"
     * formatDuration(null); // Returns "No duration available"
     */
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

    /**
     * Generates an HTML representation of a star-based rating display.
     *
     * @param {number} rating - A numeric rating value between 0 and 5 (inclusive).
     * @returns {string} An HTML string containing a star display with each star's fill percentage
     *                   based on the rating, or "No rating available" if the input is invalid or undefined.
     *
     * @example
     * generateStarDisplay(3.5); // Returns an HTML string with 3.5 stars filled
     * generateStarDisplay(0); // Returns an HTML string with no stars filled
     * generateStarDisplay(null); // Returns "No rating available"
     */
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
