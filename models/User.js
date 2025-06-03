const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true, // Auto-lowercase for consistency
    trim: true       // Removes leading/trailing whitespace
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'] 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  }
}, { timestamps: true });


// 🔒 Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Avoid re-hashing if not changed

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err); // Pass error to Express if hashing fails
  }
});


// 🔐 Compare entered password with hashed one
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the model
module.exports = mongoose.model('User', userSchema);
