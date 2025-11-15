# NutriLanka — Sri Lankan Diets

Hackathon-ready MERN (MongoDB, Express, React, Node) platform for culturally relevant nutrition coaching built as a monorepo with `server` (API) and `client` (Vite + React + Tailwind).

## Features

- JWT auth (register/login/logout) with onboarding wizard (age, weight, activity, goal)
- Meal logging per meal type with automatic calorie & macro totals and swap tracking
- Food search & detail view powered by `seedFoods.json` (~80 Sri Lankan items) with ratings, nutrition table, Smart Tip & Swap buttons
- Smart analytics (7-day calories, swaps accepted) + preset meal plans
- Advisor directory, healthy shop links with map, appointment booking API flow
- Healthy food shop listings and culturally aware smart tips
- Admin dashboard to approve user foods, add advisors, view KPIs

## Tech stack

| Area   | Stack |
|--------|-------|
| Server | Express 5, Mongoose 8, JWT, bcrypt, dotenv, cors, morgan |
| Client | React 19, Vite 7, React Router 7, Redux Toolkit, Axios, TailwindCSS 3, Recharts |

## Getting started

```bash
# install server dependencies
cd server
npm install
cp .env.example .env   # edit Mongo connection + JWT secret
npm run seed           # loads seedFoods.json into Mongo
npm run dev            # starts API on http://localhost:5000

# in new terminal run the client
cd ../client
npm install
npm run dev            # http://localhost:5173
```

The first registered account automatically becomes `admin`, letting you access `/admin`.

## Environment variables (`server/.env`)

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/nutrition-advisor
JWT_SECRET=change-me
CLIENT_URL=http://localhost:5173
```

## API surface (selected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user (first user promoted to admin) |
| POST | `/api/auth/login` | Login returns JWT |
| PUT | `/api/auth/onboarding` | Save onboarding form |
| GET | `/api/foods` | Search foods (`?q=rice`) |
| GET | `/api/foods/:id` | Food detail + macros |
| GET | `/api/foods/:id/tip` | Smart tip text |
| GET | `/api/foods/:id/swaps` | 3 healthier swaps |
| POST | `/api/meals` | Log meal `{ mealType, items: [{ foodId, portionCount }] }` |
| GET | `/api/analytics/weekly` | 7-day calories + swaps |
| GET | `/api/advisors` | Advisor directory (fallback seeded) |
| POST | `/api/advisors/appointments` | Book advisor (auth) |
| GET | `/api/advisors/shops` | Healthy shop links & map URLs |
| GET | `/api/admin/foods/pending` | Admin pending approvals |
| POST | `/api/admin/foods/:id/approve` | Approve submission |
| POST | `/api/admin/advisors` | Add advisor |

## Client npm scripts

- `npm run dev` – start Vite + Tailwind dev server
- `npm run build` – production bundle
- `npm run preview` – preview production build
- `npm run lint` – ESLint via `eslint.config.js`

## Core flows to try

1. **Auth + onboarding** – Register, complete onboarding wizard, explore dashboard.
2. **Food search/detail** – Open Foods page, search “kottu”, view detail, fetch Smart Tip & Swap.
3. **Meal logging** – Use Meals page to log breakfast/lunch/dinner and see analytics update.
4. **Swap/tip usage** – Accept swaps count in meal form to feed analytics “swaps accepted”.
5. **Advisor booking** – Select advisor, pick calendar slot, confirm booking, review appointments.
6. **Healthy shops** – Scroll to shop list and open map links for Sri Lankan healthy grocers.
7. **Admin approvals** – Login as admin (first user), visit `/admin`, approve foods, add advisors.

Enjoy shipping NutriLanka  

