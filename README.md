# 🌾 Umoja Agri E-Commerce Platform

**Umoja** is a comprehensive full-stack agri-tech web application built to empower **farmers, buyers, suppliers, and admins** across Kenya to trade and collaborate through a seamless, modern, and intelligent digital ecosystem.

---

## 🚀 Features

### 👨‍🌾 Farmer Dashboard
- Overview of products, orders, revenue, and customer stats
- Add, edit, delete products with image uploads
- Real-time order tracking and customer management
- Advanced analytics (sales trends, top buyers, revenue charts)
- Calendar with harvest dates, delivery schedules, and tasks
- Profile editing with avatar cropping and password change
- Notifications, settings, and logout confirmation dialogs
- M-Pesa mock for payments

### 🛒 Buyer Dashboard
- Explore curated featured products and sellers
- Place and manage orders in real-time
- Marketplace with filtering, sorting, and AI recommendations
- Wishlist, messages with sellers, and event calendar
- Edit profile with secure authentication
- M-Pesa mock for payments

### 🛡 Admin Dashboard
- Role-based access control
- Manage users (farmers, buyers, suppliers)
- Monitor products, orders, and platform-wide metrics
- Approve suppliers and oversee platform health
- System-wide settings and audit logs

---

## 🧰 Tech Stack

### Frontend (React + Vite + TypeScript)
- ⚛ React + Vite + TypeScript
- 🌀 Tailwind CSS + shadcn/ui for styling
- 🎥 Framer Motion for animations
- 📦 React Query for data fetching and caching
- 🔐 Zustand for auth state management
- 🧭 React Router DOM for routing

### Backend (NestJS + PostgreSQL)
- 🚀 NestJS with TypeScript
- 🗃 PostgreSQL + Sequelize ORM
- 🔐 JWT Auth + RBAC
- 📤 Multer for image upload handling
- 🧠 Gemini AI API integration for recommendations
- 🕒 BullMQ for background tasks (email, events, reports)

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── farmer/
│   │   ├── buyer/
│   │   ├── admin/
│   │   └── supplier/
│   ├── components/
│   ├── context/ (Zustand auth store)
│   ├── routes/
│   └── services/
backend/
├── src/
│   ├── modules/ (users, products, orders, analytics, etc.)
│   ├── middleware/
│   ├── config/
│   ├── controllers/
│   └── models/
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDb (dev)
- Yarn or npm

### 🔧 Backend Setup

```bash
cd backend
# Set database, JWT, and mail credentials
npm install

npm run dev
```

### 💻 Frontend Setup

```bash
cd frontend
# Set backend API base URL
npm install
npm run dev
```

---

## 🛡 Roles and Access

| Role     | Access                             |
|----------|------------------------------------|
| Farmer   | Products, Orders, Customers, etc.  |
| Buyer    | Explore, Orders, Marketplace       |
| Admin    | All dashboards, user management    |

---


---

## 📫 Contact & Contributions

Maintained by [Paul Joker](https://github.com/PaulJkr)

Contributions are welcome! Open an issue or submit a pull request.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
