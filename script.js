// ======== Elements ========
const lyricsPanel = document.getElementById("lyrics-panel");
const lyricsAlbum = document.getElementById("lyrics-album");
const lyricsText = document.getElementById("lyrics-text");
const audioPlayer = document.createElement("audio"); // hover audio
const bgMusic = document.getElementById("background-music");
const muteBtn = document.getElementById("mute-btn");

let hideLyricsTimeout;
let isMuted = false;

// ======== Background music soft fade-in ========
window.addEventListener("DOMContentLoaded", () => {
  const startBgMusic = () => {
    bgMusic.volume = 0.05; // low volume for soft vibe
    bgMusic.play().catch(() => {
      console.log("Background music blocked until user interaction");
    });
    window.removeEventListener("click", startBgMusic); // only run once
  };

  // Start background music on first click anywhere
  window.addEventListener("click", startBgMusic);
});


// Mute toggle
muteBtn.addEventListener("click", () => {
  isMuted = !isMuted;
  bgMusic.muted = isMuted;
  audioPlayer.muted = isMuted;
  muteBtn.classList.toggle("muted", isMuted);
});


// ======== Lyrics hover functionality ========
document.querySelectorAll(".album-section").forEach(album => {
  const albumTitle = album.querySelector("h2, h3").textContent;

  album.querySelectorAll("ol li").forEach(li => {
    li.addEventListener("mouseenter", () => {
      clearTimeout(hideLyricsTimeout);

      // Show lyrics panel
      lyricsAlbum.textContent = albumTitle;
      lyricsText.textContent = li.dataset.lyrics || "No lyrics available.";
      lyricsPanel.classList.add("show");

      // Play hover audio if provided
      if (li.dataset.audio) {
        audioPlayer.src = li.dataset.audio;
        audioPlayer.currentTime = 0;
        audioPlayer.volume = 0;
        audioPlayer.play().catch(()=>{});
        fadeAudio(audioPlayer, 1, 600); // fade in to full volume
      }
    });

    li.addEventListener("mouseleave", () => {
      // Delay hiding lyrics
      hideLyricsTimeout = setTimeout(() => {
        lyricsPanel.classList.remove("show");
        fadeAudio(audioPlayer, 0, 600); // fade out hover audio
      }, 4000); // 4 seconds
    });
  });
});

// ======== Smooth audio fade function ========
function fadeAudio(audio, targetVolume, duration = 600) {
  const step = 0.01;
  const interval = duration / (Math.abs(targetVolume - audio.volume) / step);
  const fade = setInterval(() => {
    if ((targetVolume > audio.volume && audio.volume < targetVolume) ||
        (targetVolume < audio.volume && audio.volume > targetVolume)) {
      audio.volume = Math.min(Math.max(audio.volume + (targetVolume>audio.volume?step:-step),0),1);
    } else {
      clearInterval(fade);
      if(targetVolume === 0) audio.pause();
    }
  }, interval);
}

// ======== Click particles ========
document.addEventListener("click", function(e) {
  if (e.target.id === "title" || e.target.id === "mute-btn" || e.target.closest(".lyrics-panel")) return;

  for (let i = 0; i < 6; i++) {
    const particle = document.createElement("span");
    particle.classList.add("click-particle");

    const angle = Math.random() * 2 * Math.PI;
    const distance = 20 + Math.random() * 15;
    const dx = Math.cos(angle) * distance + "px";
    const dy = Math.sin(angle) * distance + "px";

    particle.style.left = e.clientX + "px";
    particle.style.top = e.clientY + "px";
    particle.style.setProperty("--dx", dx);
    particle.style.setProperty("--dy", dy);

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 600);
  }
});


