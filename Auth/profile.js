const profilePic = document.getElementById("profilePic");
const usernameInput = document.getElementById("username");
const bioInput = document.getElementById("bio");
const status = document.getElementById("status");
const uploadInput = document.getElementById("uploadPic");

let user;

async function loadProfile() {
  const { data: session } = await supabase.auth.getSession();
  user = session.session.user;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  profilePic.src = profile.profile_image;
  usernameInput.value = profile.username;
  bioInput.value = profile.bio || "";
}

document.getElementById("updateProfile").addEventListener("click", async () => {
  let profile_image = profilePic.src;

  if(uploadInput.files.length > 0) {
    const file = uploadInput.files[0];
    const { data, error } = await supabase.storage
      .from("profile-pics")
      .upload(user.id + "/" + file.name, file, { upsert: true });
    
    if(error) return status.innerText = error.message;

    const { data: urlData } = supabase.storage.from("profile-pics").getPublicUrl(user.id + "/" + file.name);
    profile_image = urlData.publicUrl;
  }

  const { error } = await supabase
    .from("user_profiles")
    .update({ username: usernameInput.value, bio: bioInput.value, profile_image })
    .eq("id", user.id);

  if(error) status.innerText = error.message;
  else status.innerText = "Profile updated!";
});

loadProfile();
