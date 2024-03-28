import { createGroups, filterUngroupedTabs, sortByTitle, createSubdomainGroups } from '../core/tabUtils.js';

console.log(
  "Live now; make now always the most precious time. Now will never come again."
)

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage()
})

const contextMenuActions = {
  groupTabs: {
    title: "Group tabs by domain",
    func: groupTabs
  },
  ungroupTabs: {
    title: "Ungroup all tabs",
    func: ungroupTabs
  },
  sortNonGroupedTabsAz: {
    title: "Sort non-grouped tab titles A-Z",
    func: sortNonGroupedTabsAlphabetically
  },
  scrambleTabs: {
    title: "Scramble Tabs",
    func: scrambleTabs
  },
  collapseGroups: {
    title: "Collapse all groups",
    func: collapseAllGroups
  },
  expandGroups: {
    title: "Expand all groups",
    func: expandAllGroups
  },
  closeAllTabs: {
    title: "Close all tabs",
    func: closeAllTabs
  },
  groupBySubdomain: {
    title: "Group tabs by subdomain",
    func: groupBySubdomain
  }
};

chrome.runtime.onInstalled.addListener(() => {
  Object.entries(contextMenuActions).forEach(([id, { title }]) => {
    chrome.contextMenus.create({
      id,
      title,
      contexts: ["all"]
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const action = contextMenuActions[info.menuItemId];
  if (action) {
    action.func();
  } else {
    console.error(`Unrecognized action: ${info.menuItemId}`);
  }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const action = contextMenuActions[request.action];
  if (action) {
    await action.func();
    sendResponse({ status: "success" });
  } else {
    console.error(`Unrecognized action: ${request.action}`);
    sendResponse({ status: "error", message: `Unrecognized action: ${request.action}` });
  }
  return true;
});

// Function to group tabs by domain
async function groupTabs() {
  chrome.tabs.query({ currentWindow: true }, async (tabs) => {

    const groups = createGroups(tabs);

    for (let domain in groups) {
      if (groups[domain].length > 1) {
        let groupId = await chrome.tabs.group({ tabIds: groups[domain] });

        await chrome.tabGroups.update(
          groupId,
          {
            collapsed: true,
            title: domain
          })
      }
    }

    sortNonGroupedTabsAlphabetically();
  });
}

function ungroupTabs() {
  chrome.tabs.query({}, function (tabs) {
    console.log("[ungroupTabs] Ungrouping tabs");

    for (let tab of tabs) {
      if (tab.groupId !== undefined && tab.groupId !== -1) {
        chrome.tabs.ungroup(tab.id, function () {
          if (chrome.runtime.lastError) {
            console.error("[ungroupTabs] Error ungrouping tab:", chrome.runtime.lastError);
          }
        });
      }
    }
  });
}

// Function to sort ungrouped tabs alphabetically by their title
function sortNonGroupedTabsAlphabetically() {
  chrome.tabs.query({}, function (tabs) {
    // Get the highest index of all tab groups
    let highestIndex = -1;
    tabs.forEach(tab => {
      if (tab.groupId !== undefined && tab.groupId !== -1) {
        highestIndex = Math.max(highestIndex, tab.index);
      }
    });

    const ungroupedTabs = filterUngroupedTabs(tabs);
    ungroupedTabs.sort(sortByTitle);

    let i = 0;
    for (let tab of ungroupedTabs) {
      chrome.tabs.move(tab.id, { index: highestIndex + 1 + i }, function (tab) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
      i++;
    }
  });
}

// Function to scramble tabs
function scrambleTabs() {
  ungroupTabs();

  chrome.tabs.query({}, function (tabs) {
    for (let i = 0; i < tabs.length; i++) {
      // Generate a random index for each tab
      let randomIndex = Math.floor(Math.random() * tabs.length);

      chrome.tabs.move(tabs[i].id, { index: randomIndex }, function (tab) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
    }
  });
}

// Function to collapse all groups
function collapseAllGroups() {
  chrome.tabs.query({}, function (tabs) {
    // Retrieve all unique group ids from all tabs
    const groupIds = [...new Set(tabs.filter(tab => tab.groupId > -1).map(tab => tab.groupId))];

    // Iterate through each group and collapse it
    for (let groupId of groupIds) {
      chrome.tabGroups.update(groupId, { collapsed: true }, function () {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
    }
  });
}

// Function to expand all groups
function expandAllGroups() {
  chrome.tabs.query({}, function (tabs) {
    // Retrieve all unique group ids from all tabs
    const groupIds = [...new Set(tabs.filter(tab => tab.groupId > -1).map(tab => tab.groupId))];

    // Iterate through each group and expand it
    for (let groupId of groupIds) {
      chrome.tabGroups.update(groupId, { collapsed: false }, function () {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
    }
  });
}

function closeAllTabs() {
  const notificationOptions = {
    type: "basic",
    iconUrl: "assets/logo16.png",
    title: "Close all tabs",
    message: "Are you sure you want to close all tabs?",
    buttons: [{ title: "Confirm" }, { title: "Cancel" }],
    priority: 2,
  };

  // chrome.notifications.create("closeAllTabs", notificationOptions);
}

// Function to group tabs by subdomain
async function groupBySubdomain() {
  chrome.tabs.query({ currentWindow: true }, async (tabs) => {

    const groups = createSubdomainGroups(tabs);

    for (let subdomain in groups) {

      if (groups[subdomain].length > 1) {
        let groupId = await chrome.tabs.group({ tabIds: groups[subdomain] });
        await chrome.tabGroups.update(
          groupId,
          {
            collapsed: true,
            title: subdomain
          });
      };
    }

    sortNonGroupedTabsAlphabetically();
    collapseAllGroups();
  });
}