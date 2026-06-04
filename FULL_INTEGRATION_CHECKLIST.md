# VRS Full Integration Verification Checklist

## MONGODB BACKEND (Port 5001)

### Authentication Routes ✓

- POST `/api/auth/register` → authController.register()
  - Input: { username, password, role }
  - Output: 201 + message
- POST `/api/auth/login` → authController.login()
  - Input: { username, password }
  - Output: 200 + user object + cookie
- POST `/api/auth/logout` → authController.logout()
  - Output: 200 + clears cookie

### Customers Routes (Protected) ✓

- GET `/api/customers?search=xxx` → getAllCustomers()
  - Regex search on fullName, email, phone
  - Returns: Array of customers with camelCase fields
- GET `/api/customers/:id` → getCustomerById()
  - Returns: Single customer object
- POST `/api/customers` → createCustomer()
  - Accepts: full_name OR fullName, national_id OR nationalID, phone, email, address
  - Returns: 201 + customer object
- PUT `/api/customers/:id` → updateCustomer()
  - Accepts: full_name OR fullName, national_id OR nationalID, phone, email, address
  - Returns: 200 + updated customer
- DELETE `/api/customers/:id` → deleteCustomer()
  - Returns: 200 + message

### Vehicles Routes (Protected) ✓

- GET `/api/vehicles?search=xxx&status=xxx` → getAllVehicles()
  - Regex search on plateNumber, brand, model
  - Optional status filter
  - Returns: Array of vehicles with camelCase fields
- GET `/api/vehicles/plate/:plate` → getVehicleByPlate()
  - Returns: Single vehicle by plate number
- POST `/api/vehicles` → createVehicle()
  - Accepts: plate_number OR plateNumber, brand, model, year, vehicle_type, purchase_price, status
  - Returns: 201 + vehicle object
- PUT `/api/vehicles/:plate` → updateVehicle() ⭐ NOW USES PLATE
  - Route param: plate (not id!)
  - Accepts: brand, model, year, vehicle_type, purchase_price, status
  - Returns: 200 + updated vehicle
- DELETE `/api/vehicles/:plate` → deleteVehicle() ⭐ NOW USES PLATE
  - Route param: plate (not id!)
  - Returns: 200 + message

### Reservations Routes (Protected) ✓

- GET `/api/reservations?customerID=x&status=x&dateFrom=x&dateTo=x` → getAllReservations()
  - Returns: Array with populated customer, vehicle, user
  - Response fields: snake_case (Reservation_Date, Rental_Status, etc)
- GET `/api/reservations/:id` → getReservationById()
  - Returns: Single reservation with populated refs
- POST `/api/reservations` → createReservation()
  - Accepts: customerID, plateNumber, startDate, endDate
  - Returns: 201 + reservation
- PUT `/api/reservations/:id` → updateReservation()
  - Accepts: reservation_status OR reservationStatus, rental_status, rental_date, return_date, rental_fee
  - Returns: 200 + updated reservation
- DELETE `/api/reservations/:id` → deleteReservation()
  - Returns: 200 + message
- GET `/api/reservations/report/all` → getReport() ⭐ MUST BE BEFORE /:id
  - Returns: Array of reservations with selected fields
  - Route ordering: /report/all BEFORE /:id to avoid collision

---

## MYSQL BACKEND (Port 5000)

### Authentication Routes ✓

- Same as MongoDB (identical authController)

### Customers Routes (Protected) ✓

- GET `/api/customers?search=xxx` → getAllCustomers()
  - LIKE search on Full_Name, Email, Phone
  - Returns: Array with snake_case fields
- GET `/api/customers/:id` → getCustomerById()
  - Returns: Single customer
- POST `/api/customers` → createCustomer()
  - Accepts: full_name, national_id, phone, email, address
  - Returns: 201 + message
- PUT `/api/customers/:id` → updateCustomer()
  - Accepts: full_name, national_id, phone, email, address
  - Returns: 200 + message
- DELETE `/api/customers/:id` → deleteCustomer()
  - Returns: 200 + message

### Vehicles Routes (Protected) ✓

- GET `/api/vehicles?search=xxx&status=xxx` → getAllVehicles()
  - LIKE search on Plate_Number, Brand, Model
  - Returns: Array with snake_case fields
- GET `/api/vehicles/:plate` → getVehicleByPlate()
  - Returns: Single vehicle
- POST `/api/vehicles` → createVehicle()
  - Accepts: plate_number, brand, model, year, vehicle_type, purchase_price, status
  - Returns: 201 + message
- PUT `/api/vehicles/:plate` → updateVehicle()
  - Route param: plate
  - Returns: 200 + message
- DELETE `/api/vehicles/:plate` → deleteVehicle()
  - Route param: plate
  - Returns: 200 + message

### Reservations Routes (Protected) ✓

- GET `/api/reservations?customerID=x&status=x&dateFrom=x&dateTo=x` → getAllReservations()
  - LEFT JOINs with Customers, Vehicles, Users
  - Returns: Array with snake_case fields
- GET `/api/reservations/:id` → getReservationById()
  - Returns: Single reservation with JOINs
