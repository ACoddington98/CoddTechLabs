// =============================
// SUPABASE SETUP
// =============================
const SUPABASE_URL = "https://qiobjgsmvalwknijuube.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_BfFRc4t5A_F94S4KrD4s3A_VwtlanUM";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =============================
// DOM ELEMENTS
// =============================
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginStatus = document.getElementById("loginStatus");
const registerStatus = document.getElementById("registerStatus");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");

const userProfile = document.getElementById("userProfile");
const userName = document.getElementById("userName");
const userType = document.getElementById("userType");
const userAvatar = document.getElementById("userAvatar");

// Modals
const authModal = document.getElementById("authModal");
const profileModal = document.getElementById("profileModal");

// =============================
// LOGIN HANDLER
// =============================
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    loginStatus.innerText = "Logging in...";

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      loginStatus.innerText = "❌ " + error.message;
      return;
    }

    const user = data.user;

    // Get role from user_profiles table
    const { data: profile, error: profileError } = await supabaseClient
      .from("user_profiles")
      .select("role, username, profile_image")
      .eq("id", user.id)
      .single();

    if (profileError) {
      loginStatus.innerText = "❌ " + profileError.message;
      return;
    }

    // Save user in localStorage
    localStorage.setItem("user", JSON.stringify({
      id: user.id,
      email: user.email,
      username: profile.username,
      role: profile.role,
      avatar: profile.profile_image,
    }));

    // Redirect based on role
    if (profile.role === "employee") {
      window.location.href = "../employee-dashboard.html";
    } else {
      window.location.href = "../profile.html";
    }
  });
}

// =============================
// REGISTER HANDLER
// =============================
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    const username = document.getElementById("regUsername").value.trim();
    const role = document.getElementById("regRole").value;
    registerStatus.innerText = "Creating account...";

    // 1. Sign up user
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (authError) {
      registerStatus.innerText = "❌ " + authError.message;
      return;
    }

    // 2. Add to user_profiles
    const { error: profileError } = await supabaseClient
      .from("user_profiles")
      .insert([{
        id: authData.user.id,
        username,
        role,
        profile_image: "images/profile-placeholder.png",
      }]);

    if (profileError) {
      registerStatus.innerText = "❌ " + profileError.message;
      return;
    }

    // Save in localStorage
    localStorage.setItem("user", JSON.stringify({
      id: authData.user.id,
      email,
      username,
      role,
      avatar: "images/profile-placeholder.png",
    }));

    // Redirect to profile page
    window.location.href = "../profile.html";
  });
}

// =============================
// LOGOUT HANDLER
// =============================
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    loginBtn.style.display = "inline-block";
    registerBtn.style.display = "inline-block";
    userProfile.style.display = "none";
    supabaseClient.auth.signOut();
  });
}

// =============================
// PROFILE MODAL HANDLER
// =============================
if (userProfile) {
  userProfile.addEventListener("click", () => {
    profileModal.style.display = "flex";
    const user = JSON.parse(localStorage.getItem("user"));
    document.getElementById("profileName").value = user.username;
    document.getElementById("profileAvatarInput").value = user.avatar;
    document.getElementById("profileType").value = user.role;
  });
}

const saveProfileBtn = document.getElementById("saveProfileBtn");
if (saveProfileBtn) {
  saveProfileBtn.addEventListener("click", async () => {
    const name = document.getElementById("profileName").value.trim();
    const avatar = document.getElementById("profileAvatarInput").value.trim();
    const role = document.getElementById("profileType").value;

    const user = JSON.parse(localStorage.getItem("user"));

    // Update Supabase table
    await supabaseClient.from("user_profiles").update({
      username: name,
      profile_image: avatar,
      role: role
    }).eq("id", user.id);

    // Update localStorage & UI
    localStorage.setItem("user", JSON.stringify({
      ...user,
      username: name,
      avatar: avatar,
      role: role
    }));

    userName.textContent = `Hello, ${name}`;
    userType.textContent = `(${role})`;
    userAvatar.src = avatar || "images/profile-placeholder.png";

    profileModal.style.display = "none";
  });
}

// =============================
// AUTO-POPULATE PROFILE IN NAV
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const savedUser = JSON.parse(localStorage.getItem("user"));
  if (savedUser && userProfile) {
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    userProfile.style.display = "flex";
    userName.textContent = `Hello, ${savedUser.username}`;
    userType.textContent = `(${savedUser.role})`;
    userAvatar.src = savedUser.avatar || "images/profile-placeholder.png";
  }
});
