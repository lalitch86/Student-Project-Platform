

// index manu
// Define the number of records to display per page
const recordsPerPage = 10;

// Variable to track the current page
let currentPage = 1;

document.addEventListener('DOMContentLoaded', function () {
  fetchAndRenderProjects();

  // Event listener for next and previous buttons
  document.getElementById('next-btn').addEventListener('click', () => {
    currentPage++;
    fetchAndRenderProjects();
  });

  document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchAndRenderProjects();
    }
  });
});

function fetchAndRenderProjects() {
  fetch(`/api/projects?page=${currentPage}&perPage=${recordsPerPage}`)
    .then(response => response.json())
    .then(projects => renderProjects(projects))
    .catch(error => console.error('Error fetching projects:', error));
}

function renderProjects(projects) {
  const projectsList = document.getElementById('projects-list');
  projectsList.innerHTML = ''; // Clear existing projects

  projects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.classList.add('card', 'project-card');

    projectCard.innerHTML = `
      <h2 class="card-title">${project.title}</h2>
      <p class="card-text">Project ID : ${project.mp_id}</p>
      <p class="card-text">${project.short_description}</p>
      <p class="card-text">Category: ${project.category}</p>
      <p class="card-text">Technologies Used: ${project.technologies_used}</p>
      <p class="card-text">Year: ${project.year}</p>
      <p class="card-text"><button class="btn btn-primary" onclick="viewProject(${project.mp_id})">Click Hare for Mare Details</button></p>
    `;

    projectsList.appendChild(projectCard);
  });

  // Update pagination numbering in the footer
  updatePaginationNumbering();
}

function updatePaginationNumbering() {
  const pageNumberContainer = document.getElementById('page-number');
  pageNumberContainer.textContent = `Page ${currentPage}`;
}

function viewProject(projectId) {
  window.location.href = `projectDetails.html?id=${projectId}`;
}
function fetchAndRenderProjects() {
  fetch(`/api/projects?page=${currentPage}&perPage=${recordsPerPage}`)
    .then(response => response.json())
    .then(projects => renderProjects(projects))
    .catch(error => console.error('Error fetching projects:', error));
}


  //search

  document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', handleSearch);
  });
  
  function handleSearch(event) {
    event.preventDefault();
  
    const searchInput = document.getElementById('search-input').value.trim();
  
    fetch(`/api/search?query=${encodeURIComponent(searchInput)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(projects => {
        if (!Array.isArray(projects)) {
          throw new Error('Projects data is not an array');
        }
        renderProjects(projects);
      })
      .catch(error => console.error('Error searching projects:', error));
  }
  

// ... (remaining code)
// JavaScript: Dynamically show/hide button based on scroll position
document.addEventListener('DOMContentLoaded', function () {
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');

  // Show button when user scrolls to the bottom
  window.addEventListener('scroll', function () {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      scrollToTopBtn.style.display = 'block';
    } else {
      scrollToTopBtn.style.display = 'none';
    }
  });

  // Scroll to top when button is clicked
  scrollToTopBtn.addEventListener('click', function () {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  });
});


