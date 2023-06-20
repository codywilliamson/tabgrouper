# Tab Grouper

Tab Grouper is a Microsoft Edge extension designed to enhance tab management by providing capabilities to group tabs by domain, ungroup tabs, sort non-grouped tabs alphabetically, and a special feature for developers to scramble tabs.

![Tab Grouper Logo](./assets/promo.png)

## Features

- **Group Tabs**: Groups all the open tabs by their domain.
- **Ungroup Tabs**: Ungroups all the grouped tabs.
- **Sort Tabs**: Sorts all non-grouped tabs alphabetically by their title.
- **Scramble Tabs** (Developer Mode): Randomizes the order of the tabs.
- **Collapse Groups**: Collapses all tab groups.
- **Expand Groups**: Expands all tab groups.
- **Close All Tabs**: Closes all tabs.
- **Group by Subdomain**: Groups tabs by subdomain.

These features can be accessed from the extension popup or context menu that appears on right-click within any webpage. Keyboard shortcuts are also available for these features for quicker access.

## Usage

After installing the extension, you can access its functionalities by either:

1. Clicking on the extension icon in the toolbar and using the popup UI.
2. Right-clicking on any webpage to bring up the context menu and selecting the desired option.
3. Using the keyboard shortcuts:
    - Group Tabs: Alt+Shift+M
    - Ungroup Tabs: Alt+Shift+J
    - Sort Tabs: Alt+Shift+H
    - Scramble Tabs (Developer Mode): Alt+Shift+U

## Installation

For installation, simply [click here](https://microsoftedge.microsoft.com/addons/detail/tab-grouper/cjamddajnhimgjogcgighnbaojgliccc) or head over to the Microsoft Edge extensions store, search for "Tab Grouper," and install it. Once installed, the extension will appear in your toolbar.

## Development

The extension is developed using standard web technologies: HTML, CSS, and JavaScript. It's structured into a manifest file, a background script (`tabGrouper.js`), an extension popup (`popup.html` and `popup.js`), and asset files.

If you wish to contribute, kindly fork the repository, make your changes, and submit a pull request.

## Feedback & Support

For any bugs or feature suggestions, please open an issue on GitHub. If you find this extension useful and wish to support the development, consider visiting the cashapp link found in the extension popup.

## License

MIT