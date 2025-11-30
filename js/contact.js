// Add CSS keyframes for bounce
const style = document.createElement('style');
style.innerHTML = `
@keyframes popupBounce {
  0% { bottom: -100px; opacity: 0; }
  20% { bottom: 30px; opacity: 1; }
  40% { bottom: 15px; }
  60% { bottom: 25px; }
  80% { bottom: 20px; }
  100% { bottom: 20px; }
}
`;
document.head.appendChild(style);

// DOM Elements
const contactForm = document.getElementById("contactForm");

// Create or use an existing popup element
let popup = document.getElementById("contactPopup");
if (!popup) {
  popup = document.createElement("div");
  popup.id = "contactPopup";
  popup.style.position = "fixed";
  popup.style.bottom = "-100px"; // start off-screen
  popup.style.right = "20px";
  popup.style.padding = "15px 25px";
  popup.style.backgroundColor = "#4CAF50";
  popup.style.color = "#fff";
  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
  popup.style.display = "none";
  popup.style.zIndex = "1000";
  popup.style.fontSize = "16px";
  popup.style.opacity = "0";
  popup.style.cursor = "default";
  popup.style.minWidth = "250px";
  popup.style.maxWidth = "350px";
  popup.style.boxSizing = "border-box";
  popup.style.textAlign = "center";

  // Create close button
  const closeBtn = document.createElement("span");
  closeBtn.textContent = "×";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "5px";
  closeBtn.style.right = "10px";
  closeBtn.style.fontSize = "20px";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.userSelect = "none";
  popup.appendChild(closeBtn);

  // Close popup when clicking the X
  closeBtn.addEventListener("click", () => {
    if (popupTimeout) clearTimeout(popupTimeout);
    popup.style.animation = "";
    popup.style.opacity = "0";
    popup.style.bottom = "-100px";
    setTimeout(() => { popup.style.display = "none"; }, 600);
  });

  document.body.appendChild(popup);
}

// Function to show popup with bounce
let popupTimeout;
function showPopup(message) {
  if (popupTimeout) clearTimeout(popupTimeout);

  popup.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) node.remove();
  });

  const textNode = document.createTextNode(message);
  popup.insertBefore(textNode, popup.firstChild);

  popup.style.display = "block";
  popup.style.animation = "popupBounce 0.8s forwards";
  popup.style.boxShadow = "0 12px 25px rgba(0,0,0,0.3)";

  popupTimeout = setTimeout(() => {
    popup.style.opacity = "0";
    popup.style.bottom = "-100px";
    popup.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
    setTimeout(() => { popup.style.display = "none"; }, 600);
  }, 30000);
}

// Handle contact form submission
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  try {
    const { data, error } = await supabase.from('messages').insert([{ name, email, message }]);
    if (error) throw error;

    contactForm.reset();

    showPopup("Message sent! We'll get in contact with you as soon as we can.");

  } catch (err) {
    showPopup("Error sending message. Try again.");
  }
});
