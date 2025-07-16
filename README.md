# HeyEV Social Posting App

## Screenshots

<p align="center">
  <img src="client/public/screenshot/Screenshot%20(178).png" alt="App Screenshot 1" width="400"/>
  <img src="client/public/screenshot/Screenshot%20(177).png" alt="App Screenshot 2" width="400"/>
  <img src="client/public/screenshot/Screenshot%202025-07-15%20223441.png" alt="App Screenshot 3" width="400"/>
  <img src="client/public/screenshot/Screenshot%202025-07-15%20223329.png" alt="App Screenshot 4" width="400"/>
  <img src="client/public/screenshot/Screenshot%202025-07-15%20223310.png" alt="App Screenshot 5" width="400"/>
  <img src="client/public/screenshot/Screenshot%20(167).png" alt="App Screenshot 6" width="400"/>
</p>

A modern full-stack social posting app with authentication, posts, comments, likes, user profiles, infinite scroll, and a beautiful UI.

## Features

- User registration and login (JWT, HTTP-only cookies)
- Protected routes and role-based access
- Create, edit, delete posts and comments
- Like/unlike posts and comments (real-time UI)
- User profiles with post lists
- Infinite scroll for posts (Home & Profile)
- Responsive, accessible, and modern design
- **Image upload for posts using multer (stored on disk for now; cloud storage planned)**

## Tech Stack

- **Frontend:** React (Vite, TailwindCSS, react-router, axios)
- **Backend:** Node.js, Express, Sequelize, MySQL
- **File Uploads:** Multer (disk storage currently; will migrate to cloud storage such as AWS S3, Cloudinary, etc.)
- **State:** React hooks, custom hooks, context
- **Other:** JWT, HTTP-only cookies, REST API

## Project Structure

```
client/
  src/
    api/         # API abstraction for posts, auth, comments, likes
    components/  # Reusable UI components (Navbar, PostCard, CommentItem, etc.)
    hooks/       # Custom React hooks (useAuthCheck, useForm, etc.)
    pages/       # Page components (Home, Post, Profile, etc.)
    store/       # (If used) State management
    utils/       # Axios instance, helpers
server/
  ...           # Express backend, models, routes, config
```

## Setup & Development

1. **Install dependencies:**
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

2. **Configure environment variables:**
   - Create a `.env` file in `client/`:
     ```
     VITE_BACKEND_URL=http://localhost:3000
     ```
   - Configure your backend `.env` as needed (see server docs).

3. **Start the development servers:**
   ```bash
   # In one terminal (client)
   cd client
   npm run dev

   # In another terminal (server)
   cd server
   npm start
   ```

## Image Storage

- **Current:** Images uploaded with posts are stored on disk using [multer](https://github.com/expressjs/multer) in the backend's `server/upload/` directory.
- **Planned:** In the future, images will be stored using a cloud storage service (e.g., AWS S3, Cloudinary, etc.) for better scalability and reliability.

## Environment Variables

- `VITE_BACKEND_URL` — The base URL for the backend API (client).
- See `server/.env` for backend variables.

## Accessibility & Performance

- All interactive elements are keyboard accessible and have `aria-label`s.
- Infinite scroll for posts (Home & Profile) for a seamless UX.
- Components are memoized for performance.

## Contributing

- Use `src/api/` for all API calls.
- Use custom hooks for shared logic.
- Write accessible, responsive UI.
- Add JSDoc comments to custom hooks and API utilities.

## License

MIT
