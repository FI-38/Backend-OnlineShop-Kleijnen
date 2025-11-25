CREATE TABLE product (
  productID INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(100) NOT NULL,
  product_description VARCHAR(500) NOT NULL,
  product_price VARCHAR(10) NOT NULL,
  product_img_path VARCHAR(255) NOT NULL
);
