import React from 'react';

const DashboardLayout = ({ main, sidebar }) => {
    return (
        <div className="dashboard-grid-layout">
            <main className="dashboard-main-area">
                {main}
            </main>
            {sidebar && (
                <aside className="dashboard-sidebar-area">
                    {sidebar}
                </aside>
            )}
            <style>{`
                .dashboard-grid-layout {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) 380px;
                    gap: 24px;
                    align-items: start;
                    width: 100%;
                    padding-bottom: 48px;
                }
                .dashboard-main-area {
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }
                .dashboard-sidebar-area {
                    position: sticky;
                    top: calc(72px + 24px);
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    max-height: calc(100vh - 110px);
                    overflow-y: auto;
                    scrollbar-width: thin;
                }
                @media (max-width: 960px) {
                    .dashboard-grid-layout {
                        grid-template-columns: minmax(0, 1fr);
                    }
                    .dashboard-sidebar-area {
                        position: static;
                        max-height: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default DashboardLayout;
