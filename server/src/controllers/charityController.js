const store = require('../config/store');

// GET /api/charities
function getCharities(req, res) {
  const { search, featured } = req.query;
  let list = [...store.charities];

  if (featured === 'true') {
    list = list.filter(c => c.isFeatured);
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.tagline.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  }

  res.json({ charities: list });
}

// POST /api/charities (Admin)
function createCharity(req, res) {
  const { name, tagline, description, imageUrl, isFeatured, upcomingEvents } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }

  const newCharity = {
    id: `charity_${Date.now()}`,
    name,
    tagline: tagline || '',
    description,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&w=800&q=80',
    isFeatured: Boolean(isFeatured),
    upcomingEvents: upcomingEvents || []
  };

  store.charities.push(newCharity);
  res.status(201).json({ message: 'Charity added successfully', charity: newCharity });
}

// PUT /api/charities/:id (Admin)
function updateCharity(req, res) {
  const { id } = req.params;
  const index = store.charities.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Charity not found' });
  }

  store.charities[index] = {
    ...store.charities[index],
    ...req.body
  };

  res.json({ message: 'Charity updated successfully', charity: store.charities[index] });
}

// DELETE /api/charities/:id (Admin)
function deleteCharity(req, res) {
  const { id } = req.params;
  const initial = store.charities.length;
  store.charities = store.charities.filter(c => c.id !== id);

  if (store.charities.length === initial) {
    return res.status(404).json({ error: 'Charity not found' });
  }

  res.json({ message: 'Charity removed successfully' });
}

module.exports = {
  getCharities,
  createCharity,
  updateCharity,
  deleteCharity
};
