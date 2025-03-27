import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import csv from 'csv-parser'; // Ensure you have this package installed
import fs from 'fs';
import bcrypt from 'bcrypt';
// import { v4 as uuidv4 } from 'uuid';


dotenv.config();
const app = express();

const corsOptions = {
    origin: ['https://pothys.onrender.com', 'http://localhost:3000', 'http://localhost:3001'], // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    dbName: 'trial',
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files

// Product Schema
const productSchema = new mongoose.Schema({
    brand: String,
    name: String,
    hsn: Number,
    price: Number,
    discount: Number,
    discounted_price: Number,
    quantity: Number,
    unit: String,
    product_feature: String,
    product_tags: String,
    avail: Boolean,
    category: String,
    dow: Boolean,
    imageURL: String,
});

// Admin schema
const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
});

// Transaction Schema
const transactionSchema = new mongoose.Schema({
    transaction_id: { type: String, required: true, unique: true },
    date_time: { type: Date, default: Date.now },
    status: { type: String, enum: ["success", "failure"], required: true },
    payment_method: { type: String, enum: ["UPI", "Cash"], required: true },
    total_amount: { type: Number, required: true },
    delivery_status: {type: String, enum: ["pending", "complete"], required: true},
    cartItems: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            brand: { type: String, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            discount: { type: Number, required: true },
            discounted_price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            unit: { type: String, required: true },
        },
    ],
    customer: {  // Change from array to object
        customer_name: { type: String, required: true },
        phone: { type: Number, required: true },
        address: { type: String, required: true },
    },
});

const Product = mongoose.model('Product', productSchema, 'productlist');
const Admin = mongoose.model("Admin", adminSchema, 'admin');
const Transaction = mongoose.model('Transaction', transactionSchema, 'transactions');

    // AUTH / MIDDLEWARE (IMPORTANT) 

// Fake Admin Credentials (Replace with DB-stored credentials)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync("admin", 10); // Hash the password

const verifyAdmin = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Get token from Bearer

    if (!token) {
      return res.status(403).json({ message: "Access Denied. Contact administrator or login as admin before making changes!" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }
      next(); // Proceed to the actual API route
    } catch (error) {
      res.status(400).json({ message: "Invalid Token" });
    }
};

// Example protected route
app.get("/api/admin/protected", (req, res) => {
  res.json({ message: "Welcome to the admin area!" });
});

