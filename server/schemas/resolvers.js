const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );

        return userData;
      }

      throw new AuthenticationError("Youre not logged in!");
    },

    // no more queries? maybe?
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Invalid Authentication!");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Invalid Authentication!");
      }

      const token = signToken(user)
      return { token, user };

    },
    addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user);

        return { token, user };
    },
    savedBook: async (parent, { input }, context) => {
        if(context.user){
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id},
                { $push: { savedBooks: input } },
                { new: true }
            );
            return updatedUser;
        }
        throw new AuthenticationError(" You must be logged in to perform this action");
    },
    removeBook: async (parent, {bookId}, context) => {
        if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                // { $pull: { savedBooks: { bookBeingRemovedId: bookId } } }, // if property and parameter are same name, we only need to place it once
                // { $pull: { savedBooks: { bookId: bookId } } },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            );
            return updatedUser;
        }
        throw new AuthenticationError(`This action is for logged in user's only`);
    }
    
  },
};

module.exports = resolvers;
