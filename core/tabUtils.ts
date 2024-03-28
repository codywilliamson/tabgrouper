const psl = require('psl');

export function createGroups(tabs) {
    const groups = {};

    for (let tab of tabs) {
        if (tab.url) {
            const url = new URL(tab.url);
            let domain = psl.parse(url.hostname).domain;

            if (!groups[domain]) {
                groups[domain] = [];
            }

            groups[domain].push(tab.id);
        }
    }

    return groups;
}

export function getTopLevelDomain(hostname) {
    let parts = hostname.split('.').reverse();

    if (parts != null && parts.length > 1) {
        let tld = parts[0];
        let secondLevelDomain = parts[1];
        let domain = `${secondLevelDomain}.${tld}`;

        if (parts.length > 2) {
            domain = `${parts[2]}.${domain}`;
        }

        return domain;
    }

    return hostname;
}

// Function to filter out tabs that are in a group
export function filterUngroupedTabs(tabs) {
    return tabs.filter(tab => tab.groupId === undefined || tab.groupId === -1);
}

// Function to sort tabs by their title
export function sortByTitle(a, b) {
    return a.title.localeCompare(b.title);
}

export function createSubdomainGroups(tabs) {
    const groups = {};

    for (let tab of tabs) {
        const url = new URL(tab.url);
        const parsed = psl.parse(url.hostname);

        let groupKey;
        if (parsed.subdomain) {
            // If there's a subdomain, include the full domain
            groupKey = `${parsed.subdomain}.${parsed.domain}`;
        } else {
            // If no subdomain, use just the domain
            groupKey = parsed.domain;
        }

        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }

        groups[groupKey].push(tab.id);
    }

    return groups;
}
