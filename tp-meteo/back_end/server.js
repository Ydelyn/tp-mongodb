const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
}));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:8000/db-meteo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});
const User = mongoose.model('User', userSchema);

const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    active: { type: Boolean, default: true },
});

const Session = mongoose.model('Session', sessionSchema);

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All inputs are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }


    const newUser = new User({ username, password });
    await newUser.save();
    res.json({ message: 'Sign up completed' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All inputs are required' });
    }

    try {
        const user = await User.findOne({ username, password });

        if (!user) {
            return res.status(401).json({ message: 'User / password incorrect' });
        }

        let session = await Session.findOne({ userId: user._id, active: true });

        if (!session) {
            session = new Session({ userId: user._id });
            await session.save();
        }

        res.status(200).json({ 
            message: 'Connection passed!', 
            session: { id: session._id, userId: user._id, active: session.active },
        });
    } catch (error) {
        console.error('Connection failed :', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/logout', async (req, res) => {
    const { sessionId } = req.body;

    if (!sessionId) {
        return res.status(400).json({ message: 'Missing session ID' });
    }

    try {
        const session = await Session.findById(sessionId);

        if (!session || !session.active) {
            return res.status(400).json({ message: 'Session already desactivated or unvalid' });
        }

        session.active = false;
        await session.save();

        res.status(200).json({ message: 'Deconnection done' });
    } catch (error) {
        console.error('Error while deconnection :', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
