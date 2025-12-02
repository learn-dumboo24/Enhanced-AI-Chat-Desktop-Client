import React from 'react';
import { Plus, MessageSquare, User, Settings, LogOut, PanelLeftClose } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    if (!isOpen) return null;

    return (
        <div className="w-[260px] bg-sidebar flex flex-col h-full border-r border-white/10 flex-shrink-0 transition-all duration-300">
            {/* Header */}
            <div className="p-2.5 flex gap-2.5 items-center">
                <button className="flex-1 flex items-center gap-2.5 px-2.5 py-2.5 bg-transparent border border-border rounded-md text-[#ececec] cursor-pointer transition-colors hover:bg-hover text-sm">
                    <Plus size={16} />
                    <span>New chat</span>
                </button>
                <button
                    onClick={toggleSidebar}
                    className="bg-transparent border-none text-[#b4b4b4] cursor-pointer p-1.5 rounded-md hover:bg-hover hover:text-[#ececec]"
                >
                    <PanelLeftClose size={20} />
                </button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-2.5 custom-scrollbar">
                <div className="mb-5">
                    <div className="text-xs text-[#b4b4b4] px-2.5 py-2 font-medium">Today</div>
                    <button className="w-full flex items-center gap-2.5 px-2.5 py-2.5 bg-transparent border-none text-[#ececec] cursor-pointer rounded-md text-sm hover:bg-hover whitespace-nowrap overflow-hidden text-ellipsis text-left">
                        <MessageSquare size={16} className="flex-shrink-0" />
                        <span className="overflow-hidden text-ellipsis">React UI Components</span>
                    </button>
                    <button className="w-full flex items-center gap-2.5 px-2.5 py-2.5 bg-transparent border-none text-[#ececec] cursor-pointer rounded-md text-sm hover:bg-hover whitespace-nowrap overflow-hidden text-ellipsis text-left">
                        <MessageSquare size={16} className="flex-shrink-0" />
                        <span className="overflow-hidden text-ellipsis">TypeScript Best Practices</span>
                    </button>
                </div>

                <div className="mb-5">
                    <div className="text-xs text-[#b4b4b4] px-2.5 py-2 font-medium">Yesterday</div>
                    <button className="w-full flex items-center gap-2.5 px-2.5 py-2.5 bg-transparent border-none text-[#ececec] cursor-pointer rounded-md text-sm hover:bg-hover whitespace-nowrap overflow-hidden text-ellipsis text-left">
                        <MessageSquare size={16} className="flex-shrink-0" />
                        <span className="overflow-hidden text-ellipsis">Debugging useEffect</span>
                    </button>
                    <button className="w-full flex items-center gap-2.5 px-2.5 py-2.5 bg-transparent border-none text-[#ececec] cursor-pointer rounded-md text-sm hover:bg-hover whitespace-nowrap overflow-hidden text-ellipsis text-left">
                        <MessageSquare size={16} className="flex-shrink-0" />
                        <span className="overflow-hidden text-ellipsis">CSS Grid Layouts</span>
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="p-2.5 border-t border-border">
                <button className="w-full flex items-center gap-2.5 px-2.5 py-2.5 bg-transparent border-none text-[#ececec] cursor-pointer rounded-md text-sm hover:bg-hover">
                    <User size={16} />
                    <span>Upgrade to Plus</span>
                </button>
                <button className="w-full flex items-center gap-2.5 px-2.5 py-2.5 bg-transparent border-none text-[#ececec] cursor-pointer rounded-md text-sm hover:bg-hover">
                    <Settings size={16} />
                    <span>Settings</span>
                </button>
                <div className="flex items-center gap-2.5 px-2.5 py-2.5 mt-1.5 rounded-md cursor-pointer hover:bg-hover">
                    <div className="w-8 h-8 bg-[#7c3aed] text-white rounded flex items-center justify-center font-bold">
                        U
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="text-sm font-medium text-[#ececec]">User</div>
                        <div className="text-xs text-[#b4b4b4]">user@example.com</div>
                    </div>
                    <LogOut size={16} className="text-[#b4b4b4]" />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
