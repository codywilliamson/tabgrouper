import React from 'react';
import ParentTab from 'components/tabs/ParentTab';

const Popup = () => {
    return (
        <div className="w-[430px] font-sans p-10 text-white bg-gray-900">
            <h1 className="text-xl">Tab Grouper</h1>
            <p className="mb-4">Manage your tabs efficiently.</p>
            <ParentTab />
        </div>
    );
};

export default Popup;
