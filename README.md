# BiciTec - Bike Sharing Management System

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)

BiciTec is a comprehensive bike sharing management system designed for efficient tracking, management, and analysis of bike sharing operations. The platform provides real-time monitoring of bikes, stations, and user activities.


Backend: https://github.com/Gugoraaa/biciTecAPI
## ✨ Features

- 🚴 **Bike Management**: Track and manage all bikes in the system
- 📍 **Station Monitoring**: View and manage bike stations
- 📊 **Real-time Analytics**: Monitor usage patterns and system performance
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🌐 **Multi-language Support**: Internationalization (i18n) ready
- 📝 **Reporting**: Generate reports and export data to CSV
- 🔐 **User Management**: Role-based access control

## 🛠️ Tech Stack

- **Frontend**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl
- **Charts**: Recharts
- **Maps**: Leaflet with React-Leaflet
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **Type Safety**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gugoraaa/bicitec.git
   cd bicitec
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the necessary environment variables.

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
src/
├── app/                  # App router pages
│   ├── bikes/            # Bikes management
│   ├── inbox/            # Messaging system
│   ├── maintenance/      # Maintenance requests
│   ├── overview/         # Dashboard
│   ├── stations/         # Stations management
│   └── usersManagement/  # User administration
│
├── components/           # Reusable components
│   ├── auth/             # Authentication components
│   ├── bikes/            # Bike-related components
│   ├── inbox/            # Inbox components
│   ├── maintenance/      # Maintenance components
│   ├── overview/         # Dashboard components
│   ├── stations/         # Station components
│   └── ui/               # UI primitives
│
├── contexts/             # React contexts
├── i18n/                 # Internationalization setup
├── lib/                  # Utility functions
├── messages/             # Translation files
└── types/                # TypeScript type definitions
```

## 📦 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

