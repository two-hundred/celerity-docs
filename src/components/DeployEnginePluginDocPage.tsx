import React, { useMemo } from 'react';

import Layout from '@theme/Layout';
import Sidebar from '@theme/DocSidebar';
import TableOfContents from '@theme/TOC';
import TOCCollapsible from '@theme/TOCCollapsible';
import { pluginDocPageToC, toSidebarItems } from '../utils/deploy-engine-plugin-docs';
import { DeployEnginePluginDocContent, DeployEnginePluginDocContentLinkWithPluginInfo } from '../utils/types';
import DeployEnginePluginBreadcrumbs from './DeployEnginePluginBreadcrumbs';
import DeployEnginePluginDocConfig from './DeployEnginePluginDocConfig';
import { DeployEnginePluginTextContentContext, textContent } from '../contexts/deploy-engine';
import DeployEnginePluginDocResourcesOverview from './DeployEnginePluginDocResourcesOverview';
import DeployEnginePluginDocLinksOverview from './DeployEnginePluginDocLinksOverview';
import DeployEnginePluginDocDataSourcesOverview from './DeployEnginePluginDocDataSourcesOverview';
import DeployEnginePluginDocCustomVarTypesOverview from './DeployEnginePluginDocCustomVarTypesOverview';
import MarkdownWithCodeBlocks from './MarkdownWithCodeBlocks';
import DeployEnginePluginDocFunctionsOverview from './DeployEnginePluginDocFunctionsOverview';
import DeployEnginePluginDocAbstractResourcesOverview from './DeployEnginePluginDocAbstractResourcesOverview';

type Props = {
    route: {
        path: string;
        customData: DeployEnginePluginData;
    }
}

type DeployEnginePluginData = {
    allPluginsContent: DeployEnginePluginDocContent[];
    pluginContent: DeployEnginePluginDocContent;
    globalLinkMap: Record<string, DeployEnginePluginDocContentLinkWithPluginInfo>;
}

const deployEngineTextContent = textContent();

export default function DeployEnginePluginDocPage(props: Readonly<Props>) {
    const { pluginContent, globalLinkMap } = props.route.customData;

    const tocItems = useMemo(
        () => pluginDocPageToC(deployEngineTextContent, pluginContent, globalLinkMap),
        [deployEngineTextContent, pluginContent, globalLinkMap],
    );

    return (
        <DeployEnginePluginTextContentContext.Provider value={deployEngineTextContent}>
            <Layout title={deployEngineTextContent.pageMetaTitle(pluginContent)}>
                <div className="de-plugin-doc-root">
                    <aside className="de-plugin-doc-sidebar">
                        <Sidebar
                            path={props.route.path}
                            sidebar={toSidebarItems(props.route.customData.allPluginsContent)}
                            onCollapse={() => undefined}
                            isHidden={false}
                        />
                    </aside>
                    <main className="de-plugin-doc-main">
                        <div className="container padding-bottom--lg padding-top--md">
                            <div className="row">
                                <div className="col col--9">
                                    <DeployEnginePluginBreadcrumbs pluginContent={pluginContent} />
                                    <div className="de-plugin-doc-content">
                                        <h1>{pluginContent.displayName}</h1>
                                        <div className="toc-collapsible-container">
                                            <TOCCollapsible
                                                toc={tocItems}
                                                minHeadingLevel={2}
                                                maxHeadingLevel={7}
                                            />
                                        </div>
                                        <div className="padding-top--sm padding-bottom--sm">
                                            <b>{deployEngineTextContent.pluginVersionText}: </b>
                                            <div className="badge badge--secondary margin-left--xs">{pluginContent.version}</div>
                                        </div>
                                        {pluginContent.pluginType === 'transformer' && (
                                            <div className="padding-top--sm padding-bottom--md">
                                                <b>{deployEngineTextContent.pluginTransformNameText}: </b>
                                                <div className="badge badge--secondary margin-left--xs">{pluginContent.transformName}</div>
                                            </div>
                                        )}
                                        <div className="padding-top--sm padding-bottom--md">
                                            <a href={pluginContent.repository} target="_blank">{deployEngineTextContent.repositoryLabel}</a>
                                        </div>
                                        <div className="de-plugin-doc-content--description">
                                            <MarkdownWithCodeBlocks>{pluginContent.description}</MarkdownWithCodeBlocks>
                                        </div>
                                        <div>
                                            <DeployEnginePluginDocConfig
                                                configSchema={pluginContent.config} />
                                        </div>
                                        {pluginContent.pluginType === 'provider' && (
                                            <div>
                                                <DeployEnginePluginDocResourcesOverview
                                                    resources={pluginContent.resources}
                                                    plugin={pluginContent}
                                                />
                                                <DeployEnginePluginDocLinksOverview
                                                    links={pluginContent.links}
                                                    plugin={pluginContent}
                                                    globalLinkMap={globalLinkMap}
                                                />
                                                <DeployEnginePluginDocDataSourcesOverview
                                                    dataSources={pluginContent.dataSources}
                                                    plugin={pluginContent}
                                                />
                                                <DeployEnginePluginDocCustomVarTypesOverview
                                                    customVarTypes={pluginContent.customVarTypes}
                                                    plugin={pluginContent}
                                                />
                                                <DeployEnginePluginDocFunctionsOverview
                                                    functions={pluginContent.functions}
                                                    plugin={pluginContent}
                                                />
                                            </div>
                                        )}
                                        {pluginContent.pluginType === 'transformer' && (
                                            <div>
                                                <DeployEnginePluginDocAbstractResourcesOverview
                                                    abstractResources={pluginContent.abstractResources}
                                                    plugin={pluginContent}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col col--3">
                                    <TableOfContents toc={tocItems} minHeadingLevel={2} maxHeadingLevel={4} />
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </DeployEnginePluginTextContentContext.Provider>
    );
}
