const apiBaseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com";

// redirect if not logged in, if logged in, fetch posts
document.addEventListener('DOMContentLoaded', function() {
    if (!isLoggedIn()) {
        window.location.href = '../index.html';  
    } else {
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

// function to generate post divs to be displayed on the page
function displayPosts(posts) {
    const postContainer = document.getElementById('postContainer');

    posts.forEach(post => {
        const postElement = createPostElement(post);
        postContainer.appendChild(postElement);
    });
}

// function to construct post divs
function createPostElement(post) {
    const postCard = document.createElement('div');
    postCard.classList.add('col-md-8', 'offset-md-2', 'mb-4', 'card', 'post-card');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const postAuthor = document.createElement('h5'); // Change to h5 for bigger username
    postAuthor.classList.add('card-title', 'post-author');
    postAuthor.textContent = post.username;

    const postDate = document.createElement('p');
    postDate.classList.add('card-text', 'post-date');
    postDate.textContent = `Posted on: ${new Date(post.createdAt).toLocaleDateString()}`;

    const postText = document.createElement('p');
    postText.classList.add('card-text', 'post-body');
    postText.textContent = post.text;

    cardBody.appendChild(postAuthor);
    cardBody.appendChild(postDate);
    cardBody.appendChild(postText);

    postCard.appendChild(cardBody);

    return postCard;
}

// Bootstrap JS and dependencies (moved to the bottom of the body for faster rendering)
document.body.onload = function () {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
    script.integrity = "sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz";
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);
}
