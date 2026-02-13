import cron from 'node-cron';
import Charger from '../models/ChargerModel.js';
import { chargerStatus } from '../config/config.js';
import { createAndSendNotification } from '../service/notificationService/notification.js';

/**
 * Cron job to check and update charger statuses
 * Runs every 30 minutes
 * Checks all chargers with 'preparing' status
 * If a charger has been in 'preparing' status for 15+ minutes, changes it to 'cancelled'
 */
const startChargerStatusCron = () => {
  // Schedule the cron job to run every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    try {
      console.log('Running charger status check cron job...');
      const currentTime = new Date();
      
      // Find all chargers with 'preparing' status
      const preparingChargers = await Charger.find({
        status: chargerStatus.preparing
      });
      
      console.log(`Found ${preparingChargers.length} chargers in preparing status`);
      
      // Check each charger's start time
      for (const charger of preparingChargers) {
        const startTime = new Date(charger.startTime);
        const timeDifferenceInMinutes = Math.floor((currentTime - startTime) / (1000 * 60));
        
        // If charger has been in 'preparing' status for 15+ minutes
        if (timeDifferenceInMinutes >= 15) {
          console.log(`Cancelling charger ${charger._id} - in preparing status for ${timeDifferenceInMinutes} minutes`);
          
          // Update the charger status to 'cancelled'
          await Charger.findByIdAndUpdate(charger._id, {
            status: chargerStatus.cancelled,
            endTime: currentTime
          });

          // Send a notification to the user
          await createAndSendNotification(charger.user, 'Charger Cancelled', `Your charger with Charge Station ${charger.chargeBoxId} has been cancelled due to inactivity.`);
        }
      }
      
      console.log('Charger status check completed');
    } catch (error) {
      console.error('Error in charger status cron job:', error);
    }
  });
  
  console.log('Charger status cron job scheduled to run every 30 minutes');
};

export default startChargerStatusCron;