# 🎓 Skill Swap - Trade Knowledge, Not Money

Skill Swap is a premium, AI-powered marketplace designed to facilitate skill trading without monetary transactions. It allows users to transform their knowledge into a currency, enabling a peer-to-peer exchange of courses and expertise.

## ✨ Key Features

### 👤 User Features
- **Premium Dashboard**: A personalized overview of your learning journey, owned courses, and active exchange requests.
- **Course Marketplace**: Browse a wide variety of courses with advanced filtering by category and platform.
- **Seamless Exchange System**: Request to swap your owned courses for others in the community with a single click.
- **Real-time Notifications**: Track the status of your exchange requests (Pending, Accepted, Rejected) with instant feedback.
- **Mobile Responsive**: A fully optimized experience across all devices, from desktop to mobile.

### 🛡️ Admin Center
- **Advanced Overview**: Real-time stats on total users, courses, and platform activity with interactive spotlight effects.
- **Course Moderation**: Review, approve, or reject course submission requests to ensure platform quality.
- **User Management**: Monitor platform users and manage roles with ease.
- **Centralized Control**: A powerful dashboard to oversee all marketplace exchanges and approvals.

### 🔐 Security & Auth
- **Custom Authentication**: Secure email and password-based login system.
- **Role-Based Access**: Specialized views and permissions for Users and Admins.
- **Protected Routes**: Middleware-level security to ensure your data and courses are always safe.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+ (App Router)](https://nextjs.org/)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/)
- **State Management**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js v5 (Beta)](https://next-auth.js.org/)
- **Components**: Custom-built premium components with a focus on rich aesthetics.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Database (Atlas or Local)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Mst-Sumi-Akter/skill-swap.git
   cd skill-swap
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   AUTH_SECRET=your_next_auth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000) to see the result.

---

## 📦 Deployment

This project is optimized for deployment on the **Vercel Platform**.

1. Push your code to GitHub.
2. Connect your repository to Vercel.
3. Configure the `MONGODB_URI` and `AUTH_SECRET` in the Vercel Environment Variables settings.
4. Deploy!

---

## 📝 Credentials for Demo

To test the platform's roles immediately, use these credentials on the login page:

- **Admin**: `admin@mail.com` | `123456789`
- **Seed Admin**: `moon@gmail.com` | `password123`
- **User 1**: `n@gmail.com` | `qwert`
- **User 2**: `sumi@gmail.com` | `zxcvb`

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
