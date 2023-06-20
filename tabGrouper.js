const ACTIONS = {
    GROUP_TABS: {
        id: 'groupTabs',
        title: 'Group tabs by domain',
        func: groupTabs
    },
    UNGROUP_TABS: {
        id: 'ungroupTabs',
        title: 'Ungroup all tabs',
        func: ungroupTabs
    },
    SORT_NON_GROUPED_TABS: {
        id: 'sortNonGroupedTabsAz',
        title: 'Sort non-grouped tab titles A-Z',
        func: sortNonGroupedTabsAlphabetically
    },
    SCRAMBLE_TABS: {
        id: 'scrambleTabs',
        title: 'Scramble Tabs',
        func: scrambleTabs
    },
    COLLAPSE_GROUPS: {
        id: 'collapseGroups',
        title: 'Collapse all groups',
        func: collapseAllGroups
    },
    EXPAND_GROUPS: {
        id: 'expandGroups',
        title: 'Expand all groups',
        func: expandAllGroups
    },
    CLOSE_ALL_TABS: {
        id: 'closeAllTabs',
        title: 'Close all tabs',
        func: closeAllTabs
    },
    GROUP_BY_SUBDOMAIN: {
        id: 'groupBySubdomain',
        title: 'Group tabs by subdomain',
        func: groupBySubdomain
    }
};


chrome.runtime.onInstalled.addListener(() => {
    Object.values(ACTIONS).forEach(action => {
        chrome.contextMenus.create({
            id: action.id,
            title: action.title,
            contexts: ['page']
        });
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    const action = Object.values(ACTIONS).find(action => action.id === info.menuItemId);
    if (action) {
        action.func();
    } else {
        console.error(`Unrecognized action: ${info.menuItemId}`);
    }
});

chrome.commands.onCommand.addListener((command) => {
    const action = Object.values(ACTIONS).find(action => action.id === command);
    if (action) {
        action.func();
    } else {
        console.error(`Unrecognized command: ${command}`);
    }
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        const action = Object.values(ACTIONS).find(action => action.id === request.action);
        if (action) {
            action.func();
        } else {
            console.error(`Undefined request: ${request.action}`);
        }
    }
);

chrome.notifications.onButtonClicked.addListener(function (notifId, btnIdx) {
    if (notifId === "closeAllTabs") {
        if (btnIdx === 0) { // The 'Confirm' button was clicked
            chrome.tabs.query({}, function (tabs) {
                const tabIds = tabs.map(tab => tab.id);
                chrome.tabs.remove(tabIds, function () {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError);
                    }
                });
            });
        }
    }
});

// Function to group tabs by domain
function groupTabs() {
    chrome.tabs.query({}, function (tabs) {
        const groups = createGroups(tabs);

        for (let domain in groups) {
            if (groups[domain].length > 1) {
                chrome.tabs.group({
                    createProperties: {},
                    tabIds: groups[domain]
                }, (groupId) => {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError);
                    }
                    chrome.tabGroups.update(groupId, { title: domain }, function (updatedGroup) {
                        if (chrome.runtime.lastError) {
                            console.error(chrome.runtime.lastError);
                        }
                    });
                });
            }
        }

        sortNonGroupedTabsAlphabetically();
    });
}

// Function to create groups of tabs by domain
function createGroups(tabs) {
    const groups = {};

    for (let tab of tabs) {
        const url = new URL(tab.url);
        let domain = getTopLevelDomain(url.hostname);

        if (!groups[domain]) {
            groups[domain] = [];
        }

        groups[domain].push(tab.id);
    }

    return groups;
}

// Helper function to get top level domain from a hostname
function getTopLevelDomain(hostname) {
    let parts = hostname.split('.').reverse();

    if (parts != null && parts.length > 1) {
        let tld = parts[0];
        let secondLevelDomain = parts[1];

        // Check if second level domain is a common one
        if (secondLevelDomain === 'co' ||
            secondLevelDomain === 'com' ||
            secondLevelDomain === 'gov' ||
            secondLevelDomain === 'edu' ||
            secondLevelDomain === 'ac') {
            // Use the third level domain, if available
            let thirdLevelDomain = parts[2];
            if (thirdLevelDomain) {
                return `${thirdLevelDomain}.${secondLevelDomain}.${tld}`;
            }
        }

        return `${secondLevelDomain}.${tld}`;
    }

    return hostname;
}

// Function to ungroup all tabs
function ungroupTabs() {
    chrome.tabs.query({}, function (tabs) {
        for (let tab of tabs) {
            if (tab.groupId !== undefined && tab.groupId !== -1) {
                chrome.tabs.ungroup(tab.id, function () {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError);
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


// Function to filter out tabs that are in a group
function filterUngroupedTabs(tabs) {
    return tabs.filter(tab => tab.groupId === undefined || tab.groupId === -1);
}

// Function to sort tabs by their title
function sortByTitle(a, b) {
    return a.title.localeCompare(b.title);
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

    chrome.notifications.create("closeAllTabs", notificationOptions);
}

// Function to group tabs by subdomain
function groupBySubdomain() {
    chrome.tabs.query({}, function (tabs) {
        const groups = createSubdomainGroups(tabs);

        for (let subdomain in groups) {
            if (groups[subdomain].length > 1) {
                chrome.tabs.group({
                    createProperties: {},
                    tabIds: groups[subdomain]
                }, (groupId) => {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError);
                    }
                    chrome.tabGroups.update(groupId, { title: subdomain }, function (updatedGroup) {
                        if (chrome.runtime.lastError) {
                            console.error(chrome.runtime.lastError);
                        }
                    });
                });
            }
        }

        sortNonGroupedTabsAlphabetically();
    });
}

// Function to create groups of tabs by subdomain
function createSubdomainGroups(tabs) {
    const groups = {};

    for (let tab of tabs) {
        const url = new URL(tab.url);
        let subdomain = url.hostname;

        if (!groups[subdomain]) {
            groups[subdomain] = [];
        }

        groups[subdomain].push(tab.id);
    }

    return groups;
}