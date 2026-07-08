const form = document.getElementById("signupForm");
const container = document.getElementById("formContainer");
const mailInput = document.getElementById("mailInput");
const passInput = document.getElementById("passInput");
const errorBanner = document.getElementById("errorBanner");
const originalForm = container.innerHTML

// Play sound function
let playSuccessSound = () => {
  const audioCtx = new AudioContext();

  // First tone
  const osc1 = audioCtx.createOscillator();
  const gain1 = audioCtx.createGain();
  osc1.connect(gain1);
  gain1.connect(audioCtx.destination);
  osc1.frequency.value = 523; // C5
  gain1.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
  osc1.start(audioCtx.currentTime);
  osc1.stop(audioCtx.currentTime + 0.3);

  // Second tone (slightly higher, plays right after)
  const osc2 = audioCtx.createOscillator();
  const gain2 = audioCtx.createGain();
  osc2.connect(gain2);
  gain2.connect(audioCtx.destination);
  osc2.frequency.value = 659; // E5
  gain2.gain.setValueAtTime(0.3, audioCtx.currentTime + 0.15);
  gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
  osc2.start(audioCtx.currentTime + 0.15);
  osc2.stop(audioCtx.currentTime + 0.5);
}

let clearError = () => {
  document.getElementById("errorBanner").style.display = "none";
  document.getElementById("mailInput").classList.remove("error");
  document.getElementById("passInput").classList.remove("error");
}


let attachSubmitListener = () => {
  const form = document.getElementById("signupForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop the normal page reload

    // Swap in the loading spinner markup
    container.innerHTML = `
    <div class="panel">
      <div id="iconSlot">
        <div class="spinner"></div>
      </div>
      <h1 id="statusTitle">Log in to your account</h1>
      <p class="subtitle" id="statusSubtitle">This won't take long</p>
    </div>
    `;

    const formData = new FormData(form);

    try {
      const response = await fetch("/sign-in", {
        method: "POST",
        body: new URLSearchParams(formData)
      });
      await new Promise(resolve => setTimeout(resolve, 5000));
      if (response.ok) {
        const iconSlot = document.getElementById("iconSlot");
        const title = document.getElementById("statusTitle");
        const subtitle = document.getElementById("statusSubtitle");
        playSuccessSound()

        iconSlot.innerHTML = `
          <div class="check-circle">
            <i class="ti ti-check"></i> 
          </div>
        `;
        title.textContent = "Connected";
        subtitle.textContent = "Welcome";

      }
      else if (response.status === 401){
        container.innerHTML = originalForm
        const errorBanner = document.getElementById("errorBanner");
        const mailInput = document.getElementById("mailInput");
        const passInput = document.getElementById("passInput");

        errorBanner.style.display = "flex";
        mailInput.classList.add("error");
        passInput.classList.add("error");
        passInput.value = "";
        mailInput.focus();

        attachSubmitListener()
      }
      
      else {
        container.innerHTML = "<p>Something went wrong. Please try again.</p>";
      }
    } catch (err) {
      container.innerHTML = "<p>Network error. Please try again.</p>";
      console.log(err)
    }
  });

  // clear error input color
  document.getElementById("mailInput").addEventListener("input", clearError);
  document.getElementById("passInput").addEventListener("input", clearError);
}

attachSubmitListener()
