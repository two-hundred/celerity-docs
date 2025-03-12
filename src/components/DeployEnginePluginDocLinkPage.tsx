import React, { useMemo } from 'react';

import Layout from '@theme/Layout';
import Sidebar from '@theme/DocSidebar';
import TableOfContents from '@theme/TOC';
import TOCCollapsible from '@theme/TOCCollapsible';
import { pluginDocLinkPageToC, pluginResourceTypePath, toCurrentPluginSidebarItems } from '../utils/deploy-engine-plugin-docs';
import {
    DeployEnginePluginDocContent,
    DeployEnginePluginDocContentLinkWithPluginInfo,
    ProviderPluginDocContent
} from '../utils/types';
import DeployEnginePluginBreadcrumbs from './DeployEnginePluginBreadcrumbs';
import { DeployEnginePluginTextContentContext, textContent } from '../contexts/deploy-engine';
import DeployEnginePluginDocLinkAnnotations from './DeployEnginePluginDocLinkAnnotations';
import Link from '@docusaurus/Link';
import MarkdownWithCodeBlocks from './MarkdownWithCodeBlocks';

type Props = {
    route: {
        path: string;
        customData: DeployEnginePluginLinkData;
    }
}

type DeployEnginePluginLinkData = {
    allPluginsContent: DeployEnginePluginDocContent[];
    pluginContent: ProviderPluginDocContent;
    link: DeployEnginePluginDocContentLinkWithPluginInfo;
    globalLinkMap: Record<string, DeployEnginePluginDocContentLinkWithPluginInfo>;
}

const deployEngineTextContent = textContent();

export default function DeployEnginePluginDocLinkPage(props: Readonly<Props>) {
    const { pluginContent, link, globalLinkMap } = props.route.customData;

    const linkLabel = useMemo(() => {
        return deployEngineTextContent.resources.pluginResourceTypeLinkLabel(link.resourceTypeA, link.resourceTypeB);
    }, [link]);

    const tocItems = useMemo(() => pluginDocLinkPageToC(deployEngineTextContent, link), [link]);

    return (
        <DeployEnginePluginTextContentContext.Provider value={deployEngineTextContent}>
            <Layout title={deployEngineTextContent.links.pageMetaTitle(pluginContent, link)}>
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
                                    <DeployEnginePluginBreadcrumbs pluginContent={pluginContent} link={link} />
                                    <div className="de-plugin-doc-content">
                                        <h1>{linkLabel}</h1>
                                        <div className="toc-collapsible-container">
                                            <TOCCollapsible
                                                toc={tocItems}
                                                minHeadingLevel={2}
                                                maxHeadingLevel={7}
                                            />
                                        </div>
                                        <div className="padding-top--sm padding-bottom--sm align-vertical-container">
                                            <code>{link.type}</code>
                                            <Link to={pluginResourceTypePath(
                                                link.resourceTypeA.plugin,
                                                link.resourceTypeA.type,
                                            )}>{link.resourceTypeA.label}</Link>
                                            <Link to={pluginResourceTypePath(
                                                link.resourceTypeB.plugin,
                                                link.resourceTypeB.type,
                                            )}>{link.resourceTypeB.label}</Link>
                                        </div>
                                        <div className="de-plugin-doc-content--description">
                                            <MarkdownWithCodeBlocks>{link.description}</MarkdownWithCodeBlocks>
                                        </div>
                                        <div>
                                            <DeployEnginePluginDocLinkAnnotations
                                                link={link}
                                            />
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
