
import { useMemo, useState } from "react";
import "./App.css";

const recipes = [
  { id: 1, title: "Smoky chickpea stew", author: "Meera P.", rating: 4.8, reviews: 212, time: 35, diet: "Vegan", cuisine: "Indian", color: "peach", tags: ["comfort", "stew"] },
  { id: 2, title: "Lemon herb gnocchi", author: "Luca B.", rating: 4.6, reviews: 98, time: 30, diet: "Veg", cuisine: "Italian", color: "sage", tags: ["pasta", "lemon"] },
  { id: 3, title: "Coconut dal with greens", author: "Anika K.", rating: 4.9, reviews: 340, time: 40, diet: "Vegan", cuisine: "Indian", color: "gold", tags: ["dal", "coconut"] },
  { id: 4, title: "Charred corn tacos", author: "Diego R.", rating: 4.5, reviews: 76, time: 25, diet: "Vegan", cuisine: "Mexican", color: "sage", tags: ["corn", "tacos"] },
  { id: 5, title: "Miso sesame noodles", author: "Hana T.", rating: 4.7, reviews: 154, time: 20, diet: "Vegan", cuisine: "Thai", color: "sage", tags: ["noodles", "sesame"] },
  { id: 6, title: "Roasted tomato soup", author: "Sam W.", rating: 4.4, reviews: 61, time: 45, diet: "Vegan", cuisine: "Italian", color: "peach", tags: ["tomato", "soup"] },
  { id: 7, title: "Thai basil tofu", author: "Nok S.", rating: 4.7, reviews: 129, time: 25, diet: "Vegan", cuisine: "Thai", color: "gold", tags: ["tofu", "basil"] },
  { id: 8, title: "Zucchini fritters", author: "Eli M.", rating: 4.3, reviews: 44, time: 30, diet: "Veg", cuisine: "Italian", color: "peach", tags: ["zucchini", "quick"] },
  { id: 9, title: "Creamy mushroom pasta", author: "Luca B.", rating: 4.8, reviews: 183, time: 35, diet: "Veg", cuisine: "Italian", color: "gold", tags: ["pasta", "mushroom"] },
  { id: 10, title: "Green goddess bowl", author: "Meera P.", rating: 4.6, reviews: 87, time: 15, diet: "Vegan", cuisine: "Indian", color: "sage", tags: ["salad", "greens"] },
  { id: 11, title: "Crispy tofu rice bowl", author: "Nok S.", rating: 4.9, reviews: 201, time: 30, diet: "Vegan", cuisine: "Thai", color: "peach", tags: ["tofu", "rice"] },
  { id: 12, title: "Roasted pepper tacos", author: "Diego R.", rating: 4.5, reviews: 69, time: 25, diet: "Vegan", cuisine: "Mexican", color: "gold", tags: ["pepper", "tacos"] },
];

