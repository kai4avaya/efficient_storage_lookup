import express from 'express';
import fs from 'fs';
import path from 'path';
import {addDocumentToLunr, searchTopKDocuments} from './db.js'
import {addDocumentToFlexSearch, searchDocumentsFlex,searchDocumentsFlex_doc,  addDocumentsToFlexSearch_doc} from './db_flex.js'
import cors from 'cors';
const app = express();
const PORT = 3002;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());
app.post('/api/populate_index', (req, res) => {
    const filePath = path.join(path.resolve(), 'backend/data/split_and_processed_data.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Failed to read file:", err);
            return res.status(500).json({ error: "Failed to read file" });
        }

        try {
            const jsonData = JSON.parse(data);
            jsonData.forEach(doc => {
                addDocumentToLunr(doc.url, doc.text); // Assuming each document has 'url' and 'text'
            });
            res.status(200).json({ message: "Index populated successfully" });
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            res.status(500).json({ error: "Error parsing JSON" });
        }
    });
});
app.post('/api/query', (req, res) => {
    if (!req.body.query) {
        return res.status(400).json({ error: "No query provided" });
    }

    const results = searchTopKDocuments(req.body.query, req.body.limit || 5);
    res.json(results);
});



// Endpoint to add a document to the index
app.post('/api/add_document', (req, res) => {
    const { url, text } = req.body;
    if (!url || !text) {
        return res.status(400).json({ error: "URL and text are required." });
    }

    try {
        const doc = addDocument(url, text);
        res.status(201).json({ message: "Document added successfully", document: doc });
    } catch (error) {
        console.error("Error adding document:", error);
        res.status(500).json({ error: "Failed to add document" });
    }
});

// Endpoint to search the index
app.post('/api/search', (req, res) => {
    const { query, limit } = req.body;
    if (!query) {
        return res.status(400).json({ error: "Query is required." });
    }

    try {
        const results = searchDocuments(query, limit);
        res.json(results);
    } catch (error) {
        console.error("Error searching documents:", error);
        res.status(500).json({ error: "Failed to search documents" });
    }
});




// Function to process data in batches
function processBatch(data, batchSize = 500) {
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        addDocumentsToFlexSearch_doc(batch);
    }
}

app.post('/api/populate_index_flex_docs', async (req, res) => {
    // const filePath = path.join(__dirname, 'data', 'split_and_processed_data.json');  // Adjust the path as needed
    const filePath = path.join(path.resolve(), 'backend/data/split_and_processed_data.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Failed to read file:", err);
            return res.status(500).json({ error: "Failed to read file" });
        }

        try {
            const jsonData = JSON.parse(data);
            processBatch(jsonData);  // Process data in batches
            res.status(200).json({ message: "Index populated successfully" });
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            res.status(500).json({ error: "Error parsing JSON" });
        }
    });
});


// Endpoint to search the index
app.post('/api/search_flex_docs', (req, res) => {
    const { query, limit } = req.body;
    if (!query) {
        return res.status(400).json({ error: "Query is required." });
    }

    try {
        const results = searchDocumentsFlex_doc(query, limit);
        console.log("i am results", results)
        res.json(results);
    } catch (error) {
        console.error("Error searching documents:", error);
        res.status(500).json({ error: "Failed to search documents" });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
