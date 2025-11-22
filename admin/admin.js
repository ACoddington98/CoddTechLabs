const SUPABASE_URL = "https://qiobjgsmvalwknijuube.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_BfFRc4t5A_F94S4KrD4s3A_VwtlanUM";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const messagesDiv = document.getElementById("messages");
let messages = [];

function renderMessages(messagesList) {
  messagesDiv.innerHTML = messagesList.map(msg => `
    <div class="message ${msg.is_read ? 'read' : 'unread'}">
      <strong>${msg.name} (${msg.email})</strong>
      ${!msg.is_read ? '<span class="new-badge">NEW</span>' : ''}
      <p>${msg.message}</p>
      <small>${new Date(msg.created_at).toLocaleString()}</small>
      <button onclick="markRead(${msg.id})">Mark Read</button>
      <button onclick="deleteMessage(${msg.id})">Delete</button>
    </div>
    <hr>
  `).join("");
}

async function fetchMessages() {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    messagesDiv.innerText = "Failed to load messages";
    return;
  }

  messages = data;
  renderMessages(messages);
}

async function markRead(id) {
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("id", id);
}

async function deleteMessage(id) {
  await supabase
    .from("messages")
    .delete()
    .eq("id", id);
}

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

// Real-time subscription
supabase
  .channel('public:messages')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, payload => {
    fetchMessages(); // refresh messages on any change
  })
  .subscribe();

// Initial load
fetchMessages();
