const { Tech, Matchup } = require('../models');

const resolvers = {
	Query: {
		tech: async () => {
			return await Tech.find({});
		},
		matchup: async(_, {_id}) => {
			return await Matchup.findOne({_id});
		matchups: async () => {
			return await Matchup.find({});
		}
	},
	Mutation: {
		createMatchup: async (_, {tech1, tech2}) => {
			return await Matchup.create({tech1, tech2});
		},
		createVote: async (_, {_id, techNum}) => {
			return await Matchup.findOneAndUpdate(
				{_id},
				{ $inc: { [`tech${techNum}_votes`]: 1 }},
				{ new: true }
			};
		}
	};
};

module.exports = resolvers;
