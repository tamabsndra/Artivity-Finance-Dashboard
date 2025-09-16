# Artivity Dashboard

A comprehensive financial dashboard built with Next.js, TypeScript, and Tailwind CSS for managing business finances, assets, employees, and generating financial reports.

## 🚀 Features

- **Transaction Management**: Complete CRUD operations for income and expenses
- **Asset Management**: Track and depreciate business assets
- **Employee Management**: Manage employee data and salary history
- **Financial Forecasting**: AI-powered financial predictions
- **Investor Insights**: Valuation readiness and investor reports
- **Report Generation**: Export financial reports in multiple formats
- **Real-time Analytics**: Live financial metrics and trends

## 🏗️ Architecture

### Project Structure

```
src/
├── components/           # React components
│   ├── ui/             # Reusable UI components
│   ├── features/       # Feature-specific components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── services/           # API and business logic
│   ├── api/           # Real API services
│   └── mock/          # Mock services for development
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── constants/         # Application constants
└── contexts/          # React contexts
```

### Key Design Patterns

- **Service Layer Pattern**: Clean separation between API calls and business logic
- **Repository Pattern**: Abstracted data access layer
- **Custom Hooks**: Reusable state management and side effects
- **Type Safety**: Comprehensive TypeScript coverage
- **Mock-First Development**: Mock services for rapid development

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Charts**: Recharts
- **State Management**: React Hooks, Context API
- **API**: RESTful API with comprehensive contracts
- **Development**: ESLint, Prettier, Hot Reload

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd artivity-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_USE_MOCK=true

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_FORECASTING=true
NEXT_PUBLIC_ENABLE_REPORTS=true
```

### API Configuration

The application supports two modes:

1. **Mock Mode** (Development): Uses mock data services
2. **API Mode** (Production): Connects to real backend API

Switch between modes by setting `NEXT_PUBLIC_USE_MOCK=true/false`

## 📡 API Integration

### Backend Requirements

The frontend expects a RESTful API with the following endpoints:

- **Transactions**: `/api/v1/transactions`
- **Categories**: `/api/v1/categories`
- **Projects**: `/api/v1/projects`
- **Assets**: `/api/v1/assets`
- **Employees**: `/api/v1/employees`
- **Financial Reports**: `/api/v1/financial/*`

See `API_CONTRACTS.md` for detailed API specifications.

### Service Layer

The application uses a service layer pattern:

```typescript
// Example usage
import { useTransactions } from '@/hooks/useTransactions'

function TransactionList() {
  const { transactions, loading, error, createTransaction } = useTransactions()

  // Component logic...
}
```

## 🎨 UI Components

### Component Library

Built with Radix UI primitives and styled with Tailwind CSS:

- **Forms**: Input, Select, DatePicker, etc.
- **Data Display**: Tables, Cards, Charts
- **Navigation**: Sidebar, Breadcrumbs, Tabs
- **Feedback**: Toast, Alert, Loading states

### Custom Components

- **DateRangePicker**: Advanced date range selection
- **TransactionForm**: Comprehensive transaction creation
- **FinancialCharts**: Interactive financial visualizations
- **ReportGenerator**: Dynamic report creation

## 📊 Data Management

### State Management

- **Local State**: React useState for component state
- **Server State**: Custom hooks for API data
- **Global State**: React Context for app-wide state

### Data Flow

1. **Components** → **Custom Hooks** → **Services** → **API/Mock**
2. **Services** handle business logic and data transformation
3. **Hooks** manage loading states and error handling
4. **Components** focus on presentation and user interaction

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

### Development Workflow

1. **Feature Development**: Create components in `src/components/features/`
2. **API Integration**: Add services in `src/services/api/`
3. **Type Definitions**: Define types in `src/types/`
4. **Custom Hooks**: Create hooks in `src/hooks/`
5. **Testing**: Add tests alongside components

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Setup

1. Set `NEXT_PUBLIC_USE_MOCK=false`
2. Configure `NEXT_PUBLIC_API_URL` to production API
3. Set up authentication if required
4. Configure feature flags as needed

## 📈 Performance

### Optimization Strategies

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Built-in bundle analyzer
- **Caching**: API response caching with SWR
- **Lazy Loading**: Component and route lazy loading

### Monitoring

- **Performance Metrics**: Core Web Vitals tracking
- **Error Tracking**: Comprehensive error logging
- **Analytics**: User behavior tracking
- **API Monitoring**: Request/response monitoring

## 🔒 Security

### Security Measures

- **Input Validation**: Client and server-side validation
- **XSS Protection**: Content Security Policy
- **CSRF Protection**: Token-based protection
- **Authentication**: JWT-based authentication (future)
- **Authorization**: Role-based access control (future)

## 🤝 Contributing

### Development Guidelines

1. **Fork** the repository
2. **Create** a feature branch
3. **Follow** the coding standards
4. **Write** tests for new features
5. **Submit** a pull request

### Code Review Process

1. **Automated Checks**: CI/CD pipeline validation
2. **Code Review**: Peer review required
3. **Testing**: Manual and automated testing
4. **Documentation**: Update relevant documentation

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Getting Help

- **Documentation**: Check this README and API contracts
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions
- **Email**: Contact the development team

### Common Issues

1. **Dependency Conflicts**: Use `--legacy-peer-deps` flag
2. **TypeScript Errors**: Check type definitions
3. **API Connection**: Verify environment variables
4. **Build Issues**: Clear `.next` folder and rebuild

---

**Built with ❤️ for modern financial management**
