/*
  Refactor of the RESTful implementation found in controllers/user-controller.js
*/

const {User} = require("../models");

const {signToken, AuthenticationError} = require("../utils/auth");

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findById(context.user._id).select("-__v -password");
        return userData;
      }
      throw AuthenticationError('You need to be logged in!');
    }
  },
  Mutation: {
    createUser: async(parent, {username, email, password}) => {
      console.log("hiiii");
      const user = await User.create({username, email, password});
      console.log("user -> ", user);
      const token = signToken(user);
      return {token, user};
    },
    login: async(parent, {username, email, password}) => {
      const user = await User.findOne({$or: [{username}, {email}]});
      if (!user) {
        throw AuthenticationError("A user with those login credentials does not exis");
      }
      // Check if password is not valid using the already created isCorrectPassword method
      // from the model then raise authentication error
      if (!(await user.isCorrectPassword(password))) {
        throw AuthenticationError("The provided password is invalid!")
      }
      const token = signToken(user);
      return {token, user};
    },
    saveBook: async(parent, {book}, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          {$addToSet: {savedBooks: book}},
          {new: true}
        );
        if (!updatedUser) {
          throw AuthenticationError("Can't save a book since a user with that id doesn't exist");
        }
        return updatedUser;
      }
      throw AuthenticationError("A user with those login credentials does not exist");
    },
    deleteBook: async(parent, {book}, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          {$pull: {savedBooks: book}},
          {new: true}
        );
        if (!updatedUser) {
          throw AuthenticationError("Can't delete a saved book since a user with that id doesn't exist");
        }
        return updatedUser;
      }
      throw AuthenticationError("A user with those login credentials does not exist");

    }
  }
}

module.exports = resolvers;