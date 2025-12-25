import Subscriber from '../models/Subscriber.js';

// @desc    Subscribe to newsletter
// @route   POST /api/subscribers
// @access  Public
export const subscribe = async (req, res, next) => {
  try {
    const { email, name } = req.body;

    // Check if already subscribed
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      if (subscriber.isActive) {
        return res.status(400).json({
          success: false,
          message: 'तपाईं पहिले नै सदस्यता लिनुभएको छ',
        });
      } else {
        // Reactivate subscription
        subscriber.isActive = true;
        subscriber.subscribedAt = new Date();
        subscriber.unsubscribedAt = null;
        await subscriber.save();

        return res.json({
          success: true,
          message: 'तपाईंको सदस्यता पुनः सक्रिय भयो',
        });
      }
    }

    subscriber = await Subscriber.create({ email, name });

    res.status(201).json({
      success: true,
      message: 'सदस्यताको लागि धन्यवाद!',
      data: subscriber,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unsubscribe from newsletter
// @route   PUT /api/subscribers/unsubscribe
// @access  Public
export const unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    const subscriber = await Subscriber.findOne({ email });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'सदस्यता फेला परेन',
      });
    }

    subscriber.isActive = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.json({
      success: true,
      message: 'तपाईंको सदस्यता रद्द भयो',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all subscribers
// @route   GET /api/subscribers
// @access  Private (Admin)
export const getSubscribers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;
    const { isActive } = req.query;

    const query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const total = await Subscriber.countDocuments(query);
    const subscribers = await Subscriber.find(query)
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: subscribers.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: subscribers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete subscriber
// @route   DELETE /api/subscribers/:id
// @access  Private (Admin)
export const deleteSubscriber = async (req, res, next) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'सदस्यता फेला परेन',
      });
    }

    await subscriber.deleteOne();

    res.json({
      success: true,
      message: 'सदस्यता मेटियो',
    });
  } catch (error) {
    next(error);
  }
};
