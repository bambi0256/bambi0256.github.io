// recent-posts.js - Display recent posts on the main page

async function loadRecentPosts() {
    try {
        // Load projects metadata
        const response = await fetch('/assets/js/projects-metadata.json');
        const projectsData = await response.json();

        // Collect all posts from all projects
        const allPosts = [];
        projectsData.forEach(project => {
            if (project.posts && Array.isArray(project.posts)) {
                project.posts.forEach(post => {
                    allPosts.push({
                        ...post,
                        projectSlug: project.config.slug,
                        projectTitle: project.config.title
                    });
                });
            }
        });

        // Sort by date (newest first)
        allPosts.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA; // Descending order
        });

        // Take the 3 most recent posts
        const recentPosts = allPosts.slice(0, 3);

        // Display the posts
        displayRecentPosts(recentPosts);

    } catch (error) {
        console.error('Error loading recent posts:', error);
    }
}

function displayRecentPosts(posts) {
    const postGrid = document.querySelector('.post-grid');

    if (!postGrid) {
        console.error('Post grid container not found');
        return;
    }

    // Clear existing content
    postGrid.innerHTML = '';

    if (posts.length === 0) {
        postGrid.innerHTML = '<p class="no-posts">아직 포스트가 없습니다.</p>';
        return;
    }

    // Create post cards
    posts.forEach(post => {
        const postCard = createPostCard(post);
        postGrid.appendChild(postCard);
    });
}

function createPostCard(post) {
    const card = document.createElement('article');
    card.className = 'post-card';

    // Create post URL
    const postUrl = `/projects/${post.projectSlug}/${post.slug}/`;

    card.innerHTML = `
        <a href="${postUrl}" class="post-link" style="display: block; height: 100%; text-decoration: none;">
            <img src="${post.main_image || '/assets/image/default-post-image.jpg'}" alt="${post.title}">
            <div class="card-text">${post.title}</div>
        </a>
    `;

    return card;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}

// Load recent posts when DOM is ready
document.addEventListener('DOMContentLoaded', loadRecentPosts);
