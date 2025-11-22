// Replace with your Supabase credentials
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_PUBLIC_KEY";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Handle login form
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    const status = document.getElementById("loginStatus");

    if (error) {
      status.innerText = "Login failed: " + error.message;
    } else {
      window.location.href = "/admin/admin.html";
    }
  });
}

// Protect admin.html and load messages
if (document.getElementById("messages")) {
  document.addEventListener("DOMContentLoaded", async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = "/admin/login.html";
      return;
    }

    // Load messages
    const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    const container = document.getElementById("messages");
    if (error) {
      container.innerText = "Failed to load messages";
      return;
    }

    container.innerHTML = data.map(msg => `
      <div class="message">
        <strong>${msg.name} (${msg.email})</strong>
        <p>${msg.message}</p>
        <small>${new Date(msg.created_at).toLocaleString()}</small>
      </div>
      <hr>
    `).join("");
  });

  // Logout button
  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin/login.html";
  });
}
