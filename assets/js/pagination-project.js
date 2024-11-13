document.addEventListener("DOMContentLoaded", function() {
    let currentPage = 1;
    const postsPerPage = 6;

    function loadProjectPosts(page) {
        fetch('/assets/js/project-posts.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Loaded project posts data:', data);
                
                // Update Project Page
                const projectGrid = document.querySelector("#project-posts-container");
                if (projectGrid) {
                    projectGrid.innerHTML = ''; // Clear existing content

                    const start = (page - 1) * postsPerPage;
                    const end = start + postsPerPage;
                    const pagePosts = data.slice(start, end);

                    pagePosts.forEach(post => {
                        const postCard = `
                            <div class="post-card">
                                <img src="${post.main_image}" alt="${post.title}">
                                <div class="post-info">
                                    <h3>${post.title}</h3>
                                    <p>${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</p>
                                </div>
                            </div>
                        `;
                        projectGrid.innerHTML += postCard;
                    });

                    // Update pagination buttons
                    const totalPages = Math.ceil(data.length / postsPerPage);
                    document.querySelector("#pagination-controls").innerHTML = `
                        <button ${page <= 1 ? "disabled" : ""} onclick="loadProjectPosts(${page - 1})">Previous</button>
                        <span>Page ${page} of ${totalPages}</span>
                        <button ${page >= totalPages ? "disabled" : ""} onclick="loadProjectPosts(${page + 1})">Next</button>
                    `;
                }

                // Update Home Page Latest Work Section
                const homeLatestWorks = document.querySelector("#latest-work-posts-container");
                if (homeLatestWorks) {
                    homeLatestWorks.innerHTML = ''; // Clear existing content
                    const latestWorks = data.slice(0, 3); // Show latest 3 posts

                    latestWorks.forEach(post => {
                        const postCard = `
                            <div class="post-card">
                                <img src="${post.main_image}" alt="${post.title}">
                                <div class="post-info">
                                    <h3>${post.title}</h3>
                                    <p>${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</p>
                                </div>
                            </div>
                        `;
                        homeLatestWorks.innerHTML += postCard;
                    });
                }
            })
            .catch(error => {
                console.error('Error loading project posts:', error);
            });
    }

    loadProjectPosts(currentPage);
});
