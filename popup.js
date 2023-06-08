document.addEventListener('DOMContentLoaded', function () {

    // Check if extension is in dev mode and show scramble button if so
    chrome.management.getSelf(function(info) {
        if (info.installType === 'development') {
            document.getElementById('scrambleTabsBtn').style.display = 'block';
        }
    });
});

document.getElementById('groupTabsBtn').onclick = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'groupTabs'});
    });
}

document.getElementById('ungroupTabsBtn').onclick = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'ungroupTabs'});
    });
}

document.getElementById('sortTabsBtn').onclick = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'sortTabs'});
    });
}

document.getElementById('scrambleTabsBtn').onclick = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'scrambleTabs'});
    });
}