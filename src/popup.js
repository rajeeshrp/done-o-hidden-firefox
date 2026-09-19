// Task elements
const taskInput = document.getElementById("new-task");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("popup-tasks");
console.log("task Entered:");
// Domain elements
const domainInput = document.getElementById("new-domain");
const addDomainBtn = document.getElementById("add-domain-btn");
const domainList = document.getElementById("popup-domains");
console.log("domain Entered:");
console.log(domainInput.value);

async function loadPopupTasks() {
  console.log("In loadTasks()..");
  const data = await browser.storage.local.get(["tasks"]);
  const tasks = data.tasks || [];
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task.text + (task.completed ? " (Done)" : "");
    
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", async () => {
      tasks.splice(index, 1);
      await browser.storage.local.set({ tasks });
      loadPopupTasks();
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
  console.log("Exiting loadTasks()..");
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
  console.log("In loadDomains()..");  
  const data = await browser.storage.local.get(["domains"]);
  const domains = data.domains || [];
  domainList.innerHTML = "";

  domains.forEach((domain, index) => {
    const li = document.createElement("li");
    li.textContent = domain;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✕";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", async () => {
      domains.splice(index, 1);
      await browser.storage.local.set({ domains: domains });
      loadDomains();
    });

    li.appendChild(deleteBtn);
    domainList.appendChild(li);
  });
  console.log("Exiting loadDomains()..");  
}

addDomainBtn.addEventListener("click", async () => {
  console.log("add-domain-btn clicked!");  
  let domain = domainInput.value.trim().toLowerCase();
  console.log("domain just extracted");  
  if (!domain) return;
  console.log("valid domain found!");  

  // Simple cleanup to strip http://, https://, or www. if the user copies a full URL
  domain = domain.replace(/^(https?:\/\/)?(www\.)?/, "");
  console.log("Clean Domain:");
  console.log(domain);  

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

