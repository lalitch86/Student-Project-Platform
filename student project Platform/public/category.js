// Function to fetch categories from the server
async function fetchCategories() {
    try {
        const response = await fetch('/categories');
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

// Function to display categories on the webpage
async function displayCategories() {
    const categories = await fetchCategories();
    const categoriesList = document.getElementById('categories-list');
    categoriesList.innerHTML = '';

    categories.forEach(category => {
        const listItem = document.createElement('li');
        listItem.textContent = category;
        categoriesList.appendChild(listItem);
    });
}

// Execute the displayCategories function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', displayCategories);
