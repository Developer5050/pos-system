const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const userSchema = require("../validate/userValidate");
const generateToken = require("../utilis/generateToken");

// Signup
const signup = async (req, res) => {
  try {
    // ✅ Validate user input
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { firstName, lastName, businessName, email, password, phone, role } =
      req.body;

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // ✅ Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Create new user
    const newUser = new User({
      firstName,
      lastName,
      businessName,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        businessName: newUser.businessName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 2. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // 3. Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // 4. Generate token
    const token = generateToken(user);

    user.token = token;

    await user.save();

    // 5. Send response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        businessName: user.businessName,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error, please try again later" });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }

    // Remove token from DB (invalidate)
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.token = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logout successful",
      payload: {
        user: user._id,
        action: "LOGOUT",
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Server error, please try again later" });
  }
};


module.exports = { signup, login, logout };
