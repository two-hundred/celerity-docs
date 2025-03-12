import React, { useMemo } from "react"
import { DeployEnginePluginDocContent, DeployEnginePluginDocContentResource } from "../utils/types"
import useDeployEnginePluginTextContent from "../hooks/use-deploy-engine-plugin-text-content";
import { DeployEnginePluginTextContent } from "../contexts/deploy-engine";
import { pluginAbstractResourceTypeElementId, pluginAbstractResourceTypePath } from "../utils/deploy-engine-plugin-docs";
import Link from "@docusaurus/Link";
import MarkdownWithCodeBlocks from "./MarkdownWithCodeBlocks";

type ResourceSummaryProps = {
    textContent: DeployEnginePluginTextContent;
    abstractResource: DeployEnginePluginDocContentResource;
    plugin: DeployEnginePluginDocContent;
}

function DeployEnginePluginDocAbstractResourceSummary(props: Readonly<ResourceSummaryProps>) {
    const { textContent, abstractResource, plugin } = props;

    const elementId = useMemo(() => pluginAbstractResourceTypeElementId(abstractResource.type), [abstractResource.type]);

    return <>
        <h3 className="anchor" id={elementId}>
            <Link to={pluginAbstractResourceTypePath(plugin, abstractResource.type)}>{abstractResource.label}</Link>
            <a
                className="hash-link"
                aria-label={textContent.abstractResources.pluginResourceTypeAriaLabel(abstractResource.label)}
                href={`#${elementId}`}
            ></a>
        </h3>
        <div className="padding-bottom--md">
            <code>{abstractResource.type}</code>
        </div>
        <div>
            <MarkdownWithCodeBlocks>{abstractResource.summary}</MarkdownWithCodeBlocks>
        </div>
    </>
}

type Props = {
    abstractResources: DeployEnginePluginDocContentResource[];
    plugin: DeployEnginePluginDocContent;
}

export default function DeployEnginePluginDocAbstractResourcesOverview(props: Readonly<Props>) {
    const { abstractResources, plugin } = props;

    const textContent = useDeployEnginePluginTextContent();

    return <div>
        <h2 className="anchor " id="plugin-abstract-resources">
            {textContent.abstractResources.pluginResourcesTitle}
            <a 
                className="hash-link"
                aria-label={textContent.abstractResources.pluginResourcesTitleAriaLabel}
                href="#plugin-resources"
            ></a>
        </h2>
        {abstractResources.length === 0 && (
            <p>{textContent.abstractResources.pluginNoResourcesText}</p>
        )}
        <ul className="plain-list">
            {abstractResources.length > 0 && abstractResources.map((abstractResource) => (
                <div key={abstractResource.type}>
                    <DeployEnginePluginDocAbstractResourceSummary abstractResource={abstractResource} plugin={plugin} textContent={textContent} />
                    <hr />
                </div>
            ))}
        </ul>
    </div>
}
