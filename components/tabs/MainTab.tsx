import React from "react"
import {
    faAngleDown,
    faAngleUp,
    faLayerGroup,
    faObjectUngroup,
    faRandom,
    faSitemap,
    faSortAlphaDown,
    faWindowClose
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import "style.css"

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
    }
]

const MainTab = () => {
    const sendMessage = (key) => {
        chrome.runtime.sendMessage({ action: key })
    }

    return (
        <div className="grid grid-cols-2 gap-2">
            {ACTIONS.map((action) => (
                <button
                    key={action.key}
                    id={`${action.key}Btn`}
                    onClick={() => sendMessage(action.key)}
                    className="text-white shadow-sm bg-gradient-to-br from-green-300 to-green-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-800 font-medium rounded-lg text-sm py-3 text-center me-2 mb-2">
                    <FontAwesomeIcon icon={action.icon} className="mr-2" /> {/* Icon */}
                    {action.title}
                </button>
            ))}
        </div>
    )
}

export default MainTab
