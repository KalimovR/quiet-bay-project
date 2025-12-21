import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Activity = 'browsing' | 'chat' | 'course' | null;

export const useUserPresence = (activity: Activity = 'browsing', courseId?: string) => {
  const updatePresence = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const presenceData = {
      user_id: user.id,
      email: user.email,
      status: 'online',
      current_activity: activity,
      current_course_id: courseId || null,
      last_seen_at: new Date().toISOString(),
    };

    // Upsert presence
    const { error } = await supabase
      .from('user_presence')
      .upsert(presenceData, { onConflict: 'user_id' });

    if (error) {
      console.error('Error updating presence:', error);
    }
  }, [activity, courseId]);

  const removePresence = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('user_presence')
      .delete()
      .eq('user_id', user.id);
  }, []);

  useEffect(() => {
    updatePresence();

    // Update presence every 30 seconds
    const interval = setInterval(updatePresence, 30000);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      removePresence();
    };
  }, [updatePresence, removePresence]);

  return { updatePresence, removePresence };
};
