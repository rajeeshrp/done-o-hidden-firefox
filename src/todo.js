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
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.flexDirection = "column";
    li.style.gap = "10px";
    // 1. Summary & confirmation question  
    li.appendChild(document.createTextNode(
        "No tasks added yet! Nothing to do today??"
    )); 
    // 2. Confirmation checkbox and its label
    const confirmRow = document.createElement("label");
    confirmRow.style.display = "flex";
    confirmRow.style.alignItems = "center";
    confirmRow.style.gap = "8px";
    const strongElem = document.createElement('strong');
    // 2A. checkbox  
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", async () => {
      if(checkbox.checked) {
          checkbox.disabled = true;
          let timeLeft = 3;
          strongElem.textContent = "";
          const countDownInterval = setInterval(() => {
              if (timeLeft > 0) {
                  // Refresh the counter
                  strongElem.textContent = `Loading ${domain} in ${timeLeft} seconds..`;
                  statusText.append("🎉 ", strongElem);
              } else {
                  // Load the requested domain.
                  clearInterval(countDownInterval);
                  browser.storage.local.set({ unlocked: true });
                  window.location.href = "https://" + domain;
              }
              timeLeft--;
          }, 1000);
      }
    });
    confirmRow.appendChild(checkbox);  
    // 2B. label  
    const labelText = document.createTextNode(`Yes, load ${domain} now!`);
    confirmRow.appendChild(labelText);
    li.appendChild(confirmRow);
    // 3. footnote - where to add tasks from
    const fn = document.createElement("em");
    fn.textContent =  "(Use the extension popup to ADD tasks)";
    li.appendChild(fn);
    taskList.appendChild(li);
    //updateUI(0);
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
  statusText.textContent = '';
  
  if (percent === 100) {
    const strongElem = document.createElement('strong');
    let timeLeft = 3;
    strongElem.textContent = "";
    const countDownInterval = setInterval(() => {
        if (timeLeft > 0) {
            // Refresh the counter
            strongElem.textContent = `100% Done! Loading ${domain} in ${timeLeft} seconds..`;
            statusText.append("🎉 ", strongElem);
        } else {
            // Load the requested domain.
            clearInterval(countDownInterval);
            window.location.href = "https://" + domain;
        }
        timeLeft--;
    }, 1000);
  } else {
    statusText.textContent = `${percent}% Completed`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setDomain();
  renderTasks();
});

