// Open (or create) the database
const request = indexedDB.open("User AccountsDB", 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    // Create an object store for user accounts
    const objectStore = db.createObjectStore("accounts", { keyPath: "username" });
};

request.onsuccess = function(event) {
    const db = event.target.result;

    document.getElementById('login-button').addEventListener('click', function() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const transaction = db.transaction(["accounts"], "readonly");
        const objectStore = transaction.objectStore("accounts");
        const request = objectStore.get(username);

        request.onsuccess = function(event) {
            const account = event.target.result;
            if (account && account.password === password) {
                alert("Login successful!");
                window.location.href = "./main/index.html"; // Redirect to the main page
            } else {
                alert("Invalid username or password.");
            }
        };
    });

    document.getElementById('register-button').addEventListener('click', function() {
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        const transaction = db.transaction(["accounts"], "readwrite");
        const objectStore = transaction.objectStore("accounts");
        const request = objectStore.get(username);

        request.onsuccess = function(event) {
            const account = event.target.result;
            if (account) {
                alert("Username already exists. Please choose another.");
            } else {
                // Add the new account to the object store
                objectStore.add({ username: username, password: password });
                alert("Account created successfully! You can now log in.");
                document.getElementById('register-form').style.display = 'none';
                document.getElementById('login-form').style.display = 'block';
            }
        };
    });

    document.getElementById('show-register').addEventListener('click', function() {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
    });

    document.getElementById('show-login').addEventListener('click', function() {
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    });
};

request.onerror = function(event) {
    console.error("Database error: " + event.target.errorCode);
};