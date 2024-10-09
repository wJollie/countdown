// Function to set a cookie
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie =
    name + "=" + JSON.stringify(value) + ";" + expires + ";path=/";
}

// Function to get a cookie
function getCookie(name) {
  let cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    let [key, value] = cookie.split("=");
    key = key.trim();
    if (key === name) return JSON.parse(decodeURIComponent(value));
  }
  return null;
}

function calculateProgress() {
  try {
    // Get selected start and end dates from the input fields
    const startDateInput = document.getElementById("start-date").value;
    const endDateInput = document.getElementById("end-date").value;

    if (!startDateInput || !endDateInput) {
      throw new Error("Please enter both start and end dates.");
    }

    // Get today's date as a string in "YYYY-MM-DD" format
    const today = new Date();
    const todayDateString = today.toISOString().split("T")[0];
    console.log("Today's Date (YYYY-MM-DD):", todayDateString);

    // Compare as strings: "YYYY-MM-DD"
    if (todayDateString < startDateInput || todayDateString > endDateInput) {
      console.error(
        "Error: Today's date is outside the start and end date range."
      );
      alert("Today's date is outside the selected start and end date range.");
      return;
    }

    // Parse the input dates as Date objects for calculations
    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

    // Calculate total days in the school year
    const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
    console.log("Total Days:", totalDays);

    const daysPassed =
      (new Date(todayDateString) - startDate) / (1000 * 60 * 60 * 24);
    console.log("Days Passed:", daysPassed);

    const daysLeft = totalDays - daysPassed;
    console.log("Days Left:", daysLeft);

    // Calculate school year progress
    const yearPercentage = Math.min(
      (daysPassed / totalDays) * 100,
      100
    ).toFixed(2);
    console.log("Year Percentage:", yearPercentage);

    // Update the DOM elements for progress bar and days left
    document.getElementById("year-progress-bar").style.width =
      yearPercentage + "%";
    document.getElementById(
      "year-percentage-text"
    ).innerText = `${yearPercentage}%`;
    document.getElementById("days-left").innerText = `Days Left: ${Math.floor(
      daysLeft
    )}`;

    // Save start and end dates in a cookie
    setCookie(
      "schoolCountdown",
      { startDate: startDateInput, endDate: endDateInput },
      7
    );
  } catch (error) {
    console.error("An error occurred:", error.message);
    alert(error.message);
  }
}

// Load Progress from Cookie
function loadProgress() {
  const cookieData = getCookie("schoolCountdown");
  if (cookieData) {
    document.getElementById("start-date").value =
      cookieData.startDate.split("T")[0];
    document.getElementById("end-date").value =
      cookieData.endDate.split("T")[0];
    calculateProgress(); // Recalculate to update progress bar
  }
}

// Reset Progress and Clear Cookie
function resetProgress() {
  document.cookie =
    "schoolCountdown=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.getElementById("start-date").value = "";
  document.getElementById("end-date").value = "";
  document.getElementById("year-progress-bar").style.width = "0%";
  document.getElementById("year-percentage-text").innerText = `0%`;
  document.getElementById("days-left").innerText = "";
}

// Load progress on page load
window.onload = loadProgress;
