import upload from "./../middleware/upload.js";
import { pool } from "./../db.js";

export default [ upload.single('image'), async (req, res) => {
    try {
      const { product_title, description, price } = req.body;
      console.log('here is the requst body', req.body)
      console.log(product_title, description, price);
      const file = req.file;

      const conn = await pool.getConnection();

      const result = await conn.query(
        "INSERT INTO product (product_name, product_description, product_price, product_img_path) VALUES (?, ?, ?, ?)",
        [product_title, description, price, file.filename]
      );
      conn.release();

      res.json({ success: true, 
                productID: result.insertId });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Server error when adding product" });
    }
  }];
