const apiKey = 'AjTkG8Zz4yZDUGy6z3VeH7Kegd21twm1C9OupMBJ'; 

document.addEventListener('DOMContentLoaded', () => {
    getCurrentImageOfTheDay();

    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const dateInput = document.getElementById('search-input').value;
        getImageOfTheDay(dateInput);
    });

    loadSearchHistory();
});

async function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    const apiUrl = `https://api.nasa.gov/planetary/apod?date=${currentDate}&api_key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        displayImageData(data, currentDate, "NASA Picture of the Day");
    } catch (error) {
        console.error('Error fetching current image:', error);
    }
}

async function getImageOfTheDay(date) {
    const apiUrl = `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        
        const title = date ? `Picture on Date: ${date}` : "NASA Picture of the Day";
        
        displayImageData(data, date, title);
        saveSearch(date);
    } catch (error) {
        console.error('Error fetching image for the selected date:', error);
    }
}


function displayImageData(data, date, title) {
    const currentImageContainer = document.getElementById('current-image-container');
    currentImageContainer.innerHTML = `
        <h2>${title}</h2>
        <img src="${data.url}" alt="${data.title}">
        <h3>${data.title}</h3>
        <p>${data.explanation}</p>
    `;
}

function saveSearch(date) {
    const searches = getSearchesFromLocalStorage();
    searches.push(date);
    localStorage.setItem('searches', JSON.stringify(searches));
    addSearchToHistory(date);
}

function getSearchesFromLocalStorage() {
    const searches = JSON.parse(localStorage.getItem('searches')) || [];
    return searches;
}

function addSearchToHistory(date) {
    const searchHistory = document.getElementById('search-history');
    const searchItem = document.createElement('a');
    searchItem.href = '#';
    searchItem.textContent = date;
    searchItem.addEventListener('click', (e) => {
        e.preventDefault();
        getImageOfTheDay(date);
    });
    const listItem = document.createElement('li');
    listItem.appendChild(searchItem);
    searchHistory.appendChild(listItem);
}

function loadSearchHistory() {
    const searches = getSearchesFromLocalStorage();
    searches.forEach((date) => addSearchToHistory(date));
}
