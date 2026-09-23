// Task elements
const taskInput = document.getElementById("new-task");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("popup-tasks");
// Domain elements
const domainInput = document.getElementById("new-domain");
const addDomainBtn = document.getElementById("add-domain-btn");
const domainList = document.getElementById("popup-domains");

async function loadPopupTasks() {
  const data = await browser.storage.local.get(["tasks"]);
  const tasks = data.tasks || [];
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    // 1: Checkbox - done    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", async () => {
      tasks[index].completed = checkbox.checked;
      await browser.storage.local.set({ tasks });
      loadPopupTasks(); // Re-render to update percentages and check if unlocked
    });
    li.appendChild(checkbox);
    // 2. Task name/descr  
    li.appendChild(document.createTextNode(task.text));
    // 3. Button to delete the task  
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", async () => {
      tasks.splice(index, 1);
      await browser.storage.local.set({ tasks });
      loadPopupTasks();
    });
    li.appendChild(deleteBtn);
    // Now add the task item to the task list.  
    taskList.appendChild(li);
  });
}

addBtn.addEventListener("click", async () => {
  const text = taskInput.value.trim();
  if (!text) return;

  const data = await browser.storage.local.get(["tasks"]);
  const tasks = data.tasks || [];
  
  tasks.push({ text, completed: false });
  await browser.storage.local.set({ tasks });
  
  taskInput.value = "";
  loadPopupTasks();
});


// --- Domain Logic ---
async function loadDomains() {
  const data = await browser.storage.local.get(["domains"]);
  const domains = data.domains || [];
  domainList.innerHTML = "";

  domains.forEach((domain, index) => {
    const li = document.createElement("li");
    li.textContent = domain;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", async () => {
      domains.splice(index, 1);
      await browser.storage.local.set({ domains: domains });
      loadDomains();
    });

    li.appendChild(deleteBtn);
    domainList.appendChild(li);
  });
}

addDomainBtn.addEventListener("click", async () => {
  let domain = domainInput.value.trim().toLowerCase();
  if (!domain) return;

  // Simple cleanup to strip http://, https://, or www. if the user copies a full URL
  domain = domain.replace(/^(https?:\/\/)?(www\.)?/, "");

  const data = await browser.storage.local.get(["domains"]);
  const domains = data.domains || [];

  if (!domains.includes(domain)) {
    domains.push(domain);
    await browser.storage.local.set({ domains: domains });
  }

  domainInput.value = "";
  loadDomains();
});

document.addEventListener("DOMContentLoaded", () => {
  loadPopupTasks();
  loadDomains();
});

