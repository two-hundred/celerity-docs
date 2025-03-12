import React, { useMemo } from 'react';

import Layout from '@theme/Layout';
import Sidebar from '@theme/DocSidebar';
import TableOfContents from '@theme/TOC';
import TOCCollapsible from '@theme/TOCCollapsible';
import { pluginDocCustomVarTypePageToC, toCurrentPluginSidebarItems } from '../utils/deploy-engine-plugin-docs';
import {
    DeployEnginePluginDocContent,
    DeployEnginePluginDocContentCustomVarType,
    DeployEnginePluginDocContentLinkWithPluginInfo,
    ProviderPluginDocContent
} from '../utils/types';
import DeployEnginePluginBreadcrumbs from './DeployEnginePluginBreadcrumbs';
import { DeployEnginePluginTextContentContext, textContent } from '../contexts/deploy-engine';
import DeployEnginePluginDocCustomVarTypeOptions from './DeployEnginePluginDocCustomVarTypeOptions';
import MarkdownWithCodeBlocks from './MarkdownWithCodeBlocks';

type Props = {
    route: {
        path: string;
        customData: DeployEnginePluginCustomVarTypeData;
    }
}

type DeployEnginePluginCustomVarTypeData = {
    allPluginsContent: DeployEnginePluginDocContent[];
    pluginContent: ProviderPluginDocContent;
    customVarType: DeployEnginePluginDocContentCustomVarType;
    globalLinkMap: Record<string, DeployEnginePluginDocContentLinkWithPluginInfo>;
}

const deployEngineTextContent = textContent();

export default function DeployEnginePluginDocCustomVarTypePage(props: Readonly<Props>) {
    const { pluginContent, customVarType, globalLinkMap } = props.route.customData;

    const tocItems = useMemo(
        () => pluginDocCustomVarTypePageToC(deployEngineTextContent, customVarType),
        [deployEngineTextContent, customVarType],
    );

    return (
        <DeployEnginePluginTextContentContext.Provider value={deployEngineTextContent}>
            <Layout title={deployEngineTextContent.customVarTypes.pageMetaTitle(pluginContent, customVarType)}>
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
                                    <DeployEnginePluginBreadcrumbs pluginContent={pluginContent} customVarType={customVarType} />
                                    <div className="de-plugin-doc-content">
                                        <h1>{customVarType.label}</h1>
                                        <div className="toc-collapsible-container">
                                            <TOCCollapsible
                                                toc={tocItems}
                                                minHeadingLevel={2}
                                                maxHeadingLevel={7}
                                            />
                                        </div>
                                        <div className="padding-top--sm padding-bottom--sm">
                                            <code>{customVarType.type}</code>
                                        </div>
                                        <div className="de-plugin-doc-content--description">
                                            <MarkdownWithCodeBlocks>{customVarType.description}</MarkdownWithCodeBlocks>
                                        </div>
                                        <div>
                                            <DeployEnginePluginDocCustomVarTypeOptions
                                                customVarType={customVarType}
                                            />
                                        </div>
                                        <div>
                                            {customVarType.examples?.length > 0 && (
                                                <h2 className="anchor" id="plugin-custom-var-type-examples">
                                                    {deployEngineTextContent.customVarTypes.pluginCustomVarTypeExamplesTitle}
                                                    <a
                                                        className="hash-link"
                                                        aria-label={deployEngineTextContent.customVarTypes.pluginCustomVarTypeExamplesTitleAriaLabel} 
                                                        href="#plugin-custom-var-type-examples"
                                                    ></a>
                                                </h2>
                                            )}
                                            <ul className="plain-list">
                                                {customVarType.examples?.map((example, index) => (
                                                    <div key={`${customVarType.type}-example-${index}`} className="padding-top--md">
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
