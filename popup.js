document.getElementById('groupTabsBtn').addEventListener('click', function() {
    chrome.runtime.sendMessage({action: 'groupTabs'});
});

document.getElementById('ungroupTabsBtn').addEventListener('click', function() {
    chrome.runtime.sendMessage({action: 'ungroupTabs'});
});

document.getElementById('sortTabsBtn').addEventListener('click', function() {
    chrome.runtime.sendMessage({action: 'sortTabs'});
});

document.getElementById('scrambleTabsBtn').addEventListener('click', function() {
    chrome.runtime.sendMessage({action: 'scrambleTabs'});
});

document.getElementById('collapseGroupsBtn').addEventListener('click', function() {
    chrome.runtime.sendMessage({action: 'collapseGroups'});
});

document.getElementById('expandGroupsBtn').addEventListener('click', function() {
    chrome.runtime.sendMessage({action: 'expandGroups'});
});

document.addEventListener('DOMContentLoaded', function () {
    chrome.management.getSelf(function(info) {
        if (info.installType === 'development') {
            document.getElementById('DevMode').style.display = 'block';
        }
    });
});
