require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/form.html");
});

// Handle form submission and store data
app.post('/submit-uri', async (req, res) => {
  const mongoUri = req.body.myuri || 'mongodb+srv://chelsea:<123>@cluster0.9bstlml.mongodb.net/';

  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      dbName: 'Summer24' // Specify the database name here
    });
    console.log('Connected to MongoDB');

    // Define Schema and Model
    const studentSchema = new mongoose.Schema({
      myName: String,
      mySID: String
    });
    const Student = mongoose.model('s24students', studentSchema);

    const student = new Student({
      myName: 'Chelsea Chiu', 
      mySID: '300385681'
    });

    // Save the document to the collection
    await student.save();

    res.send(`<h1>Document Added to s24students Collection</h1>`);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    res.status(500).send('Error connecting to MongoDB');
  }
});

// Serve the students HTML page
app.get('/students-page', (req, res) => {
  res.sendFile(__dirname + "/students.html");
});

// Query and retrieve specific fields from MongoDB
app.get('/students', async (req, res) => {
  try {
    // Define Schema and Model
    const studentSchema = new mongoose.Schema({
      myName: String,
      mySID: String
    });
    const Student = mongoose.model('s24students', studentSchema);

    // Query the database and project only the specific fields
    const students = await Student.find({}, 'myName mySID'); // Only include 'myName' and 'mySID'
    
    // Format the result to include '_id' as 'id'
    const formattedStudents = students.map(student => ({
      id: student.mySID,
      name: student.myName
    }));
    
    res.json(formattedStudents);
  } catch (err) {
    console.error('Error retrieving students:', err);
    res.status(500).send('Error retrieving students');
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
