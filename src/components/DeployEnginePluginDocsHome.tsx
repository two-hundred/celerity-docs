import React from 'react';

import Layout from '@theme/Layout';
import Sidebar from '@theme/DocSidebar';
import TableOfContents from '@theme/TOC';
import { DeployEnginePluginDocContent } from '../utils/types';
import { toSidebarItems } from '../utils/deploy-engine-plugin-docs';
import DeployEnginePluginBreadcrumbs from './DeployEnginePluginBreadcrumbs';
import { translate } from '@docusaurus/Translate';

type Props = {
    route: {
        path: string;
        customData: DeployEnginePluginData;
    }
}

type DeployEnginePluginData = {
    pluginsContent: DeployEnginePluginDocContent[];
}

export default function DeployEnginePluginDocsHome(props: Readonly<Props>) {
    return (
        <Layout title="Deploy Engine Plugin Documentation Home">
            <div className="de-plugin-doc-root">
                <aside className="de-plugin-doc-sidebar">
                    <Sidebar
                        path={props.route.path}
                        sidebar={toSidebarItems(props.route.customData.pluginsContent)}
                        onCollapse={() => undefined}
                        isHidden={false}
                    />
                </aside>
                <main className="de-plugin-doc-main">
                    <div className="container padding-bottom--lg padding-top--md">
                        <div className="row">
                            <div className="col">
                                <DeployEnginePluginBreadcrumbs />
                                <div className="de-plugin-doc-content">
                                    <h1>{translate({
                                        id: 'theme.deployEnginePluginDocs.title',
                                        message: 'Deploy Engine Plugins',
                                        description: 'The ARIA label for the deploy engine plugins home pages title',
                                    })}</h1>
                                    <p>Coming soon...</p>
                                </div>
                            </div>
                            <div className="col col--3">
                                <TableOfContents toc={[{
                                    value: "Something awesome",
                                    id: "something-awesome",
                                    level: 1,

                                }]} minHeadingLevel={1} maxHeadingLevel={3} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </Layout>
    );
}
