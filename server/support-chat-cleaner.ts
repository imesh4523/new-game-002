import { storage } from './storage';

class SupportChatCleaner {
  private monitorInterval: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private readonly INACTIVE_HOURS_THRESHOLD = 1;

  start() {
    if (this.monitorInterval) {
      console.log('⚠️  Support chat cleaner already running');
      return;
    }

    console.log(`🧹 Starting support chat cleaner (every ${this.CHECK_INTERVAL / 1000 / 60} minutes)`);
    
    // Run initial check
    this.runCleanup();
    
    // Schedule periodic checks
    this.monitorInterval = setInterval(() => {
      this.runCleanup();
    }, this.CHECK_INTERVAL);

    console.log('✅ Support chat cleaner started');
  }

  stop() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
      console.log('🛑 Support chat cleaner stopped');
    }
  }

  private async runCleanup() {
    try {
      const closedCount = await storage.closeInactiveSupportSessions(this.INACTIVE_HOURS_THRESHOLD);
      if (closedCount > 0) {
        console.log(`🧹 Auto-closed ${closedCount} inactive support session(s) after ${this.INACTIVE_HOURS_THRESHOLD} hour(s) of inactivity`);
      }
    } catch (error) {
      console.error('❌ Error running support chat cleanup:', error);
    }
  }
}

export const supportChatCleaner = new SupportChatCleaner();
