
module.exports = (app) => {
    const notes = require('../controllers/ants.controller.js');

    // Create a new Note
    app.post('/ants', ants.create);

    // Retrieve all Notes
    app.get('/noantstes', ants.findAll);

    // Retrieve a single Note with noteId
    app.get('/ants/:noteId', ants.findOne);

    // Update a Note with noteId
    app.put('/ants/:noteId', ants.update);

    // Delete a Note with noteId
    app.delete('/ants/:noteId', ants.delete);
}