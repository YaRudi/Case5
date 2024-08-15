// Данные о пользователях и путешествиях (хранение в памяти браузера)
let users = [];
let travels = [];

// Функция инициализации приложения
function initApp() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        showLoggedInNav(currentUser);
        showMyTravels(currentUser.username);
    } else {
        showLoggedOutNav();
        showLoginForm();
    }
}

// Функция отображения навигации для авторизованного пользователя
function showLoggedInNav(currentUser) {
    const navbar = document.getElementById('navbar');
    navbar.innerHTML = `
        <ul>
            <li><a href="#" onclick="showMyTravels('${currentUser.username}')">My Travels</a></li>
            <li><a href="#" onclick="showAddTravelForm()">Add Travel</a></li>
            <li><a href="#" onclick="showAllTravels()">All Travels</a></li>
            <li><a href="#" onclick="logout()">Logout</a></li>
        </ul>
    `;
}

// Функция отображения навигации для неавторизованного пользователя
function showLoggedOutNav() {
    const navbar = document.getElementById('navbar');
    navbar.innerHTML = `
        <ul>
            <li><a href="#" onclick="showLoginForm()">Login</a></li>
            <li><a href="#" onclick="showRegisterForm()">Register</a></li>
        </ul>
    `;
}

// Функция отображения формы входа
function showLoginForm() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <div class="form-container">
            <h2>Login</h2>
            <form onsubmit="login(event)">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required><br>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required><br>
                <button type="submit">Login</button>
            </form>
        </div>
    `;
}

// Функция отображения формы регистрации
function showRegisterForm() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <div class="form-container">
            <h2>Register</h2>
            <form onsubmit="register(event)">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required><br>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required><br>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required><br>
                <button type="submit">Register</button>
            </form>
        </div>
    `;
}

// Функция для авторизации пользователя
function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const foundUser = users.find(user => user.username === username && user.password === password);
    if (foundUser) {
        localStorage.setItem('currentUser', JSON.stringify({ username: foundUser.username }));
        initApp();
    } else {
        alert('Invalid username or password');
    }
}

// Функция для регистрации пользователя
function register(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (users.some(user => user.username === username)) {
        alert('Username already exists');
        return;
    }

    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    showLoginForm();
    alert('Registration successful. Please login.');
}

// Функция для выхода из учетной записи
function logout() {
    localStorage.removeItem('currentUser');
    initApp();
}

// Функция отображения записей о путешествиях пользователя
function showMyTravels(username) {
    const currentUserTravels = travels.filter(travel => travel.username === username);
    showTravels(currentUserTravels);
}

// Функция отображения всех записей о путешествиях
function showAllTravels() {
    showTravels(travels);
}

// Функция отображения записей о путешествиях
function showTravels(travelsData) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '';

    travelsData.forEach(travel => {
        const travelDiv = document.createElement('div');
        travelDiv.classList.add('travel-item');
        travelDiv.innerHTML = `
            <h3>${travel.location}</h3>
            <p><strong>Cost:</strong> $${travel.cost}</p>
            <p><strong>Places Visited:</strong> ${travel.placesVisited.join(', ')}</p>
            <p><strong>Rating:</strong> ${travel.rating}</p>
            <p><strong>Location:</strong> ${travel.locationCoordinates}</p>
            <img src="${travel.image}" alt="Travel Image" style="max-width: 100%;"><br>
        `;
        contentDiv.appendChild(travelDiv);
    });
}

// Функция добавления нового путешествия
function addTravel(event) {
    event.preventDefault();
    const location = document.getElementById('location').value;
    const cost = parseFloat(document.getElementById('cost').value);
    const placesVisited = document.getElementById('placesVisited').value.split(',').map(place => place.trim());
    const rating = parseInt(document.getElementById('rating').value);
    const locationCoordinates = document.getElementById('locationCoordinates').value;
    const image = document.getElementById('image').value;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const newTravel = {
        id: travels.length + 1,
        username: currentUser.username,
        location: location,
        cost: cost,
        placesVisited: placesVisited,
        rating: rating,
        locationCoordinates: locationCoordinates,
        image: image
    };

    travels.push(newTravel);
    showMyTravels(currentUser.username);
}

// Функция отображения формы добавления путешествия
function showAddTravelForm() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <div class="form-container">
            <h2>Add New Travel</h2>
            <form onsubmit="addTravel(event)">
                <label for="location">Location:</label>
                <input type="text" id="location" name="location" required><br>

                <label for="cost">Cost ($):</label>
                <input type="number" id="cost" name="cost" min="0" step="0.01" required><br>

                <label for="placesVisited">Places Visited (comma-separated):</label>
                <input type="text" id="placesVisited" name="placesVisited" required><br>

                <label for="rating">Rating (1-5):</label>
                <input type="number" id="rating" name="rating" min="1" max="5" required><br>

                <label for="locationCoordinates">Location Coordinates:</label>
                <input type="text" id="locationCoordinates" name="locationCoordinates"><br>

                <label for="image">Image URL:</label>
                <input type="text" id="image" name="image"><br>

                <button type="submit">Add Travel</button>
            </form>
        </div>
    `;
}

// Инициализация приложения при загрузке страницы
window.onload = initApp;
