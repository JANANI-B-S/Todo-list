document.addEventListener("DOMContentLoaded", function () {
  const textarea = document.querySelector('.input-field textarea');
  const taskDateTimeInput = document.getElementById('taskDateTime');
  const todoLists = document.querySelector('.todoLists');
  const clearButton = document.querySelector('.clear-button');
  const pendingNum = document.querySelector('.pending-num');

  let tasks = [];

  // Function to add a new task
  function addTask() {
    const taskText = textarea.value.trim();
    const taskDateTime = taskDateTimeInput.value;

    if (taskText === '') return;

    const task = { text: taskText, datetime: taskDateTime };
    tasks.push(task);

    displayTasks();
    resetInputFields();
  }

  // Function to display tasks in the list
  function displayTasks() {
    todoLists.innerHTML = '';
    tasks.forEach((task, index) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <span>${task.text} - ${task.datetime}</span>
        <button onclick="deleteTask(${index})">Delete</button>
      `;
      todoLists.appendChild(listItem);
    });

    updatePendingTasks();
  }

  // Function to delete a task
  window.deleteTask = function (index) {
    tasks.splice(index, 1);
    displayTasks();
  };

  // Function to update pending tasks count
  function updatePendingTasks() {
    const pendingCount = tasks.length;
    pendingNum.textContent = pendingCount;
  }

  // Function to reset input fields after adding a task
  function resetInputFields() {
    textarea.value = '';
    taskDateTimeInput.value = '';
  }

  // Event listener for adding a task
  textarea.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      addTask();
    }
  });

  // Event listener for Clear All button
  clearButton.addEventListener('click', function () {
    tasks = [];
    displayTasks();
  });

  // Check for tasks with set datetime and show notifications
  setInterval(function () {
    const now = new Date();
    tasks.forEach((task) => {
      const taskDatetime = new Date(task.datetime);
      if (now >= taskDatetime) {
        showNotification(task.text);
        deleteTask(tasks.indexOf(task));
      }
    });
  }, 60000); // Check every minute for task notifications

  // Function to show browser notification
  function showNotification(taskText) {
    if ('Notification' in window) {
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
          new Notification('Todo List Notification', {
            body: `Time to do: ${taskText}`,
          });
        }
      });
    }
  }
});
