document.addEventListener('DOMContentLoaded', function() {
    var logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior

            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/logout', true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        window.location.href = '/index'; // Redirect to login page upon successful logout
                    } else {
                        console.error('Logout failed. Status code: ' + xhr.status);
                    }
                }
            };
            xhr.onerror = function() {
                console.error('Network error occurred');
            };
            xhr.send();
        });
    }
});
// Get references to the button and options container
const addMiniprojectBtn = document.getElementById('addMiniprojectBtn');
const miniprojectOptions = document.getElementById('miniprojectOptions');

// Define the HTML content for uploading an Excel file
const uploadFormHTML = `
    <h3>Upload Excel File</h3>
    <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="excelFile" accept=".xlsx, .xls">
        <button type="submit">Upload</button>
    </form>
`;

// Add click event listener to the button
addMiniprojectBtn.addEventListener('click', () => {
    // Toggle the visibility of the options container
    if (miniprojectOptions.style.display === 'none') {
        miniprojectOptions.style.display = 'block';
        // Insert the upload form HTML content into the options container
        miniprojectOptions.innerHTML = uploadFormHTML;
    } else {
        miniprojectOptions.style.display = 'none';
        // Clear the options content when hiding the container
        miniprojectOptions.innerHTML = '';
    }
});


 //search

 const recordsPerPage = 2;

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
       <p class="card-text">${project.mp_id}</p>
       <p class="card-text">${project.short_description}</p>
       <p class="card-text">Category: ${project.category}</p>
       <p class="card-text">Technologies Used: ${project.technologies_used}</p>
       <p class="card-text">Year: ${project.year}</p>
       <p class="card-text"><button class="btn btn-primary" onclick="viewProject(${project.mp_id})">View</button></p>
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