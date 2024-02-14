// projectDetails.js
document.addEventListener('DOMContentLoaded', function () {
  // Fetch project details and render on the page
  const projectId = getProjectIdFromUrl();
  if (projectId) {
    fetchProjectDetails(projectId);
  } else {
    console.error('Invalid project ID.');
  }
});

function getProjectIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

function fetchProjectDetails(projectId) {
  fetch(`/api/projects/${projectId}`)
    .then(response => response.json())
    .then(project => renderProjectDetails(project))
    .catch(error => console.error('Error fetching project details:', error));
}

function renderProjectDetails(project) {
  const projectDetailsContainer = document.getElementById('project-details');

  const projectCard = document.createElement('div');
  projectCard.classList.add('card', 'project-card');

  projectCard.innerHTML = `
  <center><h1 class="card-title" style="margin-top: 20px;">${project.title}</h1></center>
  <br><center>${project.youtube_link}</center>
    <br>< br><p class="card-text">Category: <span style="color: #ffb997;">${project.category}</span></p>
    <p class="card-text">Technologies Used: <span style="color: #ffcc5c;">${project.technologies_used}</span></p>
    <p class="card-text">${project.short_description}</p>
    <p class="card-text">${project.description}</p>
    <p class="card-text">Future Scope:<br><span style="color: #f7f4ea;">${project.futurescope}</span></p>
    <p class="card-text">Download Link: <a href="${project.github_link}" target="_blank" style="color: #a5a58d;">${project.github_link}</a></p>
    <p>Project By :</p>
    <p class="card-text">College: <span style="color: #73877b;">${project.college}</span>      University: <span style="color: #709fb0;">${project.universecity}</span></p>
    <p class="card-text">Students: <span style="color: #a5a58d;">${project.student_names}</span>      Class: <span style="color: #f7f4ea;">${project.className}</span></p>
    <p class="card-text">Semester: <span style="color: #ffcc5c;">${project.sem}</span>      Year: <span style="color: #ffb997;">${project.year}</span></p>
`;
projectCard.addEventListener('mouseover', () => {
  projectCard.style.backgroundColor = '#444';
  projectCard.style.transition = 'background-color 0.3s';
});

projectCard.addEventListener('mouseout', () => {
  projectCard.style.backgroundColor = '#333';
  projectCard.style.transition = 'background-color 0.3s';
});

  projectDetailsContainer.appendChild(projectCard);
}
