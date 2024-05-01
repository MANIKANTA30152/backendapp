const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const app = express();
const Routes = require("./routes/route.js");

dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 8082;

// Set the MONGODB_URI environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@cluster0.8jalnto.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Update the connection string as per your MongoDB configuration

app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(cors());

mongoose
    .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.info("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1); // Exit the process if unable to connect to MongoDB
    });

// Define a schema for the data you want to insert
const dataSchema = new mongoose.Schema({
    name: String,
    email: String,
});

// Create a Mongoose model based on the schema
const DataModel = mongoose.model('Data', dataSchema);

// Route handler for /insert endpoint
app.post('/insert', async (req, res) => {
    try {
        // Extract data from the request body
        const { name, email } = req.body;

        // Create a new document using the Mongoose model
        const newData = new DataModel({
            name,
            email,
        });

        // Save the document to the database
        await newData.save();

        // Send a success response to the client
        res.status(200).json({ message: 'Data inserted successfully' });
    } catch (error) {
        // Handle any errors that occur during data insertion
        console.error('Error inserting data:', error);
        res.status(500).json({ error: 'An error occurred while inserting data' });
    }
});

app.use('/', Routes);

app.listen(PORT, () => {
    console.info(`Server started at port no. ${PORT}`);
});
