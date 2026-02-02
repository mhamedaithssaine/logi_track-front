# LogiTrack — Frontend

Application Angular moderne pour la gestion des commandes et de la logistique (espace client, admin, responsable d'entrepôt). Design 2024–2025 inspiré de Stripe, Linear, Vercel, Notion.

## Prérequis

- Node.js 18+
- npm 10+
- Backend Spring Boot LogiTrack démarré sur `http://localhost:8080`

## Installation

```bash
npm install
```

## Démarrage

```bash
ng serve
```

Ouvrir [http://localhost:4200](http://localhost:4200). L’application redirige vers `/auth/login` par défaut.

## Build production

```bash
ng build
```

Les artefacts sont dans `dist/`.

## Structure du projet

- **`core/`** — Guards, interceptors, services (auth, API), modèles, config
- **`shared/`** — Composants réutilisables (toast, product-card, quantity-selector, cart-sidebar), services partagés
- **`features/`** — Modules métier : auth (login/register), client (catalogue, commandes, expéditions), admin, warehouse-manager
- **`layout/`** — Layouts (client, admin, warehouse-manager) avec navbar et panier

## Design system

Les variables CSS globales sont dans `src/styles.scss` :

- **Couleurs** : fond `#FAFAFA`, accent `#6366F1`, texte `#1F2937` / `#6B7280`
- **Typographie** : Inter (Google Fonts)
- **Composants** : `.btn-base`, `.btn-primary`, `.card-base`, `.input-base`

## API Backend

Le front consomme l’API Spring Boot :

- `GET /api/products/catalogue` — Catalogue (actifs, filtre catégorie)
- `POST /api/auth/login` — Connexion
- `POST /api/clients/register` — Inscription client
- `GET /api/orders` — Liste commandes (avec `clientId` pour le client)
- `POST /api/orders` — Créer une commande
- etc.

Configuration : `src/app/core/config/api.config.ts` (`baseUrl: 'http://localhost:8080/api'`).

## Option : Tailwind CSS

Pour ajouter Tailwind CSS (optionnel) :

```bash
npm install -D tailwindcss @tailwindcss/postcss postcss
```

Créer `.postcssrc.json` à la racine :

```json
{"plugins": {"@tailwindcss/postcss": {}}}
```

Puis dans `src/styles.scss` ajouter en première ligne : `@import "tailwindcss";`

## Tests

```bash
ng test
```

## Licence

Projet LogiTrack.
