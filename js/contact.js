<section class="contact">
  <h2>Contact Me</h2>
  <form id="contactForm">
    <label for="name">Name</label>
    <input type="text" id="name" name="name" required>

    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>

    <label for="message">Message</label>
    <textarea id="message" name="message" rows="5" required></textarea>

    <button type="submit">Send Message</button>
  </form>

  <p>Or email me directly at <a href="mailto:AustinCoddington@CoddTechLabs.com">AustinCoddington@CoddTechLabs.com</a></p>

  <p id="formStatus"></p>
</section>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/contact.js"></script>
