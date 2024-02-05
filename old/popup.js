const ACTIONS = [
    {
        key: "groupTabs",
        title: "Group",
        icon: "fas fa-layer-group"
    },
    {
        key: "ungroupTabs",
        title: "Ungroup",
        icon: "fas fa-object-ungroup"
    },
    {
        key: "sortNonGroupedTabsAz",
        title: "Sort A-Z",
        icon: "fas fa-sort-alpha-down"
    },
    {
        key: "scrambleTabs",
        title: "Scramble",
        icon: "fas fa-random"
    },
    {
        key: "collapseGroups",
        title: "Collapse",
        icon: "fas fa-angle-up"
    },
    {
        key: "expandGroups",
        title: "Expand",
        icon: "fas fa-angle-down"
    },
    {
        key: "closeAllTabs",
        title: "Close All",
        icon: "fas fa-window-close"
    },
    {
        key: "groupBySubdomain",
        title: "Group Subdomains",
        icon: "fas fa-sitemap"
    },
];

const buttonContainer = document.getElementById('buttonContainer'); 

ACTIONS.forEach((action) => {
    const btn = document.createElement('button');
    btn.id = `${action.key}Btn`;
    
    btn.innerHTML = `<i class="${action.icon}"></i> ${action.title}`;

    btn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: action.key });
    });

    buttonContainer.appendChild(btn);
});
