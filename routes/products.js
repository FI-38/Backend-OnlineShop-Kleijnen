import { pool } from "../db.js";

// GET all products
export const getAllProducts = async (req, res) => {
    let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("SELECT * FROM product");
            res.json(rows);
            console.log('WE ARE ROWSSSSSSSSSSSSSSSS', rows)
        } catch (err) {
            res.status(500).json({ error: "Server error when getting all products." });
        } finally {
            conn.release();
        }
        };

// UPDATE product
export const updateProduct = async (req, res) => {
    let conn;
    const { id } = req.params;
    const { product_name, product_description, product_price } = req.body;
    // ADD IMAGE
    try {
        conn = await pool.getConnection();
        await conn.query(
            "UPDATE product SET product_name = ?, product_description = ?, product_price = ? WHERE productID = ?",
            [product_name, product_description, product_price, id]
         );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    } finally {
        conn.release();
    }
};

// DELETE product
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    let conn;

    try {
    conn = await pool.getConnection();
    await conn.query("DELETE FROM product WHERE productID = ?", [id]);
    res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    } finally {
        conn.release();
    }
};