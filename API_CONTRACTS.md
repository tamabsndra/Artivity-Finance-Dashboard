# Artivity Dashboard API Contracts

This document outlines the API contracts that the backend needs to implement for the Artivity Dashboard frontend.

## Base Configuration

- **Base URL**: `http://localhost:8000/api/v1`
- **Content-Type**: `application/json`
- **Authentication**: Bearer Token (when implemented)

## Response Format

All API responses should follow this format:

```json
{
  "success": true,
  "data": <response_data>,
  "message": "Optional success message",
  "errors": ["Optional error messages"]
}
```

## Error Response Format

```json
{
  "success": false,
  "data": null,
  "message": "Error message",
  "errors": ["Detailed error messages"]
}
```

## Pagination Format

For paginated responses:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## Transactions API

### GET /transactions
Get all transactions with pagination and filters.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for description
- `type` (optional): Filter by type (`income` | `expense`)
- `method` (optional): Filter by method (`sales` | `capex` | `opex`)
- `category_id` (optional): Filter by category ID
- `project_id` (optional): Filter by project ID
- `tag_id` (optional): Filter by tag ID
- `start_date` (optional): Filter by start date (YYYY-MM-DD)
- `end_date` (optional): Filter by end date (YYYY-MM-DD)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "type": "income",
      "method": "sales",
      "category_id": 1,
      "project_id": 1,
      "tag_id": 2,
      "amount": 15000,
      "description": "Mobile app subscription revenue",
      "date": "2024-03-01",
      "created_at": "2024-03-01T10:00:00Z",
      "updated_at": "2024-03-01T10:00:00Z",
      "category": {
        "id": 1,
        "name": "Sales Revenue",
        "type": "income"
      },
      "project": {
        "id": 1,
        "name": "Mobile App Development",
        "description": "iOS and Android app development"
      },
      "tag": {
        "id": 2,
        "name": "Recurring",
        "color": "#3b82f6"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### POST /transactions
Create a new transaction.

**Request Body:**
```json
{
  "type": "income",
  "method": "sales",
  "category_id": 1,
  "project_id": 1,
  "tag_id": 2,
  "amount": 15000,
  "description": "Mobile app subscription revenue",
  "date": "2024-03-01"
}
```

### PUT /transactions/{id}
Update an existing transaction.

**Request Body:**
```json
{
  "amount": 16000,
  "description": "Updated description"
}
```

### DELETE /transactions/{id}
Delete a transaction.

### POST /transactions/bulk
Bulk create transactions.

**Request Body:**
```json
{
  "data": [
    {
      "type": "income",
      "method": "sales",
      "category_id": 1,
      "amount": 15000,
      "description": "Transaction 1",
      "date": "2024-03-01"
    },
    {
      "type": "expense",
      "method": "opex",
      "category_id": 3,
      "amount": 5000,
      "description": "Transaction 2",
      "date": "2024-03-02"
    }
  ]
}
```

### PUT /transactions/bulk
Bulk update transactions.

**Request Body:**
```json
{
  "updates": [
    {
      "id": 1,
      "data": {
        "amount": 16000,
        "description": "Updated transaction 1"
      }
    },
    {
      "id": 2,
      "data": {
        "amount": 6000,
        "description": "Updated transaction 2"
      }
    }
  ]
}
```

### DELETE /transactions/bulk
Bulk delete transactions.

**Request Body:**
```json
{
  "ids": [1, 2, 3]
}
```

### GET /transactions/summary
Get transaction summary with filters.

**Query Parameters:** Same as GET /transactions

**Response:**
```json
{
  "total_income": 50000,
  "total_expense": 30000,
  "net_income": 20000,
  "transaction_count": 25,
  "period": "2024-03-01 to 2024-03-31"
}
```

### POST /transactions/export
Export transactions to file.

**Request Body:**
```json
{
  "format": "csv",
  "filters": {
    "type": "income",
    "start_date": "2024-03-01",
    "end_date": "2024-03-31"
  }
}
```

**Response:** File download (CSV, Excel, or PDF)

---

## Categories API

### GET /categories
Get all categories.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Sales Revenue",
      "type": "income",
      "description": "Revenue from product sales",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /categories
Create a new category.

### PUT /categories/{id}
Update a category.

### DELETE /categories/{id}
Delete a category.

---

## Projects API

### GET /projects
Get all projects.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Mobile App Development",
      "description": "iOS and Android app development",
      "start_date": "2024-01-01",
      "end_date": null,
      "status": "active",
      "budget": 50000,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /projects
Create a new project.

### PUT /projects/{id}
Update a project.

### DELETE /projects/{id}
Delete a project.

---

## Tags API

### GET /tags
Get all tags.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Urgent",
      "color": "#ef4444",
      "description": "High priority items",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /tags
Create a new tag.

### PUT /tags/{id}
Update a tag.

### DELETE /tags/{id}
Delete a tag.

---

## Assets API

### GET /assets
Get all assets.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Office Building",
      "category": "Real Estate",
      "purchase_date": "2023-01-01",
      "cost": 500000,
      "depreciation_rate": 2.5,
      "lifetime_years": 40,
      "description": "Main office building",
      "current_value": 487500,
      "status": "active",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2024-03-01T00:00:00Z"
    }
  ]
}
```

### POST /assets
Create a new asset.

### PUT /assets/{id}
Update an asset.

### DELETE /assets/{id}
Delete an asset.

### GET /assets/depreciation
Get asset depreciation data.

---

## Employees API

### GET /employees
Get all employees.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@artivity.com",
      "position": "Senior Developer",
      "type": "full-time",
      "current_salary": 8000,
      "start_date": "2023-01-15",
      "end_date": null,
      "status": "active",
      "created_at": "2023-01-15T00:00:00Z",
      "updated_at": "2024-03-01T00:00:00Z"
    }
  ]
}
```

