# Code Conventions - Poutine Mania

This document outlines the coding standards and conventions used in the Poutine Mania project.

## File Organization

### Directory Structure
```
components/
├── context/          # React Context providers
├── controls/         # Form controls and inputs
├── display/          # Display-only components
├── forms/           # Form components
├── layout/          # Layout components
├── page-layouts/    # Page-specific layouts
├── profile/         # Profile-related components
└── motion-primitives/ # Animation components

pages/
├── api/             # API routes
├── admin/           # Admin pages
├── restaurants/     # Restaurant pages
└── users/           # User pages

lib/                 # Utility functions and helpers
data/               # Static data and constants
styles/             # Global CSS
```

## File Naming Conventions

### Component Files
- **Components**: PascalCase with `.js` extension (e.g., `BrandLogo.js`, `Header.js`)
- **TypeScript Components**: PascalCase with `.tsx` extension (e.g., `Button.tsx`, `Spinner.tsx`)
- **SCSS Modules**: kebab-case with `.module.scss` extension (e.g., `data-ring.module.scss`)

### Utility Files
- **JavaScript Utilities**: camelCase with `.js` extension (e.g., `generateSlug.js`, `formatRating.js`)
- **TypeScript Utilities**: camelCase with `.ts` extension (e.g., `utils.ts`)

### Configuration Files
- All lowercase with appropriate extensions (e.g., `next.config.js`, `tailwind.config.js`)

## Component Structure

### Standard Component Pattern
```javascript
import { useState, useEffect } from 'react';
import classNames from 'classnames';

const ComponentName = ({ prop1, prop2 = 'defaultValue', ...props }) => {
  // Hooks and state
  const [state, setState] = useState(null);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // Helper functions
  const handleAction = () => {
    // Handler logic
  };
  
  // Render logic
  return (
    <div className={classNames('base-classes', {
      'conditional-class': condition
    })}>
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

### Export Conventions
- **Default exports** for main components
- **Named exports** for utilities and sub-components
- Prefer default exports for React components

## Styling Conventions

### CSS Framework Usage
- **Primary**: Tailwind CSS utility classes
- **Secondary**: SCSS modules for component-specific styles
- **Global**: CSS in `/styles/globals.css`

### Styling Patterns
```javascript
// Use classNames for conditional styling
const className = classNames('base-class', {
  'active-class': isActive,
  'disabled-class': isDisabled
});

// Variant-based styling with configuration objects
const variantClasses = {
  primary: 'bg-gradient-to-tr from-teal-700 to-teal-500',
  secondary: 'bg-gray-200',
  danger: 'bg-red-500'
};
```

### Responsive Design
- Use Tailwind breakpoints: `xs:`, `sm:`, `md:`, `lg:`
- Mobile-first approach

## TypeScript Integration

### Current State
- Partial TypeScript adoption (`strict: false`)
- Mix of `.js`, `.jsx`, and `.tsx` files
- Type definitions in `next-env.d.ts`

### Best Practices
- Use `.tsx` for new React components
- Use `.ts` for utility functions
- Gradually migrate existing `.js` files to TypeScript

## API Route Conventions

### File Structure
```
pages/api/
├── auth/
├── restaurants/
│   ├── [id]/
│   │   ├── index.js      # GET /api/restaurants/:id
│   │   ├── update.js     # PUT /api/restaurants/:id
│   │   └── delete.js     # DELETE /api/restaurants/:id
│   └── index.js          # GET /api/restaurants
└── users/
```

### API Implementation Pattern
```javascript
import nc from 'next-connect';
import { database } from '../../middleware/database';

const handler = nc({ attachParams: true })
  .use(database)
  .get(async (req, res) => {
    // GET handler
  })
  .post(async (req, res) => {
    // POST handler
  });

export default handler;
```

## State Management

### Context Pattern
```javascript
// Provider component
const SomeProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  
  const value = {
    state,
    setState,
    // Actions
  };
  
  return (
    <SomeContext.Provider value={value}>
      {children}
    </SomeContext.Provider>
  );
};

// Custom hook
const useSome = () => {
  const context = useContext(SomeContext);
  if (!context) {
    throw new Error('useSome must be used within SomeProvider');
  }
  return context;
};
```

## Internationalization

### Translation Keys
- Use dot notation: `"backend.signup.invalidEmailFormat"`
- Organize by feature/page
- Store in `/public/locales/[lang]/common.json`

### Usage Pattern
```javascript
import { useTranslation } from 'next-i18next';

const Component = () => {
  const { t } = useTranslation('common');
  
  return <p>{t('key.subkey')}</p>;
};
```

## Database Conventions

### MongoDB Patterns
- Use aggregation pipelines for complex queries
- Implement connection pooling via middleware
- Follow camelCase for field naming
- Sanitize user data with `mapToPublicUser`

## Authentication

### NextAuth Integration
- Session-based authentication
- Multiple provider support
- Admin role checking pattern
- Email verification flow

## Code Quality

### Linting and Formatting
- ESLint with React and Prettier plugins
- Automated formatting on save
- Consistent import organization

### Error Handling
- Use appropriate HTTP status codes in API routes
- Consistent error response format
- Client-side error boundaries where appropriate

## Development Workflow

### Git Conventions
- Feature branches for new development
- Descriptive commit messages
- Pull request reviews required

### Testing
- Test components with React Testing Library
- API route testing with appropriate mocks
- E2E testing for critical user flows

## Performance Considerations

### Next.js Optimization
- Use dynamic imports for code splitting
- Optimize images with `next/image`
- Implement proper caching strategies
- Use `getStaticProps`/`getServerSideProps` appropriately

### React Performance
- Use `React.memo` for expensive components
- Implement proper dependency arrays in hooks
- Avoid inline object/function creation in renders

## Security Best Practices

- Never commit secrets or API keys
- Sanitize user input
- Implement proper authentication checks
- Use HTTPS in production
- Validate data on both client and server