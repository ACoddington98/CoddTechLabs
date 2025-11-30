// =============================
// SUPABASE SETUP
// =============================
const SUPABASE_URL = "https://qiobjgsmvalwknijuube.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_BfFRc4t5A_F94S4KrD4s3A_VwtlanUM";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =============================
// LOGIN FORM HANDLER
// =============================
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const statusBox = document.getElementById("loginStatus");

  statusBox.innerText = "Logging in...";

  // Attempt login with Supabase
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    statusBox.innerText = "❌ " + error.message;
    return;
  }

  const user = data.user;

  // =============================
  // FETCH ROLE FROM user_profiles
  // =============================
  const { data: profile, error: profileError } = await supabaseClient
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    statusBox.innerText = "❌ Profile load failed: " + profileError.message;
    return;
  }

  // =============================
  // STORE USER IN localStorage (optional)
  // =============================
  localStorage.setItem("user", JSON.stringify({
    id: user.id,
    email: user.email,
    role: profile.role
  }));

  // =============================
  // REDIRECT BASED ON ROLE
  // =============================
  if (profile.role === "employee") {
    window.location.href = "../employee-dashboard.html";
  } else {
    window.location.href = "../profile.html";
  }
});

// =============================
// CHECK IF USER IS ALREADY LOGGED IN
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const savedUser = JSON.parse(localStorage.getItem("user"));
  if (savedUser) {
    // Auto-redirect if user already logged in
    if (savedUser.role === "employee") {
      window.location.href = "../employee-dashboard.html";
    } else {
      window.location.href = "../profile.html";
    }
  }
});
