# V2V Zetamac Buffed: An Enhanced Arithmetic Practice Game 🧠

![V2V Zetamac Buffed](image.png)

V2V Zetamac Buffed is a web-based arithmetic game inspired by the classic Zetamac speed drill. While the original is excellent for raw practice, it lacks feedback for targeted improvement. This version "buffs" the experience by adding a comprehensive post-game analysis dashboard to help you identify and work on your specific weaknesses.

---

## Why This App?

The goal of mental math practice is to get faster and more accurate. However, improvement requires understanding where you're struggling. The original Zetamac shows you a final score but leaves you wondering:

- **Which specific questions took me the longest?**
- **Am I weaker at multiplication or division?**
- **What specific numbers or factors are slowing me down?**

This app was built to answer those questions. It logs every correct answer, tracking the time taken and attempts, then presents it all in a clear, actionable report.

---

## Core Features

- **Classic Timed Drill:** A fast-paced arithmetic game with customizable operations, number ranges, and duration.
- **Detailed Analysis Dashboard:** After each session, view a full report of your performance.
- **Per-Question Breakdown:** See exactly how long you spent on each problem.
- **Performance Summary:** Automatically identifies your slowest category (e.g., multiplication) to highlight your weakest area.
- **Shareable Settings:** Game settings are encoded in the URL, making it easy to share your custom configurations.
- **Customizable Ranges:** Adjust the difficulty for each operation type independently.

---

## How to Set It Up

This is a simple, static web application with no backend or build steps required.

### Running Locally

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/your-username/v2v-zetamac-buffed.git
   ```
2. Navigate to the project directory:
   ```bash
   cd v2v-zetamac-buffed
   ```
3. Open the `index.html` file in any modern web browser.

That's it! No installation, no dependencies, no build process.

### Live Demo via GitHub Pages

This project can be easily deployed for free using GitHub Pages:

1. Push your code to a GitHub repository.
2. In the repository, go to **Settings > Pages**.
3. Under "Branch," select `main` and `/root`, then click **Save**.
4. Wait a minute for it to build, and your live site will be available at:
   ```
   https://your-username.github.io/v2v-zetamac-buffed/
   ```

---

## How to Use

1. **Configure Your Game:**

   - Select which operations you want to practice (addition, subtraction, multiplication, division)
   - Adjust the number ranges for each operation type
   - Choose your game duration (30 seconds to 10 minutes)

2. **Start Playing:**

   - Click "Start" to begin the timed drill
   - Type your answers and press Enter (or just keep typing - correct answers auto-submit!)
   - Watch your score and remaining time at the top

3. **Review Your Performance:**

   - After time runs out, view your comprehensive analysis
   - See which questions took the longest
   - Identify your weakest operation category
   - Review every problem you solved with timing data

4. **Share Your Settings:**
   - Notice the URL changes when you start a game
   - Copy and share that URL to challenge friends with the same settings!

---

## Technology Stack

This project is built with pure web technologies:

- **HTML5** - Structure and content
- **CSS3** - Styling with modern flexbox layouts and gradients
- **Vanilla JavaScript** - All game logic, no frameworks required

---

## Project Structure

```
v2v-zetamac-buffed/
├── index.html      # Main HTML structure
├── style.css       # All styling and visual design
├── script.js       # Game logic, analysis, and URL encoding
├── image.png       # Screenshot/preview image
└── README.md       # This file
```

---

## Browser Compatibility

Works on all modern browsers:

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

---

## Contributing

Feel free to fork this repository and submit pull requests! Some ideas for future enhancements:

- Dark mode toggle
- More detailed statistics (average by number range, etc.)
- Sound effects and animations
- Mobile-optimized layout
- Leaderboard system

---

## License

This project is open source and available under the MIT License.

---

## Acknowledgments

Inspired by the original [Zetamac](https://arithmetic.zetamac.com/) arithmetic game. This project aims to enhance the learning experience with detailed feedback and analysis.

---

**Built with ❤️ for learners who want to level up their mental math skills.**
