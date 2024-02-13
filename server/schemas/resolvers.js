/*
  Refactor of the RESTful implementation found in controllers/user-controller.js
*/

const {User} = require("../models");

const {signToken, AuthenticationError} = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findById(context.user._id).populate('savedBooks');
      }
      throw AuthenticationError;
    },
  },
  Mutation: {
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
    addUser: async(parent, {username, email, password}) => {
      const user = await User.create({username, email, password});
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
    removeBook: async(parent, {bookId}, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          {$pull: {savedBooks: { bookId }}},
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