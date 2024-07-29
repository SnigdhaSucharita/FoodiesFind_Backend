const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

const app = express();
const PORT = process.env.PORT || 3000;
let db;

// Connect to SQLite database
(async () => {
  db = await open({ filename: "./database.sqlite", driver: sqlite3.Database });
  if (db) console.log("Connected to the SQLite database.");
})();

app.get("/", (req, res) => {
  res.status(200).json({ message: "BD4-Assignment 1- Backend for a food discovery app called FoodieFinds." });
});

// YOUR ENDPOINTS GO HERE

async function fetchAllRestaurants() {
  let query = "SELECT * FROM restaurants";
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get("/restaurants", async (req, res) => {
  try {
    let result = await fetchAllRestaurants();
    if(result.restaurants.length === 0) {
      res.status(404).json({ message: "No restaurants found." });
    }
    res.status(200).json(result);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
})

async function fetchRestaurantById(id) {
  let query = "SELECT * FROM restaurants WHERE id = ?";
  let response = await db.all(query, [id]);
  return { restaurant: response };
}

app.get("/restaurants/details/:id", async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    let result = await fetchRestaurantById(id);
    if(result.restaurant.length === 0) {
      res.status(404).json({ message: "No restaurant by this id found." });
    }
    res.status(200).json(result);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
})

async function fetchRestaurantsByCuisine(cuisine) {
  let query = "SELECT * FROM restaurants WHERE cuisine = ?";
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

app.get("/restaurants/cuisine/:cuisine", async (req, res) => {
  let cuisine = req.params.cuisine;
  try {
    let result = await fetchRestaurantsByCuisine(cuisine);
    if(result.restaurants.length === 0) {
      res.status(404).json({ message: `No restaurant with ${cuisine} cuisine found.` });
    }
    res.status(200).json(result);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
})

async function fetchRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query = "SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?";
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

app.get("/restaurants/filter", async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;
  try {
    let result = await fetchRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury);
    if(result.restaurants.length === 0) {
      res.status(404).json({ message: `No restaurant with given filter found.` });
    }
    res.status(200).json(result);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
})

async function fetchRestaurantsSortedByRating() {
  let query = "SELECT * FROM restaurants ORDER BY rating DESC";
  let restaurants = await db.all(query, []);
  return { restaurants };
}

app.get("/restaurants/sort-by-rating", async (req, res) => {
  try {
    let result = await fetchRestaurantsSortedByRating();
    if(result.restaurants.length === 0) {
      res.status(404).json({ message: `No restaurant found.` });
    }
    res.status(200).json(result);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
})

async function fetchAllDishes() {
  let query = "SELECT * FROM dishes";
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get("/dishes", async (req, res) => {
  try {
    let result = await fetchAllDishes();
    if(result.dishes.length === 0) {
      res.status(404).json({ message: `No dish found.` });
    }
    res.status(200).json(result);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
})

async function fetchDishById(id) {
  let query = "SELECT * FROM dishes WHERE id = ?";
  let response = await db.all(query, [id]);
  return { dish: response };
}

app.get("/dishes/details/:id", async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    let result = await fetchDishById(id);
    if(result.dish.length === 0) {
      res.status(404).json({ message: "No dish by this id found." });
    }
    res.status(200).json(result);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
})

async function fetchDishesByFilter(isVeg) {
  let query = "SELECT * FROM dishes WHERE isVeg = ?";
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}

app.get("/dishes/filter", async (req, res) => {
  let isVeg = req.query.isVeg;
  try {
    let result = await fetchDishesByFilter(isVeg);
    if(result.dishes.length === 0) {
      res.status(404).json({ message: "No dish with this filter found." });
    }
    res.status(200).json(result);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
})

async function fetchDishesSortedByPrice() {
  let query = "SELECT * FROM dishes ORDER BY price";
  let dishes = await db.all(query, []);
  return { dishes };
}

app.get("/dishes/sort-by-price", async (req, res) => {
  try {
    let result = await fetchDishesSortedByPrice();
    if(result.dishes.length === 0) {
      res.status(404).json({ message: "No dish found." });
    }
    res.status(200).json(result);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});