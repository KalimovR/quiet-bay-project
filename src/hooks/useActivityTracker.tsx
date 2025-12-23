import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

type ActivityType = 'online' | 'watching_course' | 'chatting';

export const useActivityTracker = (activityType: ActivityType, metadata: Record<string, any> = {}) => {
  const { user } = useAuth();

  const updateActivity = useCallback(async () => {
    if (!user) return;

    try {
      await supabase
        .from('user_activity')
        .upsert({
          user_id: user.id,
          activity_type: activityType,
          last_seen_at: new Date().toISOString(),
          metadata
        }, {
          onConflict: 'user_id'
        });
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  }, [user, activityType, metadata]);

  const clearActivity = useCallback(async () => {
    if (!user) return;

    try {
      await supabase
        .from('user_activity')
        .delete()
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error clearing activity:', error);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Update activity immediately
    updateActivity();

    // Update every 30 seconds
    const interval = setInterval(updateActivity, 30000);

    // Clear activity on unmount
    return () => {
      clearInterval(interval);
      clearActivity();
    };
  }, [user, updateActivity, clearActivity]);

  return { updateActivity };
};
