# Ticker Mind

This is the app that helps in analysing the market, generate automated reports and send news on subscribers' mails about tickers they are subscribed on


## Acknowledgements

 - [NestJS Framework](https://nestjs.com/) - A progressive Node.js framework for building efficient and scalable server-side applications
 - [Prisma ORM](https://www.prisma.io/) - Next-generation ORM for Node.js and TypeScript
 - [React](https://react.dev/) - JavaScript library for building user interfaces
 - [OpenAI API](https://openai.com/) - AI-powered market analysis and report generation


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

### Database
`DATABASE_URL` - PostgreSQL database connection string

### Authentication
`VERIFY_TOKEN_URL` - URL for token verification endpoint

`ALTERNATIVE_AUTH_API_KEY` - API key for alternative authentication service

### External APIs
`GROQ_API_KEY` - Groq API key for AI-powered report generation

`NEWSDATA_API_KEY` - NewsData.io API key for fetching market news

`NEWSDATA_API_URL` - NewsData.io API base URL

### Email Service (Brevo)
`BREVO_API_KEY` - Brevo API key for sending emails

`BREVO_API_URL` - Brevo API base URL

`BREVO_SENDER_EMAIL` - Email address for sending notifications

### Application
`PORT` - Server port (default: 3000)

`NODE_ENV` - Environment mode (development/production)


## API Reference

All authenticated endpoints require a valid JWT token in the Authorization header.

## Usage Examples

### Start the Application

```bash
npm install
npm run start:dev
```

### Example: Get All Watchlists

```http
GET /api/watchlist
Authorization: Bearer <your_token>
```

### Example: Create a Report

```http
POST /api/report
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "title": "Weekly Market Overview",
  <!-- Either tickers or watchlistId must be provided -->
  "tickers": ["AAPL", "GOOGL"],
  "watchlistId": "your_watchlist_id"
}
```

### Example: Add Ticker to Watchlist

```http
POST /api/watchlist/{id}/tickers
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "ticker": "MSFT"
}
```

### Subscriber

#### Get current subscriber

```http
  GET /api/subscriber/me
```

| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

#### Get subscriber by ID

```http
  GET /api/subscriber/${id}
```

| Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `id` | `string` | **Required**. ID of subscriber to fetch |

#### Create subscriber

```http
  POST /api/subscriber
```

| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

| Body Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `displayName` | `string` | *Optional*. Display name (max 100 chars) |

#### Update subscriber

```http
  PATCH /api/subscriber
```

| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

| Body Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `displayName` | `string` | *Optional*. Updated display name |

#### Delete subscriber

```http
  DELETE /api/subscriber
```

| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

---

### Watchlist

All watchlist endpoints require authentication.

#### Get all watchlists

```http
  GET /api/watchlist
```

| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

#### Get watchlist by ID

```http
  GET /api/watchlist/${id}
```

| Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `id` | `string` | **Required**. ID of watchlist to fetch |

| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

#### Create watchlist

```http
  POST /api/watchlist
```

| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

| Body Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `name` | `string` | **Required**. Watchlist name (2-50 chars) |

#### Update watchlist

```http
  PUT /api/watchlist/${id}
```

| Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `id` | `string` | **Required**. ID of watchlist to update |

| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

| Body Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `name` | `string` | **Required**. Updated watchlist name (2-50 chars) |

#### Add ticker to watchlist

```http
  POST /api/watchlist/${id}/tickers
```

| Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `id` | `string` | **Required**. ID of watchlist |

| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

| Body Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `ticker` | `string` | **Required**. Ticker symbol (uppercase, max 10 chars) |

#### Remove ticker from watchlist

```http
  DELETE /api/watchlist/${id}/tickers
```

| Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `id` | `string` | **Required**. ID of watchlist |

| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

| Body Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `ticker` | `string` | **Required**. Ticker symbol to remove |

#### Delete watchlist

```http
  DELETE /api/watchlist/${id}
```

| Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `id` | `string` | **Required**. ID of watchlist to delete |

| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

---

### Market

#### Get market data

```http
  GET /api/market?ticker=${ticker}
```

Retrieves cached market data from database (fast).

| Query Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `ticker` | `string` | **Required**. Stock ticker symbol |

#### Sync market data

```http
  POST /api/market/sync?ticker=${ticker}
```

Fetches fresh data from external API and saves to database (slow, deliberate).

| Query Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `ticker` | `string` | **Required**. Stock ticker symbol |

---

### Notification

All notification endpoints require authentication.

#### Get all notifications

```http
  GET /api/notification
```

| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

#### Get notification by ID

```http
  GET /api/notification/${id}
```

| Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `id` | `string` | **Required**. ID of notification to fetch |

| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

#### Create notification

```http
  POST /api/notification
```

| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

| Body Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `title` | `string` | **Required**. Notification title |
| `message` | `string` | **Required**. Notification message |
| `tickers` | `string[]` | *Optional*. Array of ticker symbols if no watchlistId is provided |
| `watchlistId` | `string` | *Optional*. Associated watchlist ID if no tickers are provided |

#### Update notification

```http
  PATCH /api/notification/${id}
```

| Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `id` | `string` | **Required**. ID of notification to update |

| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

| Body Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `title` | `string` | *Optional*. Updated title |
| `message` | `string` | *Optional*. Updated message |
| `tickers` | `string[]` | *Optional*. Updated array of tickers |

#### Delete notification

```http
  DELETE /api/notification/${id}
```

| Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `id` | `string` | **Required**. ID of notification to delete |

| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

---

### Report

All report endpoints require authentication.

#### Get all reports

```http
  GET /api/report
```

| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

#### Get report by ID

```http
  GET /api/report/${id}
```

| Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `id` | `string` | **Required**. ID of report to fetch |

| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

#### Create report

```http
  POST /api/report
```

| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

| Body Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `title` | `string` | **Required**. Report title |
| `tickers` | `string[]` | *Optional*. Array of ticker symbols if no watchlistId is provided |
| `watchlistId` | `string` | *Optional*. Associated watchlist ID if no tickers are provided |

#### Update report

```http
  PATCH /api/report/${id}
```

| Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `id` | `string` | **Required**. ID of report to update |

| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

| Body Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `title` | `string` | **Required**. Updated report title |
| `tickers` | `string[]` | *Optional*. Updated array of tickers |

#### Delete report

```http
  DELETE /api/report/${id}
```

| Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `id` | `string` | **Required**. ID of report to delete |

| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

---

## Appendix

### Authentication
All authenticated endpoints require a valid JWT token obtained from your authentication provider. Include the token in the Authorization header as: `Bearer <your_token>`

### Rate Limiting
API endpoints are cached for 300 seconds (5 minutes) to optimize performance and reduce database load.

### Ticker Symbol Format
Ticker symbols must be uppercase letters/numbers (A-Z, 0-9) and up to 10 characters long. Examples: `AAPL`, `GOOGL`, `MSFT`

### Error Handling
The API returns standard HTTP status codes:
- `200 OK` - Successful GET/PATCH requests
- `201 Created` - Successful POST requests
- `204 No Content` - Successful DELETE requests
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `404 Not Found` - Resource not found


## Authors

- [@yuriy-kulakovskyi](https://www.github.com/yuriy-kulakovskyi)
