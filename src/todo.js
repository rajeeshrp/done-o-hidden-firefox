const taskList = document.getElementById("task-list");
const progressBar = document.getElementById("progress");
const statusText = document.getElementById("status");
const domain = new URLSearchParams(window.location.search).get('domain');

async function setDomain() {
  const domainNameElem = document.getElementById("domain-name");
  domainNameElem.textContent = domain;
}

async function renderTasks() {
  const data = await browser.storage.local.get(["tasks"]);
  const tasks = data.tasks || [];
  
  taskList.innerHTML = "";
  
  if (tasks.length === 0) {
    taskList.innerHTML = "<li>No tasks added yet! Use the extension popup to add some.</li>";
    updateUI(0);
    return;
  }

  let completedCount = 0;

  tasks.forEach((task, index) => {
    if (task.completed) completedCount++;
    
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    
    checkbox.addEventListener("change", async () => {
      tasks[index].completed = checkbox.checked;
      await browser.storage.local.set({ tasks });
      renderTasks(); // Re-render to update percentages and check if unlocked
    });

    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(task.text));
    taskList.appendChild(li);
  });

  const percent = Math.round((completedCount / tasks.length) * 100);
  updateUI(percent);
}

function updateUI(percent) {
  progressBar.style.width = percent + "%";
  statusText.textContent = `${percent}% Completed`;
  
  if (percent === 100) {
    statusText.innerHTML = `🎉 <strong>100% Done! You can now access ${domain}.</strong>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setDomain();
  renderTasks();
});

