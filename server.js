import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());

app.get('/api/location', async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch location suggestions' });
  }
});

app.listen(5000, () => console.log('Proxy server running on port 5000'));