const cuisines = ["All", "Italian", "Indian", "Mexican", "Thai"];
const diets = ["All", "Veg", "Vegan", "Keto"];
const times = [
  { label: "Any", value: 999 },
  { label: "Under 20 min", value: 20 },
  { label: "Under 45 min", value: 45 },
];
const difficulties = ["All", "Easy", "Medium", "Hard"];

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div className="filter-group">
      <span className="filter-label">{label}</span>
      <div className="filter-options">
        {options.map((option) => {
          const selected = typeof option === "string"
            ? value === option
            : value === option.value;

          return (
            <button
              key={typeof option === "string" ? option : option.label}
              className={`filter-chip ${selected ? "selected" : ""}`}
              onClick={() =>
                onChange(typeof option === "string" ? option : option.value)
              }
            >
              {typeof option === "string" ? option : option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RecipeCard({ recipe, onSelect, saved, onSave }) {
  return (
    <article className="recipe-card">
      <button
        className={`recipe-cover cover-${recipe.color}`}
        onClick={() => onSelect(recipe)}
        aria-label={`View ${recipe.title}`}
      >
        <span className="cover-caption">Recipe · {recipe.title}</span>
        <span className="cover-emoji" aria-hidden="true">
          {recipe.cuisine === "Italian" ? "🍝" :
           recipe.cuisine === "Indian" ? "🍲" :
           recipe.cuisine === "Mexican" ? "🌮" : "🥢"}
        </span>
      </button>

      <div className="recipe-info">
        <div className="recipe-title-row">
          <button className="recipe-title" onClick={() => onSelect(recipe)}>
            {recipe.title}
          </button>
          <button
            className={`save-icon ${saved ? "is-saved" : ""}`}
            onClick={() => onSave(recipe.id)}
            aria-label={saved ? "Remove from saved recipes" : "Save recipe"}
            title={saved ? "Saved" : "Save recipe"}
          >
            {saved ? "♥" : "♡"}
          </button>
        </div>

        <p className="recipe-author">by {recipe.author}</p>

        <div className="recipe-meta">
          <span className="rating">★ {recipe.rating}</span>
          <span className="review-count">({recipe.reviews})</span>
          <span>{recipe.time} min</span>
          <span className="diet-badge">{recipe.diet}</span>
        </div>
      </div>
    </article>
  );
}

function RecipeDetails({ recipe, onBack, saved, onSave }) {
  const [servings, setServings] = useState(4);

  return (
    <main className="details-page">
      <button className="back-button" onClick={onBack}>← Back to Browse</button>

      <section className="details-hero">
        <div className={`details-cover cover-${recipe.color}`}>
          <span aria-hidden="true" className="details-emoji">
            {recipe.cuisine === "Italian" ? "🍝" :
             recipe.cuisine === "Indian" ? "🍲" :
             recipe.cuisine === "Mexican" ? "🌮" : "🥢"}
          </span>
        </div>

        <div className="details-summary">
          <div className="tag-row">
            <span className="diet-badge">{recipe.diet}</span>
            <span className="diet-badge">{recipe.cuisine}</span>
            <span className="diet-badge">Easy</span>
          </div>

          <h1>{recipe.title}</h1>
          <p className="recipe-author">Made by {recipe.author}</p>
          <p className="details-rating">
            ★ {recipe.rating} <span> {recipe.reviews} reviews</span>
          </p>

          <div className="stats-row">
            <div><small>Cook time</small><strong>{recipe.time} min</strong></div>
            <div><small>Servings</small><strong>{servings}</strong></div>
            <div><small>Difficulty</small><strong>Easy</strong></div>
          </div>

          <div className="details-actions">
            <button className="button button-green" onClick={() => onSave(recipe.id)}>
              {saved ? "♥ Saved" : "♡ Save recipe"}
            </button>
            <button className="button button-outline" onClick={() => window.alert("Like feature coming soon!")}>Like</button>
            <button className="button button-outline" onClick={() => navigator.clipboard?.writeText(window.location.href)}>Share</button>
          </div>

          <button className="button button-orange full-button" onClick={() => window.alert("Shopping lists will be added in a later step.")}>
            Add to shopping list
          </button>
        </div>
      </section>

      <section className="cooking-layout">
        <aside className="ingredients-panel">
          <h2>Ingredients</h2>
          <div className="servings-control">
            <span>Servings</span>
            <button onClick={() => setServings(s => Math.max(1, s - 1))}>−</button>
            <strong>{servings}</strong>
            <button onClick={() => setServings(s => Math.min(20, s + 1))}>+</button>
          </div>
          {[
            ["Red lentils", `${servings / 4} cup`],
            ["Coconut milk", `${servings * 100} ml`],
            ["Spinach", `${servings / 2} handfuls`],
            ["Garlic cloves", `${servings}`],
            ["Turmeric", `${servings / 4} tsp`],
          ].map(([name, amount]) => (
            <div className="ingredient-row" key={name}>
              <span>{name}</span><span>{amount}</span>
            </div>
          ))}
        </aside>

        <section className="method-panel">
          <h2>Method</h2>
          {[
            "Rinse the lentils and simmer with turmeric and water until soft.",
            "Fry garlic until golden, then stir in the coconut milk.",
            "Fold in the spinach, season, and serve hot.",
          ].map((step, index) => (
            <div className="method-step" key={step}>
              <span className="step-number">{index + 1}</span>
              <p>{step}</p>
              <div className={`step-photo cover-${["sage", "peach", "gold"][index]}`}>
                Step photo {index + 1}
              </div>
            </div>
          ))}
        </section>
      </section>

      <section className="reviews-section">
        <h2>Reviews</h2>
        <article className="review-card">
          <strong>★★★★★ Rohit S.</strong>
          <p>Rich and quick. Doubled the garlic and it was perfect.</p>
          <button className="button button-outline">Helpful · 24</button>
        </article>
        <article className="review-card">
          <strong>★★★★☆ Julia M.</strong>
          <p>Great base recipe. Needed a bit more salt.</p>
          <button className="button button-outline">Helpful · 9</button>
        </article>
      </section>
    </main>
  );
}

function PublishRecipe({ onBack }) {
  const [title, setTitle] = useState("");
  const [cuisine, setCuisine] = useState("Indian");
  const [diet, setDiet] = useState("Vegan");
  const [time, setTime] = useState(40);
  const [servings, setServings] = useState(4);
  const [ingredients, setIngredients] = useState([{ name: "", qty: "1", unit: "cup" }]);
  const [steps, setSteps] = useState([""]);
  const [cover, setCover] = useState("");

  function updateIngredient(index, key, value) {
    setIngredients(old => old.map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    ));
  }

  return (
    <main className="publish-page">
      <button className="back-button" onClick={onBack}>← Back to Browse</button>
      <h1>Publish a recipe</h1>

      <form className="publish-form" onSubmit={e => {
        e.preventDefault();
        window.alert("Your form is ready! Saving recipes to the database comes next.");
      }}>
        <section className="form-panel">
          <h2>Basics</h2>
          <label className="upload-area">
            {cover ? `Selected: ${cover}` : "＋ Choose a cover image"}
            <input type="file" accept="image/*" onChange={e => setCover(e.target.files?.[0]?.name || "")} />
          </label>

          <label className="field-label">Title
            <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Name your dish" />
          </label>

          <div className="form-grid">
            <label className="field-label">Cuisine
              <select value={cuisine} onChange={e => setCuisine(e.target.value)}>
                {cuisines.slice(1).map(x => <option key={x}>{x}</option>)}
              </select>
            </label>
            <label className="field-label">Diet
              <select value={diet} onChange={e => setDiet(e.target.value)}>
                {diets.slice(1).map(x => <option key={x}>{x}</option>)}
              </select>
            </label>
            <label className="field-label">Difficulty
              <select><option>Easy</option><option>Medium</option><option>Hard</option></select>
            </label>
            <label className="field-label">Cook time (min)
              <input type="number" min="1" value={time} onChange={e => setTime(e.target.value)} />
            </label>
            <label className="field-label">Servings
              <input type="number" min="1" value={servings} onChange={e => setServings(e.target.value)} />
            </label>
            <label className="field-label">Tags
              <input placeholder="dinner, comfort" />
            </label>
          </div>
        </section>

        <section className="form-panel">
          <h2>Ingredients</h2>
          {ingredients.map((item, i) => (
            <div className="ingredient-input-row" key={i}>
              <input aria-label="Ingredient name" placeholder="Ingredient" value={item.name} onChange={e => updateIngredient(i, "name", e.target.value)} />
              <input aria-label="Quantity" placeholder="Qty" value={item.qty} onChange={e => updateIngredient(i, "qty", e.target.value)} />
              <input aria-label="Unit" placeholder="Unit" value={item.unit} onChange={e => updateIngredient(i, "unit", e.target.value)} />
              <button type="button" className="remove-button" onClick={() => setIngredients(old => old.filter((_, j) => j !== i))}>×</button>
            </div>
          ))}
          <button type="button" className="button button-outline" onClick={() => setIngredients(old => [...old, { name: "", qty: "", unit: "" }])}>＋ Add ingredient</button>
        </section>

        <section className="form-panel">
          <h2>Steps</h2>
          {steps.map((step, i) => (
            <div className="step-input-row" key={i}>
              <span className="step-number">{i + 1}</span>
              <textarea required value={step} onChange={e => setSteps(old => old.map((s, j) => i === j ? e.target.value : s))} placeholder="Describe this step" />
            </div>
          ))}
          <button type="button" className="button button-outline" onClick={() => setSteps(old => [...old, ""])}>＋ Add step</button>
        </section>

        <div className="form-actions">
          <button className="button button-orange" type="submit">Publish recipe</button>
          <button className="button button-outline" type="button" onClick={() => window.alert("Draft saving will be connected to the backend later.")}>Save draft</button>
        </div>
      </form>
    </main>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("All");
  const [diet, setDiet] = useState("All");
  const [maxTime, setMaxTime] = useState(999);
  const [difficulty, setDifficulty] = useState("All");
  const [visibleCount, setVisibleCount] = useState(8);
  const [saved, setSaved] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [page, setPage] = useState("browse");

  const filteredRecipes = useMemo(() => recipes.filter(recipe => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query ||
      [recipe.title, recipe.author, recipe.cuisine, recipe.diet, ...recipe.tags]
        .some(text => text.toLowerCase().includes(query));

    return matchesSearch &&
      (cuisine === "All" || recipe.cuisine === cuisine) &&
      (diet === "All" || recipe.diet === diet) &&
      recipe.time <= maxTime &&
      (difficulty === "All" || difficulty === "Easy");
  }), [search, cuisine, diet, maxTime, difficulty]);

  function toggleSaved(id) {
    setSaved(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
  }

  function openRecipe(recipe) {
    setSelectedRecipe(recipe);
    setPage("details");
    window.scrollTo(0, 0);
  }

  function goBrowse() {
    setPage("browse");
    setSelectedRecipe(null);
    window.scrollTo(0, 0);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={goBrowse}>Forkful<span>.</span></button>
        <nav className="main-nav">
          <button className={page === "browse" ? "nav-active" : ""} onClick={goBrowse}>Browse</button>
          <button onClick={() => window.alert("Personalised feed coming soon!")}>Feed</button>
          <button onClick={() => window.alert(`You have ${saved.length} saved recipes.`)}>Collections</button>
          <button onClick={() => window.alert("Shopping lists coming soon!")}>Shopping list</button>
        </nav>
        <div className="header-actions">
          <button className="button button-orange publish-button" onClick={() => { setPage("publish"); window.scrollTo(0, 0); }}>Publish recipe</button>
          <button className="avatar" aria-label="User profile" onClick={() => window.alert("Profile coming soon!")}>AK</button>
        </div>
      </header>

      {page === "details" && selectedRecipe ? (
        <RecipeDetails recipe={selectedRecipe} onBack={goBrowse} saved={saved.includes(selectedRecipe.id)} onSave={toggleSaved} />
      ) : page === "publish" ? (
        <PublishRecipe onBack={goBrowse} />
      ) : (
        <main className="browse-page">
          <section className="welcome">
            <h1>Cook something worth sharing.</h1>
            <p>Discover your next favourite dish, shared by home cooks like you.</p>
            <form className="search-form" onSubmit={e => e.preventDefault()}>
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setVisibleCount(8); }}
                placeholder="Search title, ingredient or tag"
                aria-label="Search recipes"
              />
              <button className="button button-green" type="submit">Search</button>
            </form>
          </section>

          <section className="filters" aria-label="Recipe filters">
            <FilterGroup label="Cuisine" options={cuisines} value={cuisine} onChange={v => { setCuisine(v); setVisibleCount(8); }} />
            <FilterGroup label="Diet" options={diets} value={diet} onChange={v => { setDiet(v); setVisibleCount(8); }} />
            <FilterGroup label="Cook time" options={times} value={maxTime} onChange={v => { setMaxTime(v); setVisibleCount(8); }} />
            <FilterGroup label="Difficulty" options={difficulties} value={difficulty} onChange={v => { setDifficulty(v); setVisibleCount(8); }} />
          </section>

          <section className="community-section">
            <div className="section-heading">
              <div>
                <h2>Fresh from the community</h2>
                <p>Good food is even better when shared.</p>
              </div>
              <span className="results-label">
                Showing {filteredRecipes.length} recipes
              </span>
            </div>

            {filteredRecipes.length ? (
              <div className="recipe-grid">
                {filteredRecipes.slice(0, visibleCount).map(recipe => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onSelect={openRecipe}
                    saved={saved.includes(recipe.id)}
                    onSave={toggleSaved}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span>🥣</span>
                <h3>No recipes found just yet</h3>
                <p>Try another search or change your filters.</p>
                <button className="button button-outline" onClick={() => {
                  setSearch(""); setCuisine("All"); setDiet("All");
                  setMaxTime(999); setDifficulty("All");
                }}>Clear filters</button>
              </div>
            )}

            <div className="load-more-area">
              <p>Good things take time. Keep exploring.</p>
              {visibleCount < filteredRecipes.length && (
                <button className="button button-outline" onClick={() => setVisibleCount(n => n + 4)}>
                  Load more recipes
                </button>
              )}
            </div>
          </section>
        </main>
      )}

      <footer className="site-footer">
        <button className="brand" onClick={goBrowse}>Forkful<span>.</span></button>
        <p>Made with care, shared with love.</p>
        <span>Discover · Cook · Share</span>
      </footer>
    </div>
  );
}
