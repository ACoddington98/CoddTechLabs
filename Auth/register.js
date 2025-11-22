const SUPABASE_URL = "https://qiobjgsmvalwknijuube.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_PUBLISHABLE_KEY";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("registerForm");
const status = document.getElementById("registerStatus");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value;
  const role = document.getElementById("role").value;

  // 1. Create Auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
  if (authError) return status.innerText = authError.message;

  // 2. Create user profile in table
  const { error: profileError } = await supabase
    .from("user_profiles")
    .insert([{ id: authData.user.id, username, role, profile_image: 'images/profile-placeholder.png' }]);

  if (profileError) return status.innerText = profileError.message;

  status.innerText = "Account created! Check your email to confirm.";
});
