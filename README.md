# 🌍 SmarTravel

**SmarTravel** is a smart travel planning web application that helps users **plan efficient trips**, **calculate fuel costs**, and **navigate routes** with real-time mapping features.  
It combines an interactive React front-end with a powerful Node.js/Express back-end to deliver a seamless and data-driven travel experience.

---

## ✨ Features

- 🗺 **Interactive Map** – View and explore routes using a dynamic map interface.
- 🔎 **Smart Location Search** – Autocomplete search with real-time suggestions.
- 🚗 **Fuel Calculator** – Estimate fuel costs based on distance and consumption.
- ➡️ **Route Optimization** – Get alternative routes and live navigation details.
- 🕒 **Trip History** – Save and revisit previous trips for future planning.
- 🔐 **User Authentication** – Secure login and personalized trip data.

---

## 🛠 Tech Stack

| Layer      | Technology |
|------------|------------|
| **Frontend** | [React](https://reactjs.org/) + JavaScript (Hooks, Context API) |
| **Backend**  | [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) |
| **Mapping**  | Google Maps / Leaflet APIs (Map display, routing) |
| **Styling**  | CSS3 / Responsive Design |
| **Other**    | REST APIs, Environment Variables (.env) |

---

## 📂 Project Structure

```
Code SmarTravel/
├── client/            # React frontend
│   ├── src/
│   │   ├── components/   # UI & feature components (Map, Fuel, Search, etc.)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API integrations (routing, geocoding, fuel)
│   │   └── utils/        # Helpers & calculations
├── server/            # Node.js backend
│   ├── routes/        # API routes
│   ├── controllers/   # Business logic
│   └── models/        # Data models (if using a DB)
|__ .gitignore
└── README.md
```

---

## 🚀 Getting Started

Follow these steps to run the project locally:

### 1️⃣ Prerequisites
- [Node.js](https://nodejs.org/) >= 18
- npm or yarn
- (Optional) Google Maps API key

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/SmarTravel.git
cd SmarTravel
```

### 3️⃣ Install Dependencies
**Client**
```bash
cd client
npm install
```

**Server**
```bash
cd ../server
npm install
```

### 4️⃣ Set Up Environment Variables
Create a `.env` file inside the `server/` folder with:
```env
# Database
MONGO_URI=your_mongodb_connection_string

# JWT Secret for authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Server configuration  
NODE_ENV=development
PORT=5000

# Client URL for CORS
CLIENT_URL=http://localhost:3000
```

**Note:** Get your MongoDB connection string from [MongoDB Atlas](https://cloud.mongodb.com) and replace `your_mongodb_connection_string` with your actual connection string.

### 5️⃣ Run the App
Open two terminals:

**Client**
```bash
cd client
npm start
```

**Server**
```bash
cd server
npm run dev
```

The application will be available at **http://localhost:3000**.

---

## 📸 Screenshots (Optional)
> *(Add screenshots or GIFs showing the map, routing, and fuel calculator for visual appeal.)*

---

## 🤝 Contributing
Contributions are welcome!  
1. Fork the repo
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request

---

## 📜 License
This project is licensed under the [MIT License](LICENSE).

---

## 💼 Resume / Portfolio Highlight

This project demonstrates:
- **Full-stack web development** (React + Node.js)
- **API integration** (maps, routing, geolocation)
- **State management & custom hooks**
- **Responsive UI design**
- **Real-world problem solving** in travel & logistics
