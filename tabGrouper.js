const ACTIONS = {
    GROUP_TABS: 'groupTabs',
    UNGROUP_TABS: 'ungroupTabs',
    SORT_NON_GROUPED_TABS: 'sortNonGroupedTabsAz',
    SCRAMBLE_TABS: 'scrambleTabs',
    COLLAPSE_GROUPS: 'collapseGroups',
    EXPAND_GROUPS: 'expandGroups'
};

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: ACTIONS.GROUP_TABS,
        title: 'Group tabs by domain',
        contexts: ['page']
    });
    chrome.contextMenus.create({
        id: ACTIONS.UNGROUP_TABS,
        title: 'Ungroup all tabs',
        contexts: ['page']
    });
    chrome.contextMenus.create({
        id: ACTIONS.SORT_NON_GROUPED_TABS,
        title: 'Sort non-grouped tab titles A-Z',
        contexts: ['page']
    });
    chrome.contextMenus.create({
        id: ACTIONS.COLLAPSE_GROUPS,
        title: 'Collapse all groups',
        contexts: ['page']
    });
    chrome.contextMenus.create({
        id: ACTIONS.EXPAND_GROUPS,
        title: 'Expand all groups',
        contexts: ['page']
    });
    chrome.management.getSelf(function (info) {
        if (info.installType === 'development') {
            chrome.contextMenus.create({
                id: 'scrambleTabs',
                title: 'Dev Mode: Scramble Tabs',
                contexts: ['page']
            });
        }
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case ACTIONS.GROUP_TABS:
            groupTabs();
            break;
        case ACTIONS.UNGROUP_TABS:
            ungroupTabs();
            break;
        case ACTIONS.SORT_NON_GROUPED_TABS:
            sortNonGroupedTabsAlphabetically();
            break;
        case ACTIONS.SCRAMBLE_TABS:
            scrambleTabs();
            break;
        case ACTIONS.COLLAPSE_GROUPS:
            collapseAllGroups();
            break;
        case ACTIONS.EXPAND_GROUPS:
            expandAllGroups();
            break;
        default:
            console.error(`Unrecognized action: ${info.menuItemId}`);
    }
});

chrome.commands.onCommand.addListener((command) => {
    switch (command) {
        case 'group_tabs':
            groupTabs();
            break;
        case 'ungroup_tabs':
            ungroupTabs();
            break;
        case 'sort_tabs':
            sortNonGroupedTabsAlphabetically();
            break;
        case 'scramble_tabs':
            chrome.management.getSelf(function (info) {
                if (info.installType === 'development') {
                    scrambleTabs();
                } else {

                }
            });
            break;
    }
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.action) {
            case 'groupTabs':
                groupTabs();
                break;
            case 'ungroupTabs':
                ungroupTabs();
                break;
            case 'sortTabs':
                sortNonGroupedTabsAlphabetically();
                break;
            case 'scrambleTabs':
                scrambleTabs();
                break;
            case 'collapseGroups':
                collapseAllGroups();
                break;
            case 'expandGroups':
                expandAllGroups();
                break;
            default:
                console.error("Undefined request.");
                break;
        }
    }
);

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
