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

document.addEventListener('DOMContentLoaded', function () {
    chrome.management.getSelf(function(info) {
        if (info.installType === 'development') {
            document.getElementById('DevMode').style.display = 'block';
        }
    });
});
