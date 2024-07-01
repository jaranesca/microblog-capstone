const apiBaseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com";


// function to sign up the user and create new profile via the api
async function signup(event) {
    event.preventDefault();

    const form = document.getElementById('signupForm');
    const formData = new FormData(form);

    // Convert FormData to JSON
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    console.log('Data to be sent:', data);  // Debugging line to check data

    const options = { 
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    };

    try {
        const response = await fetch(apiBaseURL + "/api/users", options);
        const responseData = await response.json();

        if (!response.ok) {
            console.error('Response data:', responseData);  // Log the response data
            throw new Error('Network response was not ok: ' + responseData.message);
        }

        alert('Signup success! Please login with your credentials.');  // Debugging line to check response data
        window.localStorage.setItem("login-data", JSON.stringify(responseData));
        window.location.assign("../posts/posts.html");  // redirect

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        alert('Signup failed: ' + error.message);
    }
}


// function to get login data
function getLoginData() {
    const loginJSON = window.localStorage.getItem("login-data");
    return loginJSON ? JSON.parse(loginJSON) : {};
}


