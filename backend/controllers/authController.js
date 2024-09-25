const { prisma } = require('../config/passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;

        console.log(req.body);

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if(existingUser) {
            return res.status(400).json({message: 'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                firstName,
                lastName
            }
        })

        res.status(201).json(newUser);

    } catch(error) {
        return res.status(500).json({message: 'Internal server error'});
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        console.log(req.body);

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if(!user) {
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(400).json({message: 'Invalid credentials'});
        }

        const payload = {
            id: user.id,
            username: user.username,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        
        res.json({ message: 'Login successful', token: token, user: payload });
    } catch(error) {
        return res.status(500).json({message: 'Internal server error'});
    }
}

module.exports = { register, login };