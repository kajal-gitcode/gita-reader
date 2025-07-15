const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/chapters', (req, res) => {
  const data = JSON.parse(fs.readFileSync('verse.json', 'utf8'));
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});