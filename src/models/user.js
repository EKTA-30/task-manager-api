const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require('./task')
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Paaswrod does not meet criteria ");
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number ");
      }
    },
  },avatar: {
    type:Buffer
  },
  //introducing a new property for the user model and that is an array of objects containing a single object
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
},{
  timestamps:true
})

//virtual property, rel b/w 2 entities
//not stored in db, it is just for mongoose to figure out who owns what and how they are related
userSchema.virtual('tasks', {
  ref:'Tasks',
  localField:'_id',
  foreignField:'owner'
})

// userSchema.methods.toJSON = function(){
//     const user = this
//     const userobject = user

//     delete userobject.password
//     delete userobject.tokens

//     return userobject
// }

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

//Hash the plain text password
//we use standard functions because arrow functions do not bind 'this'
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
//delete user task when user is deleted

userSchema.pre('remove', async function (next){
  const user = this

  await Task.deleteMany({owner:user._id})
  next()
})

const User = mongoose.model("User", userSchema);

module.exports = User;
