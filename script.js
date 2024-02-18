// Getting all required elements
const inputField = document.querySelector(".input-field textarea"),
  todoLists = document.querySelector(".todoLists"),
  pendingNum = document.querySelector(".pending-num"),
  clearButton = document.querySelector(".clear-button");

// Function to show notification
function showNotification(message) {
  // Check if the browser supports notifications
  if (!("Notification" in window)) {
    console.log("This browser does not support system notifications");
    return;
  }

  // Check if the user has granted permission for notifications
  if (Notification.permission === "granted") {
    new Notification("Todo List Notification", { body: message });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("Todo List Notification", { body: message });
      }
    });
  }
}

// Add task while we put value in the text area and press enter
inputField.addEventListener("keyup", (e) => {
  let inputVal = inputField.value.trim();

  // If enter button is clicked and inputted value length is greater than 0.
  if (e.key === "Enter" && inputVal.length > 0) {
    let taskDateTime = document.querySelector('#taskDateTime').value;
    let liTag = `<li class="list pending" onclick="handleStatus(this)">
      <input type="checkbox" />
      <span class="task">${inputVal}</span>
      <span class="datetime">${taskDateTime}</span>
      <i class="uil uil-trash" onclick="deleteTask(this)"></i>
    </li>`;

    todoLists.insertAdjacentHTML("beforeend", liTag);
    inputField.value = "";
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

// Rest of your existing code remains unchanged
// ...

// Function to check and uncheck the checkbox while clicking on the task
function handleStatus(e) {
  const checkbox = e.querySelector("input");
  checkbox.checked = !checkbox.checked;
  e.classList.toggle("pending");
  allTasks();
}

// Function to delete task while clicking on the delete icon
function deleteTask(e) {
  e.parentElement.remove();
  allTasks();
}

// Rest of your existing code remains unchanged
// ...

// Event listener for Clear All button
clearButton.addEventListener("click", () => {
  todoLists.innerHTML = "";
  allTasks();
});