// API Routes
app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log("Received username:", username);
        console.log("Received password:", password);

        // Find the admin by username
        const admin = await Admin.findOne({ username });
        if (!admin) {
            console.log("Admin not found");
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Compare plain text password directly
        if (admin.password !== password) {
            console.log("Password does not match");
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        
        

        // Generate a token
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ success: true, token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


// Add Products (Single or Multiple)
app.post('/api/products', verifyAdmin, async (req, res) => {
    try {
        if (Array.isArray(req.body)) {
            const products = await Product.insertMany(req.body);
            res.status(201).json(products);
        } else {
            const product = new Product(req.body);
            await product.save();
            res.status(201).json(product);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get All Products with optional search
app.get('/api/products', async (req, res) => {
    const searchTerm = req.query.search || '';
    try {
        const products = await Product.find({
            name: { $regex: searchTerm, $options: 'i' } // Case-insensitive search
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Products by Category
app.get('/api/products/category/:category', async (req, res) => {
    try {
        const category = req.params.category; // Decode safely

        const products = await Product.find({ category: category });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/products/hsn/:hsn', async (req, res) => {
    try {
        const hsn = req.params.hsn;

        const products = await Product.find({hsn: hsn});

        // Check if any products were found
        if (products.length > 0) {
            res.json(products);
        } else {
            res.status(404).json({ message: 'No products found with this HSN number.' });
        }
        
        } catch (error) {
        res.status(500).json({message: error.message});
    }
})

// Get Products with dow = true
app.get('/api/products/dow-true', async (req, res) => {
    try {
        const products = await Product.find({ dow: true });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Products (Single or Multiple)
app.put('/api/products', verifyAdmin, async (req, res) => {
    try {
        if (Array.isArray(req.body)) {
            const updatedProducts = await Promise.all(
                req.body.map(product =>
                    Product.findByIdAndUpdate(product._id, product, { new: true })
                )
            );
            res.json(updatedProducts);
        } else {
            const updatedProduct = await Product.findByIdAndUpdate(req.body._id, req.body, { new: true });
            res.json(updatedProduct);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete Products (Single or Multiple or Clear All)
app.delete('/api/products', verifyAdmin, async (req, res) => {
    try {
        // Check if the request body contains a flag to clear all products
        if (req.body.clearAll) {
            // Clear all products
            await Product.deleteMany({});
            return res.json({ message: 'All products cleared' });
        }

        // Check if the request body contains an array of IDs
        if (Array.isArray(req.body)) {
            // Use deleteMany to remove products with the specified IDs
            await Product.deleteMany({ _id: { $in: req.body } });
            return res.json({ message: 'Products deleted' });
        } else {
            // If a single ID is provided, delete that product
            await Product.findByIdAndDelete(req.body._id);
            return res.json({ message: 'Product deleted' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// CSV DATA UPLOAD API
app.post('/api/products/upload', verifyAdmin,  upload.single('file'), async (req, res) => {
    const results = [];

    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read the CSV file and convert it to JSON
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
            data.avail = data.avail === "true" || data.avail === "TRUE" || data.avail === "Yes";
            data.dow = data.dow === "true" || data.dow === "TRUE" || data.dow === "Yes";
            results.push(data);
        })
        .on('end', async () => {
            try {
                await Product.insertMany(results); // Bulk insert into the database
                res.status(200).json({ message: 'Products added successfully', data: results });
            } catch (error) {
                console.error("Error saving products:", error);
                res.status(500).json({ message: 'Error saving products', error });
            } finally {
                fs.unlinkSync(req.file.path); // Delete the temporary file
            }
        })
        .on('error', (error) => {
            console.error("Error reading CSV file:", error);
            res.status(500).json({ message: 'Error reading CSV file', error });
        });
});


// -------------------- TRANSACTION SECTION ---------------------------

// TRANSACTION POSTING APIS
app.post("/api/transactions", async (req, res) => {
    try {
        const { cartItems, total_amount, payment_method, customer } = req.body;

        // Generate a unique transaction ID
        const transaction_id = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;

        // Create a new transaction entry
        const newTransaction = new Transaction({
            transaction_id,
            cartItems,  // ✅ Storing cart items inside transaction
            total_amount,
            payment_method: "UPI", // Since you're not integrating a payment gateway yet
            customer,
            status: "success"
        });

        await newTransaction.save();

        res.status(201).json({ success: true, transaction_id, message: "Transaction recorded successfully." });
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});


// TRANSACTION DATA FETCHING APIS
app.get("/api/transactions", verifyAdmin, async (req, res) => {
    try {
        const { transaction_id } = req.query; // Get transaction_id from query params

        if (transaction_id) {
            // Fetch a single transaction if transaction_id is provided
            const transaction = await Transaction.findOne({ transaction_id });

            if (!transaction) {
                return res.status(404).json({ success: false, message: "Transaction not found" });
            }

            return res.status(200).json({ success: true, transaction });
        }

        // If no transaction_id is provided, fetch all transactions
        const transactions = await Transaction.find();
        res.status(200).json({ success: true, transactions });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching transactions", error: error.message });
    }
});

//
app.get("/api/transactions?delivery_status=pending", verifyAdmin, async (req, res) => {
    try {
        const { transaction_id } = req.query; // Get transaction_id from query params

        if (transaction_id) {
            // Fetch a single transaction if transaction_id is provided
            const transaction = await Transaction.findOne({ transaction_id, delivery_status: "pending" });

            if (!transaction) {
                return res.status(404).json({ success: false, message: "Transaction not found" });
            }

            return res.status(200).json({ success: true, transaction });
        }

        // If no transaction_id is provided, fetch all transactions
        const transactions = await Transaction.find({ delivery_status: "pending" });
        res.status(200).json({ success: true, transactions });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching pending transactions", error: error.message });
    }
});

//
app.get("/api/transactions?delivery_status=complete", verifyAdmin, async (req, res) => {
    try {
        const { transaction_id } = req.query; // Get transaction_id from query params

        if (transaction_id) {
            // Fetch a single transaction if transaction_id is provided
            const transaction = await Transaction.findOne({ transaction_id, delivery_status: "complete" });

            if (!transaction) {
                return res.status(404).json({ success: false, message: "Transaction not found" });
            }

            return res.status(200).json({ success: true, transaction });
        }

        // If no transaction_id is provided, fetch all transactions
        const transactions = await Transaction.find({ delivery_status: "complete" });
        res.status(200).json({ success: true, transactions });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching complete transactions", error: error.message });
    }
});

// Start the server
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));