# Inkwell - Blog / Post Management (React + Express + MongoDB)

Flow: React (fetch) -> Express REST API -> MongoDB Atlas

## 1. Set up MongoDB Atlas
1. Create a free cluster at https://cloud.mongodb.com
2. Create a database user and allow your IP under Network Access.
3. Copy the connection string into `server/.env` as `ATLAS_URI`.

## 2. Run the API
```
cd server
npm install
npm start          # http://localhost:5050
```

## 3. Run the React app (new terminal)
```
cd app
npm install
npm run dev        # http://localhost:5173
```
The API address is set in `app/.env` (`VITE_API_URL`).

## REST API
| Method | Route         | Description              |
|--------|---------------|--------------------------|
| GET    | /posts        | List all posts           |
| GET    | /posts/latest | 3 most recent posts      |
| GET    | /posts/:id    | Get one post             |
| POST   | /posts        | Create a post            |
| PATCH  | /posts/:id    | Update a post            |
| DELETE | /posts/:id    | Delete a post            |

Post document: `{ title, author, content, tags[], createdAt, updatedAt }`

## Pages
- Home: 3 latest posts
- Create: new post form
- Post: read, edit and delete a single post
- Archive: table of all posts with delete
