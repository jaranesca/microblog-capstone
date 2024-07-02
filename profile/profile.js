"use strict";

const apiBaseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com";

// function to get login data
function getLoginData() {
    const loginJSON = window.localStorage.getItem("login-data");
    return loginJSON ? JSON.parse(loginJSON) : {};
}

// function to check if user logged in
function isLoggedIn () {
    const loginData = getLoginData();
    return Boolean(loginData.token);
}

// redirect if not logged in, else listen for form submission event
document.addEventListener('DOMContentLoaded', function() {
    if (!isLoggedIn()) {
        window.location.assign("../index.html");
    }

    const loginData = getLoginData();
    const userName = loginData.username;
    document.querySelector('.profile-greeting h1').textContent = `Welcome, ${userName}!`;

    const createPostForm = document.getElementById('createPostForm');
    createPostForm.addEventListener('submit', function(event) {
        event.preventDefault();
        createPost();
    });
});

// function to log out
function logout () {
    const loginData = getLoginData();

     const options = { 
        method: "GET",
        headers: { 
            Authorization: `Bearer ${loginData.token}`,
        },
    };

    fetch(apiBaseURL + "/auth/logout", options)
        .then(response => response.json())
        .then(data => console.log(data))
        .finally(() => {
            
            window.localStorage.removeItem("login-data");  // remove login data from LocalStorage
            window.location.assign("../index.html");  // redirect back to landing page
        });
}

async function createPost() {
    const postContent = document.getElementById('postContent').value;

    if (postContent.length > 280) {
        alert("Post exceeds 280 characters!");
        return;
    }
    
    const data = {
        "text": postContent,
        
    };

    const options = { 
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getLoginData().token}`
        },
        body: JSON.stringify(data),
    };

    try {
        const response = await fetch(apiBaseURL + "/api/posts", options);
        const responseData = await response.json();

        if (!response.ok) {
            console.error('Post creation failed:', responseData);
            alert(responseData.message || 'Post creation failed, please try again.');
            return;
        }

        console.log('Post creation success:', responseData);
        alert("Post created!");
        
        document.getElementById('createPostForm').reset();
        const createPostModal = new bootstrap.Modal(document.getElementById('createPostModal'));
        createPostModal.hide();
        
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        alert('An error occurred during post creation, please try again.');
    }
}
