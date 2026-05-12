# Smakminnen

En användarbaserad plattform för att dela recept. Inloggade användare kan skapa, redigera och radera sina egna recept med tillhörande bild. Alla recept är synliga publikt — inloggning krävs inte för att läsa.

Projektet är ett studentinlämningsprojekt och består av ett Express-API mot MongoDB samt en React-klient.

## Funktionalitet

- Registrering och inloggning med bcrypt-krypterade lösenord och JWT i httpOnly-cookie
- CRUD på recept kopplat till inloggad användare, med bilduppladdning
- Publik läsning av alla recept utan inloggning
- Endast skaparen (eller en admin) får ändra eller ta bort ett recept
- Admin-roll med eget gränssnitt för att hantera användarroller och valfritt innehåll
- När en användare tas bort raderas även dennes recept automatiskt

## Admin

**Första registrerade användaren blir automatiskt admin.** Därefter kan en admin promota andra till admin via `/admin`-sidan, som även listar alla användare och recept med möjlighet att ta bort eller redigera. Om alla användare raderas blir nästa registrering admin igen — det fungerar som en återställningsmekanism.

## Tech stack

- **Server**: Node.js, Express, TypeScript, Mongoose (MongoDB), JWT, bcrypt, multer
- **Klient**: React, TypeScript, Vite, React Router

## Komma igång

Kräver Node.js 18+ och en MongoDB-databas (lokalt installerad eller via [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

### 1. Installera dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Konfigurera servern

Skapa `server/.env`:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/receptsida
JWT_SECRET=välj-en-lång-slumpmässig-sträng
PORT=3000
```

Vid lokal Mongo-installation används istället `MONGODB_URI=mongodb://localhost:27017/receptsida`.

### 3. Starta utvecklingsmiljön

I två separata terminaler:

```bash
# Terminal 1 — API på port 3000
cd server
npm run dev
```

```bash
# Terminal 2 — klient på port 5173
cd client
npm run dev
```

Öppna sedan http://localhost:5173 i webbläsaren och registrera ett konto. Första kontot blir admin.

## Projektstruktur

```
.
├── server/        Express-API
│   └── src/
│       ├── models/        Mongoose-scheman (User, Post)
│       ├── routes/        REST-endpoints
│       └── middleware/    Auth & adminkontroll
└── client/        React-app
    └── src/
        ├── components/    Layout, header, route-guards
        ├── contexts/      AuthContext
        └── pages/         Hem, login, recept-formulär, admin, ...
```
