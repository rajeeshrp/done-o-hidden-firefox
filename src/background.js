// Function to update the blocking rule based on task completion
async function updateBlockingRules() {
  const data = await browser.storage.local.get(["tasks", "domains", "unlocked"]);
  const tasks = data.tasks || [];
  const domains = data.domains || [];
  const unlocked = data.unlocked || false;
  
  // Check if there are tasks and if every single one is checked
  const allFinished = tasks.length > 0 && tasks.every(task => task.completed);
  const existingRules = await browser.declarativeNetRequest.getDynamicRules();
  const existingIds = existingRules.map(rule => rule.id);  

  if (unlocked || allFinished || domains.length == 0) {
    // If 100% finished, remove the block rule so you can visit Instagram
    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingIds
    });
  } else {
    // If not finished, add a rule to redirect Instagram to our custom page
    const redirectUrl = browser.runtime.getURL("todo.html");
    const newRules = domains.map((domain, index) => {
        const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, "");
        return {
            id: index + 1,
            priority: 1,
            action: {
                type: "redirect",
                redirect: { extensionPath: `/todo.html?domain=${encodeURIComponent(domain)}` }
            },
            condition: {
                urlFilter: `*://*.${cleanDomain}/*`,
                resourceTypes: ["main_frame"]
            },
        };
    });  
    
    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingIds,
      addRules: newRules
    });
  }
}

// Watch for changes in the tasks storage to update rules instantly
browser.storage.onChanged.addListener((changes) => {
  if (changes.tasks || changes.domains || changes.unlocked) {
    updateBlockingRules();
  }
});

// Initialize rules when the extension starts
browser.runtime.onInstalled.addListener(updateBlockingRules);
browser.runtime.onStartup.addListener(updateBlockingRules);

