import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name;
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
        // Get location data
        const ipstackResponse = await axios.get(`http://api.ipstack.com/${clientIp}?access_key=${process.env.IPSTACK_API_KEY}`);
        const location = ipstackResponse.data.city || 'unknown location';

        // Get weather data
        const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`);
        const temperature = weatherResponse.data.main.temp;

        // Send response
        res.json({
            client_ip: clientIp,
            location: location,
            greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});