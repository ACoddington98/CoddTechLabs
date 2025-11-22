// -------------------------------
// Supabase setup
// -------------------------------
const SUPABASE_URL = "https://qiobjgsmvalwknijuube.supabase.co";  // your project URL
const SUPABASE_ANON_KEY = "sb_publishable_BfFRc4t5A_F94S4KrD4s3A_VwtlanUM"; // your anon key
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// -------------------------------
// LOGIN LOGIC
// -------------------------------
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

// -------------------------------
// PROTECT ADMIN + LOAD MESSAGES
// -------------------------------
if (document.getElementById("messages")) {
  document.addEventListener("DOMContentLoaded", async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = "/admin/login.html";
      return;
    }

    // Fetch messages
    let { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      document.getElementById("messages").innerText = "Failed to load messages";
      return;
    }

    // Display messages
    renderMessages(data);

    // SEARCH
    const searchBox = document.getElementById("searchBox");
    searchBox.addEventListener("input", (e) => {
      const filtered = data.filter(m =>
        m.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        m.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
        m.message.toLowerCase().includes(e.target.value.toLowerCase())
      );
      renderMessages(filtered);
    });

    // SORT
    document.getElementById("sortNewest").addEventListener("click", () => {
      renderMessages([...data].sort((a,b)=> new Date(b.created_at) - new Date(a.created_at)));
    });
    document.getElementById("sortOldest").addEventListener("click", () => {
      renderMessages([...data].sort((a,b)=> new Date(a.created_at) - new Date(b.created_at)));
    });

    // LOGOUT
    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await supabase.auth.signOut();
      window.location.href = "/admin/login.html";
    });
  });
}

// -------------------------------
// RENDER FUNCTION
// -------------------------------
function renderMessages(messages) {
  const container = document.getElementById("messages");
  container.innerHTML = messages.map(msg => `
    <div class="message">
      <strong>${msg.name} (${msg.email})</strong>
      <p>${msg.message}</p>
      <small>${new Date(msg.created_at).toLocaleString()}</small>
    </div>
    <hr>
  `).join("");
}