- POST `/api/reservations` → createReservation()
  - Accepts: customerID, plateNumber, startDate, endDate
  - Returns: 201 + message
- PUT `/api/reservations/:id` → updateReservation()
  - Accepts: reservation_status, rental_status, rental_date, return_date, rental_fee
  - Returns: 200 + message
- DELETE `/api/reservations/:id` → deleteReservation()
  - Returns: 200 + message
- GET `/api/reservations/report/all` → getReport()
  - Returns: Report data with selected fields

---

## FRONTEND INTEGRATION ✓

### Configuration

- Default API URL: `http://localhost:5000` (MySQL backend)
- To use MongoDB: Change frontend/.env to `VITE_API_URL=http://localhost:5001`

### All Pages Support Both Backends

- Login page: Works with both (uses authAPI)
- Dashboard: Works with both (navigation only)
- Customers page: Accepts both camelCase and snake_case from API
- Vehicles page: Accepts both camelCase and snake_case from API
- Reservations page: Handles both camelCase and snake_case with `||` operators
- Report page: Handles both camelCase and snake_case with `||` operators

### Field Name Handling

Frontend sends:

- Customers: full_name, national_id (snake_case)
- Vehicles: plate_number, vehicle_type, purchase_price (snake_case)
- Reservations create: customerID, plateNumber, startDate, endDate (camelCase)
- Reservations update: reservation_status, rental_status, rental_date, return_date, rental_fee (snake_case)

Both backends handle this:

- MongoDB: Accepts both formats (updated controllers)
- MySQL: Expects these formats natively

---

## CRITICAL FIXES APPLIED

### ✅ Route File Cleanup

- Removed corrupted leftover code from all MongoDB route files
- Verified MySQL route files are clean
- All routes have proper export statements

### ✅ Vehicle Route Parameters

- MongoDB now uses `/:plate` for update/delete (was `/:id`)
- Uses `findOneAndUpdate/Delete({ plateNumber })` instead of ID
- Matches frontend expectation (sends plate number as ID)

### ✅ Field Name Support

- All MongoDB controllers now accept both formats
- No need to change frontend or MySQL backend

### ✅ Database Auto-Initialization

- MySQL now auto-creates database and all tables on startup
- No manual SQL execution needed
- Uses `getPool()` lazy initialization pattern

---

## CRUD OPERATIONS VERIFICATION

### CREATE Operations ✓

- **Customers**: POST /api/customers with full_name, national_id, phone, email → creates in DB
- **Vehicles**: POST /api/vehicles with plate_number, brand, model, year → creates in DB
- **Reservations**: POST /api/reservations with customerID, plateNumber, startDate, endDate → creates in DB
- **Auth**: POST /api/auth/register with username, password, role → creates user

### READ Operations ✓

- **GET All**: Returns filtered/searchable lists
- **GET One**: Returns single record by ID or plate
- **Search**: Works with LIKE (MySQL) or regex (MongoDB)
- **Relationships**: Properly populated/joined

### UPDATE Operations ✓

- **Customers**: PUT with updated fields
- **Vehicles**: PUT with plate in URL
- **Reservations**: PUT with status/date updates
- **Field names**: Both formats supported

### DELETE Operations ✓

- **Customers**: DELETE with ID
- **Vehicles**: DELETE with plate
- **Reservations**: DELETE with ID
- **Returns**: Success message

---

## AUTHENTICATION FLOW ✓

1. Register: Creates user with hashed password
2. Login: Validates password, returns JWT token in httpOnly cookie
3. Protected Routes: verifyToken middleware checks cookie
4. Logout: Clears cookie
5. Token Expiry: 7 days
6. Security: httpOnly, secure (prod), sameSite strict

---

## TESTING INSTRUCTIONS

### Start MongoDB Backend:

```bash
cd backend
npm i  # if needed
node server.js
# Should see: MongoDB connected, listening on port 5001
```

### Start MySQL Backend:

```bash
cd backend-mysql
npm i  # if needed
node server.js
# Should see: Database initialized, pool created, listening on port 5000
# MySQL database auto-creates on first run
```

### Start Frontend:

```bash
cd frontend
npm i  # if needed
npm run dev
# Should see: Vite dev server on http://localhost:5173
```

### Test Workflow:

1. Register a new user
2. Login
3. Create a customer
4. Create a vehicle
5. Create a reservation
6. Update reservation status
7. View report
8. Test search/filter on all pages
9. Verify CRUD operations work

---

## KNOWN CONFIGURATIONS

### Port Mapping

- Frontend: 5173 (Vite dev server)
- MongoDB Backend: 5001
- MySQL Backend: 5000
- Frontend .env default: localhost:5000 (MySQL)

### Database Setup

- MongoDB: Auto-connects via Mongoose
- MySQL: Auto-creates on startup, uses `initializeDatabase()` function

### Authentication

- Both backends: JWT in httpOnly cookies
- Same JWT_SECRET in .env files
- 7-day token expiration
- verifyToken middleware on all protected routes

### Response Format

- MongoDB: camelCase in responses
- MySQL: snake_case in responses
- Frontend: Handles both with fallback operators
