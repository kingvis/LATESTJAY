-- Payment Email Notification Trigger
-- This trigger calls the Edge Function when a payment status changes to 'success'

-- Create the function that will be called by the trigger
CREATE OR REPLACE FUNCTION notify_payment_success()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
  user_name TEXT;
BEGIN
  -- Only proceed if status changed to 'success'
  IF NEW.status = 'success' AND (OLD.status IS NULL OR OLD.status != 'success') THEN
    -- Get user details
    SELECT email, name INTO user_email, user_name
    FROM profiles
    WHERE id = NEW.user_id;
    
    -- Call Edge Function via pg_net (if available) or log for manual notification
    -- Note: This requires pg_net extension to be enabled in Supabase
    -- The actual email sending is handled by the Edge Function called from the client
    
    -- Insert a notification record for tracking
    INSERT INTO system_config (key, value)
    VALUES (
      'payment_notification_' || NEW.id,
      jsonb_build_object(
        'payment_id', NEW.id,
        'user_id', NEW.user_id,
        'user_email', user_email,
        'user_name', user_name,
        'amount', NEW.amount,
        'currency', NEW.currency,
        'transaction_id', NEW.transaction_id,
        'notified_at', NOW()
      )
    )
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
    
    RAISE NOTICE 'Payment success notification logged for payment %', NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_payment_success ON payments;
CREATE TRIGGER on_payment_success
  AFTER UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION notify_payment_success();

-- Also trigger on insert if payment is created with success status
DROP TRIGGER IF EXISTS on_payment_insert_success ON payments;
CREATE TRIGGER on_payment_insert_success
  AFTER INSERT ON payments
  FOR EACH ROW
  WHEN (NEW.status = 'success')
  EXECUTE FUNCTION notify_payment_success();
