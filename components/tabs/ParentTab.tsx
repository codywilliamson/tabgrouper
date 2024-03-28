
import { Tabs, Flowbite, type FlowbiteTabsTheme } from "flowbite-react";
import MainTab from "./MainTab";

function Component() {
    return (
        <Flowbite theme={{ mode: "dark" }}>
            <Tabs aria-label="Default tabs" style="default">
                <Tabs.Item active title="Core">
                    <MainTab />
                </Tabs.Item>
                <Tabs.Item title="Settings">
                    This is <span className="font-medium text-gray-800 dark:text-white">Settings tab's associated content</span>.
                    Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
                    control the content visibility and styling.
                </Tabs.Item>
            </Tabs>
        </Flowbite>
    );
}

export default Component;