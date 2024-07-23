require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

URL = 'mongodb+srv://chelsea:<123>@cluster0.9bstlml.mongodb.net/chelsea'
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.sendFile(__dirname + "/form.html");
});


app.post('/submit-uri', async (req, res) => {
  const mongoUri = req.body.myuri || 'mongodb+srv://chelsea:<123>@cluster0.9bstlml.mongodb.net/';

  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      dbName: 'Summer24' 
    });
    console.log('Connected to MongoDB');

    // Define Schema and Model
    
    const studentSchema = new mongoose.Schema({
      myName: String,
      mySID: String
    });
    const Student = mongoose.model('s24students', studentSchema);

    // Create a new document 
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

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
