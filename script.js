// Getting all required elements
const inputField = document.querySelector(".input-field textarea"),
  taskDateTimeInput = document.getElementById("taskDateTime"),
  todoLists = document.querySelector(".todoLists"),
  pendingNum = document.querySelector(".pending-tasks .pending-num"), // Update the selector for pendingNum
  clearButton = document.querySelector(".pending-tasks .clear-button"); // Update the selector for clearButton

// We will call this function while adding, deleting, and checking-unchecking the task
function allTasks() {
  let tasks = document.querySelectorAll(".pending");

  // If tasks' length is 0, then pending num text content will be "no", if not, then pending num value will be task's length
  pendingNum.textContent = tasks.length === 0 ? "no" : tasks.length;

  let allLists = document.querySelectorAll(".list");
  if (allLists.length > 0) {
    todoLists.style.marginTop = "20px";
    clearButton.style.pointerEvents = "auto";
    return;
  }
  todoLists.style.marginTop = "0px";
  clearButton.style.pointerEvents = "none";
}

// Function to show notification
function showNotification(message) {
  if (Notification.permission === "granted" && document.visibilityState !== "visible") {
    navigator.serviceWorker.getRegistration().then(function(reg) {
      if (reg) {
        reg.showNotification("Reminder", {
          body: message,
        });
      } else {
        console.error("Service Worker registration not found");
      }
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function(permission) {
      if (permission === "granted") {
        showNotification(message);
      }
    });
  }
}

// Add task while we put value in the text area and press enter
inputField.addEventListener("keyup", (e) => {
  let inputVal = inputField.value.trim(); // Trim function removes space of front and back of the inputted value

  // If enter button is clicked and inputted value length is greater than 0.
  if (e.key === "Enter" && inputVal.length > 0) {
    let taskDateTime = taskDateTimeInput.value; // Get date and time from the input
    let liTag = `<li class="list pending" onclick="handleStatus(this)">
      <input type="checkbox" />
      <span class="task">${inputVal}</span>
      <span class="datetime">${taskDateTime}</span> <!-- Added span for date and time -->
      <i class="uil uil-trash" onclick="deleteTask(this)"></i>
    </li>`;

    todoLists.insertAdjacentHTML("beforeend", liTag); // Inserting li tag inside the todoList div
    inputField.value = ""; // Removing value from the input field
    allTasks();

    // Set a reminder notification
    const reminderDateTime = new Date(taskDateTime);
    const now = new Date();
    const timeDifference = reminderDateTime - now;

    if (timeDifference > 0) {
      setTimeout(() => {
        showNotification(`Reminder: ${inputVal}`);
      }, timeDifference);
    }
  }
});

// Checking and unchecking the checkbox while we click on the task
function handleStatus(e) {
  const checkbox = e.querySelector("input"); // Getting checkbox
  checkbox.checked = checkbox.checked ? false : true;
  e.classList.toggle("pending");
  allTasks();
}

// Deleting task while we click on the delete icon.
function deleteTask(e) {
  e.parentElement.remove(); // Getting the parent element and removing it
  allTasks();
}

// Deleting all the tasks while we click on the clear button.
clearButton.addEventListener("click", () => {
  todoLists.innerHTML = "";
  allTasks();
});
