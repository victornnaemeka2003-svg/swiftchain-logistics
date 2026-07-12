import express from 'express';
import * as publicController from '../controllers/publicController.js';

const router = express.Router();

router.post('/contact', publicController.submitContact);
router.post('/quote-request', publicController.submitQuoteRequest);
router.get('/faqs', publicController.getFaqs);
router.get('/testimonials', publicController.getTestimonials);
router.get('/news', publicController.getNews);
router.get('/news/:slug', publicController.getNewsBySlug);
router.get('/settings', publicController.getPublicSettings);

export default router;
