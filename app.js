let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
let currentIngredients = [];

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

// Initialize the app on load
init();