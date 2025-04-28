let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
let currentIngredients = [];
let selectedCategory = 'all';

// Initialize the app
function init() {
    renderRecipes();
}

// Add ingredient to current recipe
function addIngredient() {
    const ingredientInput = document.getElementById('ingredient');
    const ingredient = ingredientInput.value.trim();
    
    if (ingredient) {
        currentIngredients.push(ingredient);
        ingredientInput.value = '';
        renderIngredients();
    }
}

// Render ingredients list in form
function renderIngredients() {
    const ingredientsList = document.getElementById('ingredientsList');
    ingredientsList.innerHTML = currentIngredients.map((ingredient, index) => `
        <li>
            ${ingredient}
            <button class="delete-btn" onclick="removeIngredient(${index})">×</button>
        </li>
    `).join('');
}

// Remove ingredient from current recipe
function removeIngredient(index) {
    currentIngredients.splice(index, 1);
    renderIngredients();
}

// Handle form submission
document.getElementById('recipeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const recipe = {
        id: Date.now(),
        name: document.getElementById('recipeName').value.trim(),
        ingredients: [...currentIngredients],
        instructions: document.getElementById('instructions').value.trim()
    };

    if (recipe.name && recipe.ingredients.length > 0 && recipe.instructions) {
        recipes.push(recipe);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        resetForm();
        renderRecipes();
    }
});

// Reset form
function resetForm() {
    document.getElementById('recipeForm').reset();
    currentIngredients = [];
    renderIngredients();
}

// Render all recipes
function renderRecipes() {
    const container = document.getElementById('recipesContainer');
    container.innerHTML = recipes.map(recipe => `
        <div class="recipe-card">
            <h3>${recipe.name}</h3>
            <h4>Ingredients:</h4>
            <ul class="ingredient-list">
                ${recipe.ingredients.map(ingredient => `
                    <li>${ingredient}</li>
                `).join('')}
            </ul>
            <h4>Instructions:</h4>
            <p>${recipe.instructions.replace(/\n/g, '<br>')}</p>
            <button class="delete-btn" onclick="deleteRecipe(${recipe.id})">Delete Recipe</button>
        </div>
    `).join('');
}

// Delete recipe
function deleteRecipe(id) {
    recipes = recipes.filter(recipe => recipe.id !== id);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    renderRecipes();
}


// Initialize the app
function init() {
    renderCategories();
    renderRecipes();
    document.getElementById('categoryFilter').addEventListener('click', handleCategoryFilter);
}

// Add category to recipe object
function addCategoryToRecipe(recipe) {
    if (!recipe.category) {
        recipe.category = 'Uncategorized';
    }
    return recipe;
}

// Render category filter buttons
function renderCategories() {
    const categories = ['all', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 'Other'];
    const filterContainer = document.getElementById('categoryFilter');
    
    filterContainer.innerHTML = categories.map(category => `
        <button class="${selectedCategory === category ? 'active' : ''}" 
                data-category="${category}">
            ${category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
    `).join('');
}

// Handle category filtering
function handleCategoryFilter(e) {
    if (e.target.tagName === 'BUTTON') {
        selectedCategory = e.target.dataset.category;
        document.querySelectorAll('#categoryFilter button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === selectedCategory);
        });
        renderRecipes();
    }
}

// Modified form submission handler
document.getElementById('recipeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const recipe = {
        id: Date.now(),
        name: document.getElementById('recipeName').value.trim(),
        ingredients: [...currentIngredients],
        instructions: document.getElementById('instructions').value.trim(),
        category: document.getElementById('category').value
    };

    if (recipe.name && recipe.ingredients.length > 0 && recipe.instructions && recipe.category) {
        recipes.push(recipe);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        resetForm();
        renderCategories();
        renderRecipes();
    }
});

// Modified recipe rendering
function renderRecipes() {
    const container = document.getElementById('recipesContainer');
    const filteredRecipes = selectedCategory === 'all' 
        ? recipes 
        : recipes.filter(recipe => recipe.category === selectedCategory);
    
    // Group by category
    const grouped = filteredRecipes.reduce((acc, recipe) => {
        const category = recipe.category || 'Uncategorized';
        if (!acc[category]) acc[category] = [];
        acc[category].push(recipe);
        return acc;
    }, {});

    container.innerHTML = Object.entries(grouped).map(([category, recipes]) => `
        <h3 class="category-header">${category}</h3>
        <div class="recipes-group">
            ${recipes.map(recipe => `
                <div class="recipe-card">
                    <h3>${recipe.name}</h3>
                    <div class="category-badge">${recipe.category}</div>
                    <h4>Ingredients:</h4>
                    <ul class="ingredient-list">
                        ${recipe.ingredients.map(ingredient => `
                            <li>${ingredient}</li>
                        `).join('')}
                    </ul>
                    <h4>Instructions:</h4>
                    <p>${recipe.instructions.replace(/\n/g, '<br>')}</p>
                    <button class="delete-btn" onclick="deleteRecipe(${recipe.id})">Delete Recipe</button>
                </div>
            `).join('')}
        </div>
    `).join('');
}

// Add this to the HTML container div (after the h1):
<div id="categoryFilter" class="category-filter"></div>

// Initialize the app on load
init();