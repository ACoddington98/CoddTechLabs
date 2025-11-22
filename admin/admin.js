// Supabase setup
const SUPABASE_URL = "https://qiobjgsmvalwknijuube.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_BfFRc4t5A_F94S4KrD4s3A_VwtlanUM";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", async () => {
  const messagesDiv = document.getElementById("messages");

  // Fetch messages
  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    messagesDiv.innerText = "Failed to load messages";
    return;
  }

  renderMessages(messages);

  // SEARCH
  const searchBox = document.getElementById("searchBox");
  searchBox.addEventListener("input", (e) => {
    const filtered = messages.filter(m =>
      m.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
      m.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
      m.message.toLowerCase().includes(e.target.value.toLowerCase())
    );
    renderMessages(filtered);
  });

  // SORT
  document.getElementById("sortNewest").addEventListener("click", () => {
    renderMessages([...messages].sort((a,b)=> new Date(b.created_at) - new Date(a.created_at)));
  });
  document.getElementById("sortOldest").addEventListener("click", () => {
    renderMessages([...messages].sort((a,b)=> new Date(a.created_at) - new Date(b.created_at)));
  });
});

// Render messages
function renderMessages(messages) {
  const container = document.getElementById("messages");
  container.innerHTML = messages.map(msg => `
    <div class="message ${msg.is_read ? 'read' : 'unread'}">
      <strong>${msg.name} (${msg.email})</strong>
      <p>${msg.message}</p>
      <small>${new Date(msg.created_at).toLocaleString()}</small>
      <button onclick="markRead(${msg.id})">Mark Read</button>
      <button onclick="deleteMessage(${msg.id})">Delete</button>
    </div>
    <hr>
  `).join("");
}

// MARK AS READ
async function markRead(id) {
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("id", id);

  // Refresh
  location.reload();
}

// DELETE
async function deleteMessage(id) {
  await supabase
    .from("messages")
    .delete()
    .eq("id", id);

  // Refresh
  location.reload();
}
