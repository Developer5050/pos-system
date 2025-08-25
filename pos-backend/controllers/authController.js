const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const signup = async (req, res) => {
  try {
    const { firstName, lastName, businessName, email, phone, password, role } =
      req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        businessName,
        email,
        phone,
        password: hashedPassword,
        role: "CASHIER",
      },
    });

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        businessName: newUser.businessName,
        email: newUser.email,
        phone: newUser.phone,
        password: newUser.password,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const tokenString = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await prisma.token.create({
      data: {
        token: tokenString,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      token: tokenString,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastname: user.lastName,
        businessName: user.businessName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/authController.js
const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(400).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Decode token to get userId (optional)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Delete the token from DB
    await prisma.token.deleteMany({
      where: {
        token: token,  // ya userId: userId, agar multiple token delete karne ho
      },
    });

    return res.status(200).json({ success: true, message: "Logout successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};


module.exports = { signup, login, logout };
