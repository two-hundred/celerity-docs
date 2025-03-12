import React, { useMemo } from 'react';

import Layout from '@theme/Layout';
import Sidebar from '@theme/DocSidebar';
import TableOfContents from '@theme/TOC';
import TOCCollapsible from '@theme/TOCCollapsible';
import { pluginDocFunctionPageToC, toCurrentPluginSidebarItems } from '../utils/deploy-engine-plugin-docs';
import {
    DeployEnginePluginDocContent,
    DeployEnginePluginDocContentFunction,
    DeployEnginePluginDocContentLinkWithPluginInfo,
    ProviderPluginDocContent
} from '../utils/types';
import DeployEnginePluginBreadcrumbs from './DeployEnginePluginBreadcrumbs';
import { DeployEnginePluginTextContentContext, textContent } from '../contexts/deploy-engine';
import { extractFunctionTypeDefinitions } from '../utils/function-definitions';
import MarkdownWithCodeBlocks from './MarkdownWithCodeBlocks';
import DeployEnginePluginDocFunctionDefinition from './DeployEnginePluginDocFunctionDefinition';

type Props = {
    route: {
        path: string;
        customData: DeployEnginePluginFunctionData;
    }
}

type DeployEnginePluginFunctionData = {
    allPluginsContent: DeployEnginePluginDocContent[];
    pluginContent: ProviderPluginDocContent;
    func: DeployEnginePluginDocContentFunction;
    globalLinkMap: Record<string, DeployEnginePluginDocContentLinkWithPluginInfo>;
}

const deployEngineTextContent = textContent();

export default function DeployEnginePluginDocFunctionPage(props: Readonly<Props>) {
    const { pluginContent, func, globalLinkMap } = props.route.customData;

    const functionTypes = useMemo(() => extractFunctionTypeDefinitions(func), [func.name])

    const tocItems = useMemo(
        () => pluginDocFunctionPageToC(deployEngineTextContent, functionTypes),
        [deployEngineTextContent, func, functionTypes, globalLinkMap],
    );

    return (
        <DeployEnginePluginTextContentContext.Provider value={deployEngineTextContent}>
            <Layout title={deployEngineTextContent.functions.pageMetaTitle(pluginContent, func.name)}>
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
                                    <DeployEnginePluginBreadcrumbs pluginContent={pluginContent} func={func} />
                                    <div className="de-plugin-doc-content">
                                        <h1><code>{func.name}</code></h1>
                                        <div className="toc-collapsible-container">
                                            <TOCCollapsible
                                                toc={tocItems}
                                                minHeadingLevel={2}
                                                maxHeadingLevel={7}
                                            />
                                        </div>
                                        <div className="de-plugin-doc-content--description">
                                            <MarkdownWithCodeBlocks>{func.description}</MarkdownWithCodeBlocks>
                                        </div>
                                        <div>
                                            <DeployEnginePluginDocFunctionDefinition
                                                func={func}
                                                functionValueTypes={functionTypes}
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
