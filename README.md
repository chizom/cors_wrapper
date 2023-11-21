Certainly! Here's an updated README documentation considering your `package.json` configuration:

---

# CORS Proxy Server

This Node.js application acts as a CORS-enabled proxy server using Express. It's designed to forward HTTP requests to external APIs. The server is configured with Axios for making HTTP requests, and it supports automatic reloading during development using Nodemon.

## Installation

Make sure you have Node.js and npm installed. Install the required dependencies using the following command:

```bash
npm install
```

## Usage

### 1. Start the Development Server

For development, use the following command to start the server with automatic reloading:

```bash
npm run devStart
```

The server will be running at `http://localhost:3000`.

### 2. Start the Production Server

For production, use the following command:

```bash
npm start
```

### 3. Make a Request

Send a POST request to `http://localhost:3000` with the following JSON body:

```json
{
  "url": "https://api.example.com/endpoint",
  "method": "GET", // or "POST", "PUT", etc.
  "bodyParam": {
    "key": "value"
    // Additional request body parameters
  },
  "headers": {
    "Content-Type": "application/json",
    // Additional headers
  }
}
```

### 4. Response

The route will forward the request to the specified URL and respond with the data received from the external API.

### Notes

- If `bodyParam` is not provided, it defaults to an empty object.
- The server uses CORS middleware to handle Cross-Origin Resource Sharing.
- Ensure that necessary dependencies are installed (`axios`, `body-parser`, `cors`, `express`, `request`, `vercel`).

## Dependencies

- [Express](https://expressjs.com/)
- [Axios](https://axios-http.com/)
- [Body Parser](https://www.npmjs.com/package/body-parser)
- [CORS](https://www.npmjs.com/package/cors)
- [Request](https://www.npmjs.com/package/request)
- [Vercel](https://www.npmjs.com/package/vercel)

## Development Dependencies

- [Nodemon](https://www.npmjs.com/package/nodemon)

---

