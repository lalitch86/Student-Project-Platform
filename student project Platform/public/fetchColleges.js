document.addEventListener('DOMContentLoaded', function () {
    fetch('/colleges') // Assuming you have a route '/colleges' to fetch colleges from the server
        .then(response => response.json())
        .then(data => {
            const collegeList = document.getElementById('college-list');
            data.forEach(college => {
                const collegeName = document.createElement('p');
                collegeName.textContent = college.name; // Assuming college objects have a 'name' property
                collegeList.appendChild(collegeName);
            });
        })
        .catch(error => console.error('Error fetching colleges:', error));
  });