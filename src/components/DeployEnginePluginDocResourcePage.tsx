import React, { useMemo } from 'react';

import Layout from '@theme/Layout';
import Sidebar from '@theme/DocSidebar';
import TableOfContents from '@theme/TOC';
import TOCCollapsible from '@theme/TOCCollapsible';
import { pluginDocResourcePageToC, toCurrentPluginSidebarItems } from '../utils/deploy-engine-plugin-docs';
import {
    DeployEnginePluginDocContent,
    DeployEnginePluginDocContentLinkWithPluginInfo,
    DeployEnginePluginDocContentResource,
    DeployEnginePluginDocContentResourceWithPluginInfo,
    ProviderPluginDocContent,
    ResourceKind
} from '../utils/types';
import DeployEnginePluginBreadcrumbs from './DeployEnginePluginBreadcrumbs';
import { DeployEnginePluginTextContentContext, textContent } from '../contexts/deploy-engine';
import DeployEnginePluginDocResourceSpec from './DeployEnginePluginDocResourceSpec';
import { extractDataTypeSchemas } from '../utils/resource-spec-schema';
import DeployEnginePluginDocResourceLinkTo from './DeployEnginePluginDocResourceLinkTo';
import MarkdownWithCodeBlocks from './MarkdownWithCodeBlocks';

type Props = {
    route: {
        path: string;
        customData: DeployEnginePluginResourceData;
    }
}

type DeployEnginePluginResourceData = {
    allPluginsContent: DeployEnginePluginDocContent[];
    pluginContent: ProviderPluginDocContent;
    resource: DeployEnginePluginDocContentResource;
    globalLinkMap: Record<string, DeployEnginePluginDocContentLinkWithPluginInfo>;
    globalResourceMap: Record<string, DeployEnginePluginDocContentResourceWithPluginInfo>;
    kind: ResourceKind;
}

const deployEngineTextContent = textContent();

export default function DeployEnginePluginDocResourcePage(props: Readonly<Props>) {
    const { pluginContent, resource, globalLinkMap, globalResourceMap, kind } = props.route.customData;

    const dataTypeSchemas = useMemo(() => extractDataTypeSchemas(resource.specification.schema), [resource.type])

    const tocItems = useMemo(
        () => pluginDocResourcePageToC(
            deployEngineTextContent, 
            resource,
            dataTypeSchemas,
            globalLinkMap,
            globalResourceMap,
            kind,
        ),
        [deployEngineTextContent, resource, dataTypeSchemas, globalLinkMap, globalResourceMap, kind],
    );

    const renderLinksToSection = () => {
        return (
            <>
                <h2 className="anchor" id="plugin-resource-links-to">
                    {deployEngineTextContent.resources.pluginResourceLinksToTitle}
                    <a 
                        className="hash-link"
                        aria-label={deployEngineTextContent.resources.pluginResourceLinksToTitleAriaLabel}
                        href="#plugin-resource-links-to"
                    ></a>
                </h2>
                <div>
                    <MarkdownWithCodeBlocks>
                        {deployEngineTextContent.resources.pluginResourceLinksToDescription}
                    </MarkdownWithCodeBlocks>
                </div>
                <ul className="plain-list">
                    {resource.canLinkTo?.map((linkTo, index) => (
                        <li key={`${resource.type}-link-to-${index}`} className="padding-top--md">
                            <DeployEnginePluginDocResourceLinkTo
                                linkTo={linkTo}
                                pluginContent={pluginContent}
                                currentResource={resource}
                                globalLinkMap={globalLinkMap}
                                globalResourceMap={globalResourceMap}
                                kind={kind}
                            />
                        </li>
                    ))}
                </ul>
            </>
        );
    }

    return (
        <DeployEnginePluginTextContentContext.Provider value={deployEngineTextContent}>
            <Layout title={deployEngineTextContent.resources.pageMetaTitle(pluginContent, resource)}>
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
                                    <DeployEnginePluginBreadcrumbs pluginContent={pluginContent} resource={resource} />
                                    <div className="de-plugin-doc-content">
                                        <h1>{resource.label}</h1>
                                        <div className="toc-collapsible-container">
                                            <TOCCollapsible
                                                toc={tocItems}
                                                minHeadingLevel={2}
                                                maxHeadingLevel={7}
                                            />
                                        </div>
                                        <div className="padding-top--sm padding-bottom--sm">
                                            <code>{resource.type}</code>
                                        </div>
                                        <div className="de-plugin-doc-content--description">
                                            <MarkdownWithCodeBlocks>{resource.description}</MarkdownWithCodeBlocks>
                                        </div>
                                        <div>
                                            <DeployEnginePluginDocResourceSpec
                                                resourceSpec={resource.specification}
                                                resourceLabel={resource.label}
                                                dataTypeSchemas={dataTypeSchemas}
                                                kind={kind}
                                            />
                                        </div>
                                        <div>
                                            {resource.examples?.length > 0 && (
                                                <h2 className="anchor" id="plugin-resource-examples">
                                                    {deployEngineTextContent.resources.pluginResourceExamplesTitle}
                                                    <a
                                                        className="hash-link"
                                                        aria-label={deployEngineTextContent.resources.pluginResourceExamplesTitleAriaLabel}
                                                        href="#plugin-resource-examples"
                                                    ></a>
                                                </h2>
                                            )}
                                            <ul className="plain-list">
                                                {resource.examples?.map((example, index) => (
                                                    <div key={`${resource.type}-example-${index}`} className="padding-top--md">
                                                        <MarkdownWithCodeBlocks>{example}</MarkdownWithCodeBlocks>
                                                    </div>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            {resource.canLinkTo?.length > 0 && renderLinksToSection()}
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
