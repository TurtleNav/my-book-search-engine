/*
  Refactor of the RESTful implementation found in controllers/user-controller.js
*/

const {User} = require("../models");

const {signToken, AuthenticationError} = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findById(context.user._id);
      }
    },
  },
  Mutation: {
    login: async(parent, {username, email, password}) => {
      const user = await User.findOne({$or: [{username}, {email}]});
      if (!user) {
        throw AuthenticationError;
      }
      // Check if password is not valid using the already created isCorrectPassword method
      // from the model then raise authentication error
      if (!(await user.isCorrectPassword(password))) {
        throw AuthenticationError;
      }
      const token = signToken(user);
      return {token, user};
    },
    createUser: async(parent, {username, email, password}) => {
      console.log("Attempting to create a user")
      const user = await User.create({username, email, password});
      const token = signToken(user);
      console.log('token -> ', token);
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
          throw AuthenticationError;
        }
        return updatedUser;
      }
      throw AuthenticationError;
    },
    removeBook: async(parent, {bookId}, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          {$pull: {savedBooks: { bookId }}},
          {new: true}
        );
        if (!updatedUser) {
          throw AuthenticationError;
        }
        return updatedUser;
      }
      throw AuthenticationError;

    }
  }
}

module.exports = resolvers;