document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const views = {
    settings: document.getElementById("settings-view"),
    game: document.getElementById("game-view"),
    results: document.getElementById("results-view"),
  };
  // Game View Elements
  const startBtn = document.getElementById("start-btn");
  const timerDisplay = document.getElementById("timer");
  const scoreDisplay = document.getElementById("score");
  const problemText = document.getElementById("problem-text");
  const answerInput = document.getElementById("answer-input");
  const paceDisplay = document.getElementById("pace-tracker");

  // Results View Elements
  const finalScoreVal = document.getElementById("final-score-val");
  const totalTimeVal = document.getElementById("total-time-val");
  const avgTimeVal = document.getElementById("avg-time-val");
  const targetPaceVal = document.getElementById("target-pace-val"); // NEW
  const tryAgainBtn = document.getElementById("try-again-btn");
  const changeSettingsBtn = document.getElementById("change-settings-btn");
  const analysisTableBody = document.querySelector("#analysis-table tbody");
  const analysisSummary = document.getElementById("analysis-summary");
  const practiceProblemText = document.getElementById("practice-problem-text");
  const practiceAnswerInput = document.getElementById("practice-answer-input");

  // Game State
  let gameSettings = {};
  let score = 0;
  let timerInterval = null;
  let currentProblem = null;
  let problemHistory = [];
  let questionStartTime = 0;
  let currentAttempts = [];

  // Timing State
  let gameStartTime = 0;
  let gameDuration = 0;

  // Endless practice mode
  let practiceCategory = null;

  // Sorting State
  let currentSort = { key: "index", direction: "asc" };

  const showView = (viewName) => {
    Object.values(views).forEach((view) => view.classList.add("hidden"));
    views[viewName].classList.remove("hidden");
  };

  const getSettingsFromForm = () => ({
    ops: {
      add: document.getElementById("addition").checked,
      sub: document.getElementById("subtraction").checked,
      mul: document.getElementById("multiplication").checked,
      div: document.getElementById("division").checked,
    },
    ranges: {
      add: [
        parseInt(document.getElementById("add-min").value),
        parseInt(document.getElementById("add-max").value),
        parseInt(document.getElementById("add-min-2").value),
        parseInt(document.getElementById("add-max-2").value),
      ],
      mul: [
        parseInt(document.getElementById("mul-min").value),
        parseInt(document.getElementById("mul-max").value),
        parseInt(document.getElementById("mul-min-2").value),
        parseInt(document.getElementById("mul-max-2").value),
      ],
    },
    duration: parseInt(document.getElementById("duration").value),
    targetScore: parseInt(document.getElementById("target-score").value) || 0,
  });

  const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const generateProblem = (forcedCategory = null) => {
    const enabledOps = Object.keys(gameSettings.ops).filter(
      (op) => gameSettings.ops[op]
    );
    if (enabledOps.length === 0)
      return { text: "Enable an operation!", answer: null };

    const op =
      forcedCategory && enabledOps.includes(forcedCategory)
        ? forcedCategory
        : enabledOps[getRandomInt(0, enabledOps.length - 1)];

    let n1, n2, text, answer;
    switch (op) {
      case "add":
        n1 = getRandomInt(
          gameSettings.ranges.add[0],
          gameSettings.ranges.add[1]
        );
        n2 = getRandomInt(
          gameSettings.ranges.add[2],
          gameSettings.ranges.add[3]
        );
        text = `${n1} + ${n2} = `;
        answer = n1 + n2;
        break;
      case "sub":
        n1 = getRandomInt(
          gameSettings.ranges.add[0],
          gameSettings.ranges.add[1]
        );
        n2 = getRandomInt(
          gameSettings.ranges.add[2],
          gameSettings.ranges.add[3]
        );
        let sum = n1 + n2;
        text = `${sum} - ${n1} = `;
        answer = n2;
        break;
      case "mul":
        n1 = getRandomInt(
          gameSettings.ranges.mul[0],
          gameSettings.ranges.mul[1]
        );
        n2 = getRandomInt(
          gameSettings.ranges.mul[2],
          gameSettings.ranges.mul[3]
        );
        text = `${n1} × ${n2} = `;
        answer = n1 * n2;
        break;
      case "div":
        n1 = getRandomInt(
          gameSettings.ranges.mul[0],
          gameSettings.ranges.mul[1]
        );
        n2 = getRandomInt(
          gameSettings.ranges.mul[2],
          gameSettings.ranges.mul[3]
        );
        let product = n1 * n2;
        text = `${product} ÷ ${n1} = `;
        answer = n2;
        break;
    }
    return { text, answer, type: op };
  };

  const nextProblem = () => {
    currentProblem = generateProblem(practiceCategory);
    currentAttempts = [];
    questionStartTime = Date.now();

    if (practiceCategory) {
      practiceProblemText.textContent = currentProblem.text;
      practiceAnswerInput.value = "";
      practiceAnswerInput.focus();
    } else {
      problemText.textContent = currentProblem.text;
      answerInput.value = "";
      answerInput.focus();
    }
  };

  const checkAnswer = (inputElement) => {
    const userAnswer = inputElement.value;
    if (userAnswer === "" || isNaN(parseInt(userAnswer))) return;

    currentAttempts.push(userAnswer);

    if (parseInt(userAnswer) === currentProblem.answer) {
      if (!practiceCategory) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        const timeTaken = (Date.now() - questionStartTime) / 1000;
        problemHistory.push({
          problem: currentProblem.text,
          answer: currentProblem.answer,
          type: currentProblem.type,
          time: timeTaken,

          attempts: [...currentAttempts],
          originalIndex: problemHistory.length + 1, // Store original index
        });

        updateTimerAndPace();
      }
      nextProblem();
    }
  };

  const startGame = () => {
    gameSettings = getSettingsFromForm();
    score = 0;
    gameDuration = gameSettings.duration;
    problemHistory = [];
    practiceCategory = null;

    scoreDisplay.textContent = `Score: 0`;
    timerDisplay.textContent = `Time: ${gameDuration}`;
    timerDisplay.classList.remove("timer-goal-met"); // Reset visual style

    // Setup Pace Display
    if (gameSettings.targetScore > 0) {
      paceDisplay.classList.remove("hidden");
      paceDisplay.textContent = "±0.0";
      paceDisplay.className = "pace-neutral";
    } else {
      paceDisplay.classList.add("hidden");
    }

    showView("game");
    nextProblem();

    gameStartTime = Date.now();
    timerInterval = setInterval(updateTimerAndPace, 100);
  };

  const updateTimerAndPace = () => {
    const now = Date.now();
    const elapsedTime = (now - gameStartTime) / 1000;
    const timeLeft = Math.ceil(gameDuration - elapsedTime);

    // 1. Timer Logic: Always show the countdown
    timerDisplay.textContent = `Time: ${Math.max(0, timeLeft)}`;
    timerDisplay.classList.remove("timer-goal-met"); // Remove the old green style from timer

    // 2. Pace Tracker Logic
    if (gameSettings.targetScore > 0) {
      if (score >= gameSettings.targetScore) {
        // GOAL MET LOGIC: Override the pace tracker, not the timer
        paceDisplay.textContent = "GOAL MET!";

        // Force green styling
        paceDisplay.className = ""; // Reset classes
        paceDisplay.classList.add("pace-ahead");

        // Optional: Make it pop a bit more
        paceDisplay.style.fontWeight = "900";
        paceDisplay.style.fontSize = "1.6rem";
      } else {
        // STANDARD PACE LOGIC
        const targetPacePerQuestion = gameDuration / gameSettings.targetScore;
        const expectedTimeForScore = score * targetPacePerQuestion;
        const diff = elapsedTime - expectedTimeForScore;

        const sign = diff > 0 ? "+" : "";
        paceDisplay.textContent = `${sign}${diff.toFixed(1)}`;

        // Reset styles for normal tracking
        paceDisplay.style.fontWeight = "";
        paceDisplay.style.fontSize = "";
        paceDisplay.classList.remove(
          "pace-ahead",
          "pace-behind",
          "pace-neutral"
        );

        if (diff <= 0) {
          paceDisplay.classList.add("pace-ahead"); // Green
        } else {
          paceDisplay.classList.add("pace-behind"); // Red
        }
      }
    }

    if (elapsedTime >= gameDuration) {
      endGame();
    }
  };

  const endGame = () => {
    clearInterval(timerInterval);
    showView("results");
    displayAnalysis();
    nextProblem();
  };

  const displayAnalysis = () => {
    const answeredCount = problemHistory.length;
    const avgTime = answeredCount > 0 ? gameDuration / answeredCount : 0;

    // NEW: Calculate Target Pace
    let targetPace = 0;
    if (gameSettings.targetScore > 0) {
      targetPace = gameDuration / gameSettings.targetScore;
      targetPaceVal.textContent = `${targetPace.toFixed(2)}s`;
    } else {
      targetPaceVal.textContent = "--";
    }

    finalScoreVal.textContent = score;
    totalTimeVal.textContent = `${gameDuration}s`;
    avgTimeVal.textContent = `${avgTime.toFixed(2)}s`;

    analysisTableBody.innerHTML = "";
    if (answeredCount === 0) {
      analysisSummary.innerHTML =
        "You didn't answer any questions correctly. Try again!";
      practiceCategory = null;
      return;
    }

    // Initial render with default sort (index)
    // Calculate stats and set practice category
    const slowestProblem = problemHistory.reduce(
      (max, p) => (p.time > max.time ? p : max),
      problemHistory[0]
    );
    const categoryStats = {};
    problemHistory.forEach((p) => {
      if (!categoryStats[p.type])
        categoryStats[p.type] = { totalTime: 0, count: 0 };
      categoryStats[p.type].totalTime += p.time;
      categoryStats[p.type].count++;
    });

    let slowestCategory = "";
    let maxAvgTime = 0;
    for (const cat in categoryStats) {
      const avg = categoryStats[cat].totalTime / categoryStats[cat].count;
      if (avg > maxAvgTime) {
        maxAvgTime = avg;
        slowestCategory = cat;
      }
    }

    analysisSummary.innerHTML = `You answered <strong>${answeredCount}</strong> questions correctly.<br> Your slowest category was <span class="highlight">${slowestCategory.toUpperCase()}</span>. Now entering practice mode for this category.`;

    practiceCategory = slowestCategory;

    renderAnalysisTable();
  };

  const renderAnalysisTable = () => {
    // Sort data
    const sortedHistory = [...problemHistory].sort((a, b) => {
      let valA = a[currentSort.key];
      let valB = b[currentSort.key];

      // Handle special cases
      if (currentSort.key === "index") {
        valA = a.originalIndex;
        valB = b.originalIndex;
      } else if (currentSort.key === "attempts") {
        valA = a.attempts.length;
        valB = b.attempts.length;
      }

      if (valA < valB) return currentSort.direction === "asc" ? -1 : 1;
      if (valA > valB) return currentSort.direction === "asc" ? 1 : -1;
      return 0;
    });

    // Calculate Target Pace for highlighting
    let targetPace = 0;
    if (gameSettings.targetScore > 0) {
      targetPace = gameDuration / gameSettings.targetScore;
    }

    analysisTableBody.innerHTML = "";
    sortedHistory.forEach((p) => {
      const row = document.createElement("tr");

      // Color coding logic
      let timeClass = "";
      if (targetPace > 0) {
        if (p.time <= targetPace) {
          timeClass = "time-success"; // Green (Faster than target pace)
        } else {
          timeClass = "time-fail"; // Red (Slower than target pace)
        }
      }

      row.innerHTML = `
        <td>${p.originalIndex}</td>
        <td>${p.problem} <strong>${p.answer}</strong></td>
        <td class="${timeClass}">${p.time.toFixed(2)}</td>
        <td>${p.attempts.length}</td>
        <td>${p.attempts.join(", ")}</td>
      `;
      analysisTableBody.appendChild(row);
    });

    // Update header sort indicators
    document.querySelectorAll("#analysis-table th.sortable").forEach((th) => {
      th.classList.remove("sort-asc", "sort-desc");
      if (th.dataset.sort === currentSort.key) {
        th.classList.add(currentSort.direction === "asc" ? "sort-asc" : "sort-desc");
      }
    });
  };

  const handleSort = (key) => {
    if (currentSort.key === key) {
      currentSort.direction = currentSort.direction === "asc" ? "desc" : "asc";
    } else {
      currentSort.key = key;
      currentSort.direction = "asc"; // Default to asc for new key
    }
    renderAnalysisTable();

  };

  // Event Listeners
  startBtn.addEventListener("click", startGame);
  answerInput.addEventListener("input", () => checkAnswer(answerInput));
  practiceAnswerInput.addEventListener("input", () =>
    checkAnswer(practiceAnswerInput)
  );
  tryAgainBtn.addEventListener("click", startGame);
  changeSettingsBtn.addEventListener("click", () => showView("settings"));

  // Sort Event Listeners
  document.querySelectorAll("#analysis-table th.sortable").forEach((th) => {
    th.addEventListener("click", () => {
      handleSort(th.dataset.sort);
    });
  });

  showView("settings");
});
