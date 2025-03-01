import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import csv from 'csv-parser'; // Ensure you have this package installed
import fs from 'fs';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
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
    name: String,
    price: Number,
    quantity: Number,
    discount: Number,
    discounted_price: Number,
    rating: Number,
    quantity_ordered: Number,
    unit: String,
    barcode: String,
    avail: Boolean,
    codenum: String,
    category: String,
    imageURL: String,
    dow: Boolean
});

// Admin schema
const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
});

// Transaction Schema
const transactionSchema = new mongoose.Schema({
    transactionId: { type: String, required: true },
    products: [{ 
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        price: Number,
        discounted_price: Number,
    }],
    totalAmount: Number,
    paymentMethod: String, // e.g., 'credit_card', 'cash_on_delivery'
    createdAt: { type: Date, default: Date.now },
});


const Product = mongoose.model('Product', productSchema, 'productlist');
const Admin = mongoose.model("Admin", adminSchema, 'admin');
const Transaction = mongoose.model('Transaction', transactionSchema, 'transactions');


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

// Middleware to protect routes
const authenticate = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).send("A token is required for authentication");

    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send("Invalid Token");
        req.user = decoded; // Store the decoded token in the request object
        next(); // Proceed to the next middleware or route handler
    });
};

// Protected admin route
app.get("/api/admin", authenticate, (req, res) => {
    res.send("Welcome to the admin dashboard!");
});

// Add Products (Single or Multiple)
app.post('/api/products', async (req, res) => {
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

// Get All Products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Products by Category (Supports Multiple Categories)
app.get('/api/products/category/:category', async (req, res) => {
    try {
        const categories = req.params.category.split(',');
        const products = await Product.find({ category: { $in: categories } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Products (Single or Multiple)
app.put('/api/products', async (req, res) => {
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
app.delete('/api/products', async (req, res) => {
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

// Endpoint to handle CSV upload
app.post('/api/products/upload', upload.single('file'), async (req, res) => {
    const results = [];

    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read the CSV file and convert it to JSON
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
            console.log("Raw data:", data); // Log the raw data
            data.avail = data.avail === "true" || data.avail === "TRUE" || data.avail === "Yes";
            data.dow = data.dow === "true" || data.dow === "TRUE" || data.dow === "Yes";
            console.log("Parsed data:", data); // Log the parsed data
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

// Endpoint to handle transactions
app.post('/api/transactions', async (req, res) => {
    const transactions = req.body; // Expecting an array of transactions

    try {
        if (!Array.isArray(transactions) || transactions.length === 0) {
            return res.status(400).json({ message: "Invalid data format. Expected an array of transactions." });
        }

        const transactionsToInsert = transactions.map(transaction => ({
            transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, // Unique ID for each
            products: transaction.products,
            totalAmount: transaction.products.reduce((total, product) => {
                return total + (product.discounted_price || product.price) * product.quantity;
            }, 0),
            paymentMethod: transaction.paymentMethod,
        }));

        const savedTransactions = await Transaction.insertMany(transactionsToInsert);

        res.status(201).json(savedTransactions);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Endpoint to get all transactions
app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('products.productId');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start the server
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));