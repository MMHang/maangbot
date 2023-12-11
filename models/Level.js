const { Schema, model } = require('mongoose');
const levelSchema = new Schema({
    
    guildId: {
        type: String,
        required: true,
        index: true,
    },
    userId: {
        type: String,
        required: true,
        index: true,
    },
    xp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 0,
    },
    streak: {
        type: Number,
        default: 0,
    },
    highestStreak: {
        type: Number,
        default: 0,
    }
});
module.exports = model('Level', levelSchema);