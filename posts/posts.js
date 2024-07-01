const apiBaseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com";


// redirect if not logged in, if logged in, fetch posts
document.addEventListener('DOMContentLoaded', function() {
    if (!isLoggedIn()) {
        
        window.location.href = '../index.html';  
    }
    else {
        fetchPosts();
    }
    
    
});

// function to check if user logged in
function isLoggedIn () {
    const loginData = getLoginData();
    return Boolean(loginData.token);
}

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

// function to get login data
function getLoginData() {
    const loginJSON = window.localStorage.getItem("login-data");
    return loginJSON ? JSON.parse(loginJSON) : {};
}


// function to fetch posts from microbloglite api
async function fetchPosts() {


    const options = { 
        method: "GET",
        headers: {
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${getLoginData().token}`,
        },
    };

    try {
        const url = new URL(apiBaseURL + "/api/posts");
        url.searchParams.append("limit", 5);

        const response = await fetch(url.toString(), options);
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        const posts = await response.json();
        displayPosts(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        alert('Failed to fetch posts. Please try again later.');
    }
}

//function to generate post divs to be displayed on the page
function displayPosts(posts) {
    const postContainer = document.getElementById('postContainer');

    posts.forEach(post => {
        const postElement = createPostElement(post);
        postContainer.appendChild(postElement);
    });
}

// function to construct post divs
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.classList.add('col-md-8', 'offset-md-2', 'mb-4');

    

    const postBody = document.createElement('p');
    postBody.classList.add('post-body');
    postBody.textContent = post.text;

    const postAuthor = document.createElement('p');
    postAuthor.classList.add('post-author');
    postAuthor.textContent = `Author: ${post.username}`;

    const postDate = document.createElement('p');
    postDate.classList.add('post-date');
    postDate.textContent = `Posted on: ${new Date(post.createdAt).toLocaleDateString()}`;

    postDiv.appendChild(postBody);
    postDiv.appendChild(postAuthor);
    postDiv.appendChild(postDate);

    return postDiv;
}