// -------------------------------
// Supabase setup
// -------------------------------
const SUPABASE_URL = "https://qiobjgsmvalwknijuube.supabase.co";  // your project URL
const SUPABASE_ANON_KEY = "sb_publishable_BfFRc4t5A_F94S4KrD4s3A_VwtlanUM"; // your anon key
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// -------------------------------
// Form submission
// -------------------------------
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  const { data, error } = await supabase
    .from("messages")
    .insert([{ name, email, message }]);

  if (error) {
    formStatus.innerText = "Failed to send message. Please try again.";
    console.error(error);
  } else {
    formStatus.innerText = "Message sent! Thank you.";
    contactForm.reset();
  }
});
