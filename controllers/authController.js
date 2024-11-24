const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
    const { name, email, password, phoneNumber } = req.body;

    if (!name || !email || !password || !phoneNumber) {
        return res.status(400).json({
            id: null,
            data: null,
            message: "All fields (name, email, password, phoneNumber) are required",
            success: false,
        });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                id: null,
                data: null,
                message: "Email already in use",
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
        });

        res.status(201).json({
            id: newUser.id,
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
            },
            message: null,
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            id: null,
            data: null,
            message: error.message,
            success: false,
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            id: null,
            data: null,
            message: "Email and password are required",
            success: false,
        });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                id: null,
                data: null,
                message: "Invalid credentials",
                success: false,
            });
        }

        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return res.json({
            id: user.id,
            data: {
                accessToken,
                refreshToken,
                expiredIn: 3600,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                },
            },
            message: "Login successful",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            id: null,
            data: null,
            message: error.message,
            success: false,
        });
    }
};