const router = require('express').Router();
let User = require('../models/cause.model');
const Cause = require('../models/cause.model');

router.route('/').get((req, res) => {
    Cause.find()
        .then(causes => res.json(causes))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Cause.findById(req.params.id)
        .then(causes => res.json(causes))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const name = req.body.name;
    const timesSupported = 0;

    const newCause = new Cause({
        name,
        timesSupported
    });

    newCause.save()
    .then(() => res.json('Cause added!'))
    .catch(err => res.status(400).json('Error: '+ err));
});

module.exports = router;