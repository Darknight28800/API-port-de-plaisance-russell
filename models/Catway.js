const mongoose = require("mongoose");

/**
 * Schéma d'un catway (emplacement d'amarrage).
 * Le numéro et le type sont fixés à la création et ne doivent plus être modifiés.
 */
const catwaySchema = new mongoose.Schema(
    {
        catwayNumber: {
            type: Number,
            unique: true,
            required: true,
            min: 1
        },
        catwayType: {
            type: String,
            enum: ["long", "short"],
            required: true
        },
        catwayState: {
            type: String,
            required: true,
            trim: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Catway", catwaySchema);
