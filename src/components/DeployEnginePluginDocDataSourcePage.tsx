import React, { useMemo } from 'react';

import Layout from '@theme/Layout';
import Sidebar from '@theme/DocSidebar';
import TableOfContents from '@theme/TOC';
import TOCCollapsible from '@theme/TOCCollapsible';
import { pluginDocDataSourcePageToC, toCurrentPluginSidebarItems } from '../utils/deploy-engine-plugin-docs';
import {
    DeployEnginePluginDocContent,
    DeployEnginePluginDocContentDataSource,
    DeployEnginePluginDocContentLinkWithPluginInfo,
    ProviderPluginDocContent
} from '../utils/types';
import DeployEnginePluginBreadcrumbs from './DeployEnginePluginBreadcrumbs';
import { DeployEnginePluginTextContentContext, textContent } from '../contexts/deploy-engine';
import DeployEnginePluginDocDataSourceSpec from './DeployEnginePluginDocDataSourceSpec';
import MarkdownWithCodeBlocks from './MarkdownWithCodeBlocks';

type Props = {
    route: {
        path: string;
        customData: DeployEnginePluginDataSourceData;
    }
}

type DeployEnginePluginDataSourceData = {
    allPluginsContent: DeployEnginePluginDocContent[];
    pluginContent: ProviderPluginDocContent;
    dataSource: DeployEnginePluginDocContentDataSource;
    globalLinkMap: Record<string, DeployEnginePluginDocContentLinkWithPluginInfo>;
}

const deployEngineTextContent = textContent();

export default function DeployEnginePluginDocDataSourcePage(props: Readonly<Props>) {
    const { pluginContent, dataSource, globalLinkMap } = props.route.customData;

    const tocItems = useMemo(
        () => pluginDocDataSourcePageToC(deployEngineTextContent, dataSource),
        [deployEngineTextContent, dataSource],
    );

    return (
        <DeployEnginePluginTextContentContext.Provider value={deployEngineTextContent}>
            <Layout title={deployEngineTextContent.dataSources.pageMetaTitle(pluginContent, dataSource)}>
                <div className="de-plugin-doc-root">
                    <aside className="de-plugin-doc-sidebar">
                        <Sidebar
                            path={props.route.path}
                            sidebar={toCurrentPluginSidebarItems(
                                deployEngineTextContent,
                                pluginContent,
                                globalLinkMap,
                            )}
                            onCollapse={() => undefined}
                            isHidden={false}
                        />
                    </aside>
                    <main className="de-plugin-doc-main">
                        <div className="container padding-bottom--lg padding-top--md">
                            <div className="row">
                                <div className="col col--9">
                                    <DeployEnginePluginBreadcrumbs pluginContent={pluginContent} dataSource={dataSource} />
                                    <div className="de-plugin-doc-content">
                                        <h1>{dataSource.label}</h1>
                                        <div className="toc-collapsible-container">
                                            <TOCCollapsible
                                                toc={tocItems}
                                                minHeadingLevel={2}
                                                maxHeadingLevel={7}
                                            />
                                        </div>
                                        <div className="padding-top--sm padding-bottom--sm">
                                            <code>{dataSource.type}</code>
                                        </div>
                                        <div className="de-plugin-doc-content--description">
                                            <MarkdownWithCodeBlocks>{dataSource.description}</MarkdownWithCodeBlocks>
                                        </div>
                                        <div>
                                            <DeployEnginePluginDocDataSourceSpec
                                                dataSource={dataSource}
                                            />
                                        </div>
                                        <div>
                                            {dataSource.examples?.length > 0 && (
                                                <h2 className="anchor" id="plugin-datasource-examples">
                                                    {deployEngineTextContent.dataSources.pluginDataSourceExamplesTitle}
                                                    <a 
                                                        className="hash-link"
                                                        aria-label={deployEngineTextContent.dataSources.pluginDataSourceExamplesTitleAriaLabel}
                                                        href="#plugin-datasource-examples"
                                                    ></a>
                                                </h2>
                                            )}
                                            <ul className="plain-list">
                                                {dataSource.examples?.map((example, index) => (
                                                    <div key={`${dataSource.type}-example-${index}`} className="padding-top--md">
                                                        <MarkdownWithCodeBlocks>{example}</MarkdownWithCodeBlocks>
                                                    </div>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col col--3">
                                    <TableOfContents
                                        toc={tocItems}
                                        minHeadingLevel={2}
                                        maxHeadingLevel={7}
                                    />
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </DeployEnginePluginTextContentContext.Provider>
    );
}
