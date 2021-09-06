require('dotenv').config(); 
const express = require('express'); 
const { UserRouter, FoodEntryRouter } = require('./routes');

const cors = require('cors'); 

const app = express();

app.use(cors()); 

app.use(express.json()); 

const PORT = process.env.PORT || 3001; 

// Routes defined for different resources
app.use('/users', UserRouter); 
app.use('/foodentry', FoodEntryRouter); 

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})