### POST /employees
Create a new employee.

### PUT /employees/{id}
Update an employee.

### DELETE /employees/{id}
Delete an employee.

---

## Salary History API

### GET /salary-history
Get all salary history records.

### GET /salary-history/employee/{employeeId}
Get salary history for a specific employee.

### POST /salary-history
Create a new salary history record.

### PUT /salary-history/{id}
Update a salary history record.

### DELETE /salary-history/{id}
Delete a salary history record.

---

## Financial Reports API

### GET /financial/performance
Get financial performance data.

**Query Parameters:**
- `start_date` (optional): Start date filter
- `end_date` (optional): End date filter

**Response:**
```json
{
  "data": [
    {
      "period": "2024-03",
      "net_income": 32000,
      "total_assets": 800000,
      "total_equity": 540000,
      "operating_income": 38000,
      "ebitda": 42000,
      "revenue": 95000,
      "gross_profit": 70000,
      "interest_expense": 2000,
      "tax_expense": 6000,
      "depreciation_amortization": 5000
    }
  ]
}
```

### GET /financial/balance-sheet
Get balance sheet data.

### GET /financial/cash-conversion
Get cash conversion cycle data.

### GET /financial/ratios
Get financial ratios.

### GET /financial/dupont-analysis
Get DuPont analysis.

### GET /financial/valuation
Get valuation inputs.

### PUT /financial/valuation
Update valuation inputs.

### POST /financial/forecasting
Get financial forecasting.

**Request Body:**
```json
{
  "period_months": 12,
  "growth_rate": 0.15,
  "assumptions": {
    "revenue_growth": 0.15,
    "expense_growth": 0.10
  }
}
```

**Response:**
```json
{
  "periods": ["2024-04", "2024-05", "2024-06"],
  "revenue_forecast": [109250, 125637, 144483],
  "expense_forecast": [55000, 60500, 66550],
  "net_income_forecast": [54250, 65137, 77933],
  "confidence_interval": {
    "lower": [48825, 58623, 70140],
    "upper": [59675, 71651, 85726]
  }
}
```

---

## Dashboard API

### GET /dashboard/overview
Get dashboard overview data.

### GET /dashboard/metrics
Get key dashboard metrics.

**Response:**
```json
{
  "total_revenue": 95000,
  "total_expenses": 63000,
  "net_income": 32000,
  "profit_margin": 0.34,
  "growth_rate": 0.15,
  "cash_flow": 35000,
  "assets_value": 800000,
  "liabilities_value": 260000,
  "equity_value": 540000
}
```

### GET /dashboard/charts
Get chart data for dashboard.

---

## Analytics API

### GET /analytics/trends
Get trend analysis data.

### GET /analytics/insights
Get analytics insights and recommendations.

**Response:**
```json
{
  "trends": [
    {
      "metric": "Revenue",
      "trend": "up",
      "percentage_change": 15.0,
      "period": "2024-03"
    }
  ],
  "predictions": [
    {
      "metric": "Revenue",
      "predicted_value": 109250,
      "confidence": 0.85,
      "period": "2024-04"
    }
  ],
  "recommendations": [
    {
      "category": "Cost Optimization",
      "title": "Reduce Marketing Spend",
      "description": "Consider reducing marketing spend by 10% to improve margins",
      "priority": "medium",
      "impact": 0.05
    }
  ]
}
```

### GET /analytics/predictions
Get predictive analytics data.

---

## Reports API

### POST /reports/generate
Generate a custom report.

### POST /reports/export
Export report to file.

### GET /reports/templates
Get available report templates.

---

## Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity
- `500` - Internal Server Error

## Rate Limiting

- **Rate Limit**: 1000 requests per hour per IP
- **Headers**:
  - `X-RateLimit-Limit`: Request limit per hour
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time (Unix timestamp)

## Authentication (Future Implementation)

When authentication is implemented, include the following header:

```
Authorization: Bearer <jwt_token>
```

## WebSocket Events (Future Implementation)

For real-time updates:

- `transaction.created`
- `transaction.updated`
- `transaction.deleted`
- `financial_data.updated`
