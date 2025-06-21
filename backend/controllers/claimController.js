const Claim = require('../models/Claim');
const fs = require('fs').promises;
const text_extraction = require('../services/aiServices');
const AiModel = require('../models/AiModel');
const logger = require('../utils/logger');
const path = require('path');

// Create a new claim
exports.createClaim = async (req, res) => {
    try {
        const { name, phoneNumber, email, place, description, hospital, hospitalLocation } = req.body;

        const claimData = {
            name,
            phoneNumber,
            email,
            place,
            description,
            hospital,
            hospitalLocation,
            file: req.file ? req.file.path : null
        };

        const claim = await Claim.create(claimData);
        logger.info(`Claim created: ${claim.id}`);

        // Fire-and-forget AI task
        text_extraction(claim.id, claim.file)
            .then(() => logger.info(`Text extraction completed for ${claim.id}`))
            .catch(err => logger.error(`Text extraction failed for ${claim.id}:`, err));

        res.status(201).json({
            success: true,
            data: claim
        });
    } catch (error) {
        logger.error('Error creating claim:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get all claims (excluding soft deleted)
exports.getClaims = async (req, res) => {
    try {
        const claims = await Claim.find({ isDeleted: { $ne: true } }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: claims.length,
            data: claims
        });
    } catch (error) {
        logger.error('Error fetching claims:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

// Get single claim by ID
exports.getClaim = async (req, res) => {
    try {
        const { id } = req.params;

        const claim = await Claim.findOne({ _id: id, isDeleted: { $ne: true } }).lean();

        if (!claim) {
            return res.status(404).json({
                success: false,
                error: 'Claim not found',
            });
        }

        const aiData = await AiModel.findOne({ claim_id: id }).lean();

        res.status(200).json({
            success: true,
            data: claim,
            response: aiData || null,
        });
    } catch (error) {
        logger.error(`Error fetching claim by ID ${req.params.id}:`, error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

// Update claim
exports.updateClaim = async (req, res) => {
    try {
        const { name, phoneNumber, email, place, description, hospital, hospitalLocation, claimStatus } = req.body;

        let updateData = {
            name,
            phoneNumber,
            email,
            place,
            description,
            hospital,
            hospitalLocation,
            claimStatus
        };

        if (req.file) {
            const existingClaim = await Claim.findById(req.params.id);

            if (existingClaim?.file) {
                try {
                    await fs.unlink(existingClaim.file);
                    logger.info(`Deleted old file: ${existingClaim.file}`);
                } catch (err) {
                    logger.warn(`Failed to delete old file ${existingClaim.file}:`, err);
                }
            }

            updateData.file = req.file.path;
        }

        const updatedClaim = await Claim.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        if (!updatedClaim) {
            return res.status(404).json({
                success: false,
                error: 'Claim not found'
            });
        }

        res.status(200).json({
            success: true,
            data: updatedClaim
        });
    } catch (error) {
        logger.error(`Error updating claim ${req.params.id}:`, error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

// Soft delete claim
exports.deleteClaim = async (req, res) => {
    try {
        const claim = await Claim.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );

        if (!claim) {
            return res.status(404).json({
                success: false,
                error: 'Claim not found'
            });
        }

        logger.info(`Claim soft deleted: ${claim.id}`);

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        logger.error(`Error deleting claim ${req.params.id}:`, error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
