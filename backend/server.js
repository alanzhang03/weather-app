const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config({ path: "../.env" });

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

const MONGO_DB_USERNAME = process.env.MONGO_DB_USERNAME;
const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
const MONGO_COLLECTION = process.env.MONGO_COLLECTION;

const uri = `mongodb+srv://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@cluster0.fa2ec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

app.get("/", (req, res) => {
	res.send("<h1>Welcome to the Weather App Backend</h1>");
});

app.post("/storeWeather", async (req, res) => {
	const client = new MongoClient(uri);

	try {
		await client.connect();
		const db = client.db(MONGO_DB_NAME);
		const collection = db.collection(MONGO_COLLECTION);

		const result = await collection.insertOne(req.body);

		res.status(200).json({ message: "Weather data stored successfully" });
	} catch (error) {
		console.error("Error storing weather data:", error);
		res.status(500).json({ message: "Failed to store weather data" });
	} finally {
		await client.close();
	}
});

app.get("/getWeather", async (req, res) => {
	const client = new MongoClient(uri);

	try {
		await client.connect();
		const db = client.db(MONGO_DB_NAME);
		const collection = db.collection(MONGO_COLLECTION);

		const storedWeather = await collection.find({}).toArray();
		res.status(200).json(storedWeather);
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch weather data" });
	} finally {
		await client.close();
	}
});

app.delete("/resetWeather", async (req, res) => {
	const client = new MongoClient(uri);

	try {
		await client.connect();
		const db = client.db(MONGO_DB_NAME);
		const collection = db.collection(MONGO_COLLECTION);

		const result = await collection.deleteMany({});
		res.status(200).json({ message: "All stored weather data has been reset" });
	} catch (error) {
		console.error("Error resetting stored weather data:", error);
		res.status(500).json({ message: "Failed to reset stored weather data" });
	} finally {
		await client.close();
	}
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
	if (
		!MONGO_DB_USERNAME ||
		!MONGO_DB_PASSWORD ||
		!MONGO_DB_NAME ||
		!MONGO_COLLECTION
	) {
		console.error("One or more environment variables are missing!");
	} else {
		console.log("All required environment variables are set.");
	}
});
