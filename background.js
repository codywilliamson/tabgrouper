chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'groupTabs',
        title: 'Group tabs by domain',
        contexts: ['page']
    });
    chrome.contextMenus.create({
        id: 'ungroupTabs',
        title: 'Ungroup all tabs',
        contexts: ['page']
    });
    chrome.contextMenus.create({
        id: 'sortNonGroupedTabsAz',
        title: 'Sort non-grouped tab titles A-Z',
        contexts: ['page']
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'groupTabs') {
        groupTabs();
    } else if (info.menuItemId === 'ungroupTabs') {
        ungroupTabs();
    } else if (info.menuItemId === 'sortNonGroupedTabsAz') {
        sortTabsAlphabetically();
    }
});

chrome.commands.onCommand.addListener((command) => {
    if (command === '_execute_browser_action') {
        groupTabs();
    }
});

function groupTabs() {
    chrome.tabs.query({}, function (tabs) {
        const groups = {};

        for (let tab of tabs) {
            const url = new URL(tab.url);
            const domain = url.hostname;

            if (!groups[domain]) {
                groups[domain] = [];
            }

            groups[domain].push(tab.id);
        }

        for (let domain in groups) {
            if (groups[domain].length > 2) {
                chrome.tabs.group({
                    createProperties: {},
                    tabIds: groups[domain]
                });
            }
        }
    });
}

function sortTabsAlphabetically() {
    console.log('fired');
    chrome.tabs.query({}, function (tabs) {
        // filter out tabs that are in a group
        let ungroupedTabs = tabs.filter(tab => tab.groupId === undefined || tab.groupId === -1);
        console.log(ungroupedTabs);
        // sort ungrouped tabs alphabetically by their title
        ungroupedTabs.sort((a, b) => a.title.localeCompare(b.title));

        // for each sorted tab
        for (let i = 0; i < ungroupedTabs.length; i++) {
            // update the tab's index to its position in the sorted array
            chrome.tabs.move(ungroupedTabs[i].id, {index: i});
            console.log(`Moving ${ungroupedTabs[i].id} to index: ${i}`);
        }
    });
}

function ungroupTabs() {
    chrome.tabs.query({}, function (tabs) {
        for (let tab of tabs) {
            if (tab.groupId !== chrome.tabs.TAB_GROUP_ID_NONE) {
                chrome.tabs.ungroup(tab.id);
            }
        }
    });
}