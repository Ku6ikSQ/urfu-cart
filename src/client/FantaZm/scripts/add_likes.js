document.addEventListener('DOMContentLoaded', function () {
    const star = document.getElementById('star');

    star.addEventListener('click', function () {
        if (star.src.includes('star.png')) {
            star.src = 'assets/star_filled.png';
        } else {
            star.src = 'assets/star.png';
        }
    });
});