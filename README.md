# Recipes Explorer

A React and Redux application for browsing recipes from the DummyJSON API. It provides a paginated recipe list, recipe details, and consistent loading, error, and empty states.

## Features

- Paginated recipe browsing
- Dedicated recipe detail routes
- Redux Toolkit state management
- Shared API and status components
- Responsive SCSS module styling

## Tech stack

- React 19 and TypeScript
- Redux Toolkit and React Redux
- React Router
- Axios
- Rsbuild
- SCSS modules

## Getting started

```bash
git clone https://github.com/alirazawatoo/recipe-explorer-app.git
cd recipe-explorer-app
npm install
npm run dev
```

The development server prints its local URL after startup.

## Routes

| Route | Purpose |
|---|---|
| `/recipes` | Browse the recipe collection |
| `/recipes/:id` | View a recipe's details |

## Project structure

```text
src/
├── app/                 # Store configuration and typed hooks
├── pages/
│   ├── recipes/         # Recipe list UI and state
│   └── recipe-details/  # Detail UI and state
├── shared/
│   ├── api/             # HTTP client and recipe API functions
│   └── ui/              # Reusable status components
└── styles/              # Global styles
```

## API

The application reads recipe data from [DummyJSON](https://dummyjson.com/docs/recipes):

- `GET /recipes?limit={limit}&skip={skip}`
- `GET /recipes/{id}`

## Scripts

```bash
npm run dev      # Start the development server
npm run build    # Create a production build
npm run preview  # Preview the production build
```
