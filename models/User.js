const mongoose = require("mongoose");

/**
 * Schéma d'un utilisateur de la capitainerie.
 * Le mot de passe est stocké déjà haché (bcrypt) par la couche service.
 */
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 2
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
