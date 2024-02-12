const {User} = require("../models");

const {signToken, AuthenticationError} = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findById(context.user._id).select("-__v -password");
        return userData;
      }
      throw AuthenticationError('You need to be logged in!');
    }
  },
  Mutation: {
    createUser: async(parent, {username, email, password}) => {
      const user = await User.create({username, email, password});
      const token = signToken(user);
      return {token, user}
    },
    login: async(parent, {email, password}) => {
      const user = await User.findOne({email});
      if (!user) {
        throw AuthenticationError("A user with those login credentials does not exis");
      }
      // Check if password is not valid using the already created isCorrectPassword method
      // from the model then raise authentication error
      if (!(await user.isCorrectPassword(password))) {
        throw AuthenticationError("The provided password is invalid!")
      }
    }
  }
}

module.exports = resolvers;