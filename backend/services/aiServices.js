require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const AiModel = require('../models/AiModel');
const logger = require('../utils/logger');
const Claim = require('../models/Claim');


const url = process.env.AI_SERVICES_URL;

const text_extraction = async (claim_id, filePath) => {
  try {
    // Validate Inputs
    if (!claim_id || !filePath) {
      logger.error('[Validation] Missing claim_id or file path');
      return;
    }

    if (!fs.existsSync(filePath)) {
      logger.error(`[Validation] File does not exist at path: ${filePath}`);
      return;
    }

    // Prepare form data for extraction API
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    logger.info(`[AI Service] Initiating text extraction for claim_id: ${claim_id}`);

    // Step 1: Text Extraction
    const textResponse = await axios.post(`${url}/image_text/file`, form, {
      headers: form.getHeaders(),
    });

    if (!textResponse.data || !textResponse.data.text) {
      logger.warn(`[AI Service] No text returned from extraction API for claim_id: ${claim_id}`);
      return;
    }

    const extractData = {
      claim_id,
      text_extraction: textResponse.data,
      extract_status: 1,
    };

    const aiRecord = await AiModel.create(extractData);
    logger.info(`[DB] Stored extracted text. Claim ID: ${claim_id}, Record ID: ${aiRecord._id}`);

    const extractedText = textResponse.data?.text?.text;
    if (!extractedText || extractedText.trim() === '') {
      logger.warn(`[AI Service] Extracted text is empty for claim_id: ${claim_id}`);
      return;
    }

    // Step 2: Summarization
    logger.info(`[AI Service] Summarizing text for claim_id: ${claim_id}`);
    const summarizeRes = await axios.post(`${url}/summarize`, { text: extractedText }, {
      headers: { 'Content-Type': 'application/json' },
    });

    const summary = summarizeRes.data?.summary;
    if (!summary) {
      logger.warn(`[AI Service] No summary returned for claim_id: ${claim_id}`);
      return;
    }

    await AiModel.findByIdAndUpdate(aiRecord._id, {
      $set: {
        text_summarize: summary,
        summarize_status: 1,
      },
    }, { new: true });

    logger.info(`[DB] Summary stored for claim_id: ${claim_id}`);

    // Step 3: Classification
    logger.info(`[AI Service] Classifying summary text for claim_id: ${claim_id}`);
    const classifyRes = await axios.post(`${url}/classify/classify`, { text: summary }, {
      headers: { 'Content-Type': 'application/json' },
    });

    const classification = classifyRes.data?.classification;
    if (!classification) {
      logger.warn(`[AI Service] No classification result returned for claim_id: ${claim_id}`);
      return;
    }

    await AiModel.findByIdAndUpdate(aiRecord._id, {
      $set: { classify: classifyRes.data.classification }
    }, { new: true });

    logger.info(`[DB] Classification data stored for claim_id: ${claim_id}`);
    // Update Claim status
let statusUpdate = null;

if (classification === 'Legit') {
  statusUpdate = 'approved';
} else if (classification === 'Suspicious') {
  statusUpdate = 'failed';
}

if (statusUpdate) {
  await Claim.findByIdAndUpdate(claim_id, {
    $set: { claimStatus: statusUpdate }
  }, { new: true });

  logger.info(`[Claim] Updated claim status to '${statusUpdate}' for claim_id: ${claim_id}`);
} else {
  logger.warn(`[Claim] Unknown classification result '${classification}' for claim_id: ${claim_id}`);
}
  } catch (error) {
    logger.error(`[AI Pipeline] Error in processing claim_id: ${claim_id} - ${error.message}`, {
      stack: error.stack,
    });
  }
};

module.exports = text_extraction;
