Here is a `README.md` file for your project:

```markdown
# FinTrack - Personal Finance Tracker

FinTrack is a full-stack personal finance tracking application that allows users to manage their budgets, track transactions, and generate financial reports. The application is built using React, Zustand, and Tailwind CSS on the frontend, and Node.js, Express, and MongoDB on the backend.

---

## Features

- **User Authentication**: Register, log in, and manage user sessions with JWT-based authentication.
- **Transaction Management**: Add, edit, and delete income, expenses, and transfers.
- **Budget Tracking**: Create and manage budgets with real-time tracking of spending.
- **Financial Reports**: Visualize income, expenses, and savings trends with charts.
- **Responsive Design**: Fully responsive UI built with Tailwind CSS.
- **Protected Routes**: Secure access to user-specific data using authentication middleware.

---

## Tech Stack

### Frontend
- **React**: Component-based UI library.
- **Zustand**: State management for React.
- **React Router**: Client-side routing.
- **Tailwind CSS**: Utility-first CSS framework.
- **Recharts**: Data visualization library for charts.

### Backend
- **Node.js**: JavaScript runtime for the server.
- **Express**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing user data.
- **Mongoose**: ODM for MongoDB.
- **JWT**: JSON Web Tokens for authentication.

---

## Installation

### Prerequisites
- Node.js (v18 or later)
- MongoDB (local or Atlas cluster)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/ThushanMadu/FINTRACK
   cd fintrack
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following variables:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   JWT_SECRET=your_secure_jwt_secret_key
   PORT=5001
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   - The frontend will be available at `http://localhost:5173`.
   - The backend will run on `http://localhost:5001`.

---

## Usage

### Register and Login
1. Navigate to `http://localhost:5173/register` to create a new account.
2. Log in at `http://localhost:5173/login` using your credentials.

### Transactions
- Add, edit, or delete transactions (income, expenses, or transfers) from the **Transactions** page.

### Budgets
- Create and manage budgets for specific categories and time periods on the **Budgets** page.

### Reports
- View financial insights, including expense distribution and savings trends, on the **Reports** page.

---

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Log in a user and return a JWT.
- `GET /api/auth/me`: Get the current authenticated user.

### Transactions
- `GET /api/transactions`: Get all transactions for the logged-in user.
- `POST /api/transactions`: Create a new transaction.
- `PUT /api/transactions/:id`: Update a transaction.
- `DELETE /api/transactions/:id`: Delete a transaction.

### Budgets
- `GET /api/budgets`: Get all budgets for the logged-in user.
- `POST /api/budgets`: Create a new budget.
- `PUT /api/budgets/:id`: Update a budget.
- `DELETE /api/budgets/:id`: Delete a budget.

---

## Folder Structure

```
project/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page components for routes
│   ├── stores/           # Zustand state management
│   ├── config/           # Configuration files
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Entry point for the React app
│   └── index.css         # Tailwind CSS styles
├── server/
│   ├── controllers/      # API controllers
│   ├── middleware/       # Middleware functions
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   └── index.js          # Entry point for the backend
├── .env                  # Environment variables
├── package.json          # Project metadata and dependencies
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.ts        # Vite configuration
└── README.md             # Project documentation
```

---

## Scripts

- `npm run dev`: Start both the frontend and backend in development mode.
- `npm run dev:frontend`: Start the frontend only.
- `npm run dev:backend`: Start the backend only.
- `npm run build`: Build the frontend for production.
- `npm run preview`: Preview the production build.

---

## Known Issues

- Ensure your MongoDB Atlas cluster has the correct IP whitelisting.
- Use a strong `JWT_SECRET` in production.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

---

## Contact

For questions or support, please contact [thushanmadu2003@gmail.com].
```

Save this content in a file named `README.md` in the root of your project. Let me know if you need further adjustments!Save this content in a file named `README.md` in the root of your project. Let me know if you need further adjustments!