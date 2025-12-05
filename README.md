# ShopShop GmbH - Backend

Backend server for an online shop, built with Node.js/Express.js and MariaDB as part of my vocational training as a Fachinformatikerin für Anwendungsentwicklung (FIAE). The project is built upholding IHK guidelines and part of my final project for the module Dynamic Webdevelopment. 

**Author**: Gracia Kleijnen

[Visit the live store](http://kleijnen.fi38.j23d.de/) or [view the frontend repository](https://github.com/FI-38/Frontend-OnlineShop-Kleijnen).

## Tech Stack

![Express](https://img.shields.io/badge/Backend-Express-000000?logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Runtime-Node.js-339933?logo=node.js&logoColor=white)
![MariaDB](https://img.shields.io/badge/Database-MariaDB-003545?logo=mariadb&logoColor=white)
![GitHub](https://img.shields.io/badge/Version%20Control-GitHub-181717?logo=github&logoColor=white)

## Features

- User authorization with JWT, bcrypt, CORS
- Upload, edit or delete products
- MariaDB database connection
- dotenv support
- Version control with Git & GitHub

## Setup

1. Install dependencies
```bash 
cd backend
npm install
```

2. Create .env file

```bash 
# MariaDB-Konfigurationsdetails 
DB_HOST="localhost"
DB_PORT=3306
DB_USER="YOUR_USER"
DB_PASSWORD="YOUR_PASSWORD"
DB_DATABASE="fi38_kleijnen_fpadw"
 
# JWT Secret Key für die Token-Authentifizierung
JWT_SECRET_KEY="GENERATE_YOUR_OWN_SAFE_RANDOM_STRING"
 
# Port der Anwendung
PORT=3001

# Host der React-App
# HOST="http://localhost:5173"
HOST="http://fi.mshome.net:5173"
 
```

3. Create database

Connect to MariaDB:
```bash
mariadb -u YOURUSER -p
```

4. Run following scripts

```sql
CREATE DATABASE IF NOT EXISTS fi38_kleijnen_fpadw;
USE fi38_kleijnen_fpadw;


CREATE TABLE user (
  userID INT(11) NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(100),
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  rolle ENUM("user", "admin") NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (userID)
);


CREATE TABLE product (
  productID INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(200) NOT NULL,
  product_description VARCHAR(2000) NOT NULL,
  product_price DECIMAL(6,2) NOT NULL,
  product_img_path VARCHAR(255) NOT NULL
);

```
### Changing admin rights

Register a new user. Change the 'rolle' to 'admin' inside the database to test admin rights on the Products page.
```sql
UPDATE user SET rolle = 'admin' WHERE id = 1;

``` 

## Scripts to start the server
```bash
npm start        # runs index.js
npm run dev      # runs nodemon server.js
```
Server runs on: ``` http://YOUR-SERVER-ADDRESS:5173```


## API overview

#### User

#### Login & Register
- ```POST /api/login``` - Login
- ```POST /api/register``` - Register

#### Products
- ```GET /api/products``` - Get products 
- ```GET /api/products:id``` - Get product by ID

#### Profile
- ```GET /api/profile``` - View profile 

### Admin
- ```POST /api/upload``` - Upload product 
- ```PUT /api/products:id``` - Update product by ID
- ```DELETE /api/products```  - Delete product by ID  

## Project structure
```bash
BACKEND/
├── middleware/
│   ├── auth.js
│   ├── checkAdmin.js
│   └── upload.js
├── routes/
│   ├── login.js
│   ├── products.js
│   ├── profile.js
│   ├── register.js
│   └── upload.js
├── uploads/
├── .env
├── .env.example
├── .gitignore
├── db.js
├── index.js
├── package-lock.json
├── package.json
├── README.md
└── server.js
```