/**
 * Idempotency middleware to handle duplicate requests
 * Uses Idempotency-Key header to identify duplicate requests
 */
const idempotencyMiddleware = (req, res, next) => {
  // Get idempotency key from header
  const idempotencyKey = req.headers["idempotency-key"];

  // Store it in request for later use
  req.idempotencyKey = idempotencyKey;

  next();
};

module.exports = idempotencyMiddleware;
