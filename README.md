# Clip It Tycoon

## 🎮 About The Game

Clip It Tycoon is a single-page web application and progressive web app (PWA) that simulates the life of a social media clipper. Start with nothing, and climb your way to the top of the content creation world!

-   **Clip Streamers:** Watch your favorite (simulated) streamers and capture their most viral moments.
-   **Edit Clips:** Use the "CapCut" editor to perfect your clips.
-   **Go Viral on TikTok:** Post your creations, choose catchy titles and hashtags, and watch the views, likes, and followers roll in.
-   **Earn Money:** Monetize your views and grow your virtual bank account.
-   **Become a Partner:** Reach 10,000 followers to unlock the TikTok Partner Program for better payouts.
-   **Join Campaigns:** Take on special campaigns from streamers in the "Whop" app for massive rewards.
-   **Fully Offline:** Built as a PWA with a service worker, all your progress is saved in `localStorage`, allowing you to play anywhere, anytime, even without an internet connection.

The entire game is simulated client-side with no backend or external APIs required for gameplay.

## ✨ Features

-   **iPhone UI Simulation:** An immersive user interface designed to look and feel like you're playing on a smartphone.
-   **Clipping Mini-Game:** A skill-based game to test your reflexes.
-   **Dynamic Social Media Feed:** See your posted clips and watch their stats grow.
-   **Progression System:** Level up, earn more money, and unlock new features like the Whop marketplace.
-   **Persistent State:** Game progress is automatically saved to your browser's local storage.
-   **Installable PWA:** Add "Clip It Tycoon" to your home screen for an app-like experience.

## 🚀 Getting Started

This project is a zero-dependency, single-page application that runs directly in any modern web browser.

### Running on GitHub Pages

The game is designed to be hosted on GitHub Pages. Simply fork this repository, and enable GitHub Pages in your repository's settings (Settings -> Pages -> Source -> Deploy from a branch -> select `main` branch and `/ (root)` folder).

### Running Locally

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/your-repository-name.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd your-repository-name
    ```
3.  Serve the files using a simple local web server. For example, using Python:
    ```bash
    # For Python 3
    python -m http.server
    
    # Or using Node.js with the 'serve' package
    npx serve
    ```
4.  Open your browser and navigate to `http://localhost:8000` (or the port provided by your server).

## 🛠️ Built With

-   **React 19** (via ESM import)
-   **TypeScript**
-   **Tailwind CSS** (via CDN)
-   **Progressive Web App (PWA)** features (Service Worker, Manifest)
-   **No bundler, no build step!** - Just pure browser power.
