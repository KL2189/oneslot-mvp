
-- The profiles table exists but may have issues. Let's recreate the trigger function to handle errors gracefully
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Try to insert into profiles table, but don't fail if there's an issue
  BEGIN
    INSERT INTO public.profiles (id, full_name, username)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'full_name',
      LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'full_name', 'user'), ' ', '-'))
    );
  EXCEPTION 
    WHEN OTHERS THEN
      -- Log the error but don't prevent user creation
      RAISE WARNING 'Could not create profile for user %: %', NEW.id, SQLERRM;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
