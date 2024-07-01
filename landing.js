const apiBaseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com";

document.addEventListener('DOMContentLoaded', function() {
    if (isLoggedIn()) {
        window.location.assign("./posts/posts.html");  
    }     
});

async function login(event) {
    event.preventDefault();

    const form = document.getElementById('loginForm');
    const formData = new FormData(form);

    // Convert FormData to JSON
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    console.log('Data to be sent:', data);

    const options = { 
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    try {
        const response = await fetch(apiBaseURL + "/auth/login", options);
        const responseData = await response.json();

        if (!response.ok) {
            console.error('Login failed:', responseData);
            alert(responseData.message || 'Login failed, please try again.');
            return;
        }

        console.log('Login success:', responseData);
        window.localStorage.setItem("login-data", JSON.stringify(responseData));
        
        window.location.assign("./profile/profile.html");  

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        alert('An error occurred during login, please try again.');
    }
}

function getLoginData() {
    const loginJSON = window.localStorage.getItem("login-data");
    return loginJSON ? JSON.parse(loginJSON) : {};
}

function isLoggedIn () {
    const loginData = getLoginData();
    return Boolean(loginData.token);
}
