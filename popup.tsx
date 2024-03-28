import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLayerGroup, faObjectUngroup, faSortAlphaDown,
    faRandom, faAngleUp, faAngleDown, faWindowClose, faSitemap
} from '@fortawesome/free-solid-svg-icons';
import "style.css";

const ACTIONS = [
    {
        key: "groupTabs",
        title: "Group",
        icon: faLayerGroup
    },
    {
        key: "ungroupTabs",
        title: "Ungroup",
        icon: faObjectUngroup
    },
    {
        key: "sortNonGroupedTabsAz",
        title: "Sort A-Z",
        icon: faSortAlphaDown
    },
    {
        key: "scrambleTabs",
        title: "Scramble",
        icon: faRandom
    },
    {
        key: "collapseGroups",
        title: "Collapse",
        icon: faAngleUp
    },
    {
        key: "expandGroups",
        title: "Expand",
        icon: faAngleDown
    },
    {
        key: "closeAllTabs",
        title: "Close All",
        icon: faWindowClose
    },
    {
        key: "groupBySubdomain",
        title: "Subdomains",
        icon: faSitemap
    },
];

const Popup = () => {
    const sendMessage = (key) => {
        chrome.runtime.sendMessage({ action: key });
    };

    return (
        <div className="w-[430px] font-sans p-10 text-white bg-gray-800">
            <h1 className="text-xl">Tab Grouper</h1>
            <p className="mb-4">Manage your tabs efficiently.</p>
            <div className="grid grid-cols-2 gap-2">
                {ACTIONS.map((action) => (
                    <button
                        key={action.key}
                        id={`${action.key}Btn`}
                        onClick={() => sendMessage(action.key)}
                        className="text-white shadow-sm bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-800 font-medium rounded-lg text-sm py-3 text-center me-2 mb-2"
                    >
                        <FontAwesomeIcon icon={action.icon} className="mr-2" /> {/* Icon */}
                        {action.title}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Popup;
