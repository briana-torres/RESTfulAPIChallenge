const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Restaurant = require('./restaurantSchema');

const dbURI = 'mongodb+srv://briana:RyOAI7FA5pJoe4bB@generate.nj9uh1g.mongodb.net/generate_sample_data';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

const app = express();

// Middleware for parsing JSON
app.use(bodyParser.json());

app.get('/top/:n', async (req, res) => {
    const n = parseInt(req.params.n, 10);

    try {
        let restaurants = await Restaurant.aggregate([
            {
                $addFields: {
                    numberOfGrades: { $size: '$grades' },
                    averageScore: { $avg: '$grades.score' }, 
                },
            },
            {
                $match: { 'numberOfGrades': { $gte: 5 } } 
            },
            {
                $sort: { averageScore: -1 },
            },
            {
                $limit: n,
            },
            ])
            restaurants = restaurants.map(restaurant => ({
                name: restaurant.name,
                avgScore: restaurant.averageScore,
            }));
            res.status(200).json(restaurants);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/update/:restaurant_name', async (req, res) => {
    const restaurantName = req.params.restaurant_name;
    const { grade } = req.body;
    console.log(grade, restaurantName);

    try {
        const restaurant = await Restaurant.findOne({ name: restaurantName });

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        restaurant.grades[0].grade = grade;

        await restaurant.save();

        res.status(200).json({ message: 'Grade updated successfully' });
    } catch (error) {
        console.error('Error updating grade:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});




