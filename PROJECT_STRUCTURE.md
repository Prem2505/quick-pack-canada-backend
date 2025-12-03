# Project Structure

This project follows industry-standard Node.js/Express.js architecture patterns.

## Directory Structure

```
quick-pack-canada-backend/
├── controllers/          # Request handlers (business logic)
│   ├── contactController.js
│   ├── healthController.js
│   └── orderController.js
├── routes/              # Route definitions
│   ├── contactRoutes.js
│   ├── healthRoutes.js
│   ├── orderRoutes.js
│   └── index.js         # Main router that combines all routes
├── utils/               # Utility functions and helpers
│   ├── emailUtils.js    # Email-related utilities
│   ├── helpers.js       # General helper functions
│   └── validation.js    # Validation utilities
├── server.js            # Application entry point
├── package.json
└── .env                 # Environment variables (not in git)
```

## Architecture Overview

### Separation of Concerns

1. **Routes** (`routes/`)
   - Define API endpoints
   - Map HTTP methods to controller functions
   - No business logic

2. **Controllers** (`controllers/`)
   - Handle request/response logic
   - Validate input
   - Call services/utilities
   - Return appropriate responses

3. **Utils** (`utils/`)
   - Reusable utility functions
   - Email configuration
   - Validation helpers
   - Data transformation

4. **Server** (`server.js`)
   - Application setup
   - Middleware configuration
   - Route mounting
   - Error handling

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Contact
- `GET /api/contact` - Send contact email (URL parameters)
- `POST /api/contact` - Send contact email (JSON body)

### Order
- `GET /api/order` - Submit order (URL parameters)
- `POST /api/order` - Submit order (JSON body)

## Benefits of This Structure

1. **Maintainability** - Easy to locate and modify code
2. **Scalability** - Simple to add new features
3. **Testability** - Each component can be tested independently
4. **Reusability** - Utility functions can be shared across controllers
5. **Separation of Concerns** - Clear boundaries between layers
6. **Industry Standard** - Follows common Node.js/Express patterns

## Adding New Features

1. Create controller in `controllers/`
2. Create route file in `routes/`
3. Add route to `routes/index.js`
4. Add utilities to `utils/` if needed

