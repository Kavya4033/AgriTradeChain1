const Notification = require('../models/notification');

const createNotification = async ({
    recipient = null,
    recipientRole = 'All',
    title,
    message,
    type = 'info',
    relatedOrder = null,
    relatedListing = null
}) => {
    try {
        const notif = new Notification({
            recipient,
            recipientRole,
            title,
            message,
            type,
            relatedOrder,
            relatedListing
        });
        await notif.save();
        return notif;
    } catch (err) {
        console.error('Failed to create notification:', err.message);
        return null;
    }
};

module.exports = {
    createNotification
};
