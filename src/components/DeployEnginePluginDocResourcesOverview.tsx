import React, { useMemo } from "react"
import { DeployEnginePluginDocContent, DeployEnginePluginDocContentResource } from "../utils/types"
import useDeployEnginePluginTextContent from "../hooks/use-deploy-engine-plugin-text-content";
import { DeployEnginePluginTextContent } from "../contexts/deploy-engine";
import { pluginResourceTypeElementId, pluginResourceTypePath } from "../utils/deploy-engine-plugin-docs";
import Link from "@docusaurus/Link";
import MarkdownWithCodeBlocks from "./MarkdownWithCodeBlocks";

type ResourceSummaryProps = {
    textContent: DeployEnginePluginTextContent;
    resource: DeployEnginePluginDocContentResource;
    plugin: DeployEnginePluginDocContent;
}

function DeployEnginePluginDocResourceSummary(props: Readonly<ResourceSummaryProps>) {
    const { textContent, resource, plugin } = props;

    const elementId = useMemo(() => pluginResourceTypeElementId(resource.type), [resource.type]);

    return <>
        <h3 className="anchor" id={elementId}>
            <Link to={pluginResourceTypePath(plugin, resource.type)}>{resource.label}</Link>
            <a
                className="hash-link"
                aria-label={textContent.resources.pluginResourceTypeAriaLabel(resource.label)}
                href={`#${elementId}`}
            ></a>
        </h3>
        <div className="padding-bottom--md">
            <code>{resource.type}</code>
        </div>
        <div>
            <MarkdownWithCodeBlocks>{resource.summary}</MarkdownWithCodeBlocks>
        </div>
    </>
}

type Props = {
    resources: DeployEnginePluginDocContentResource[];
    plugin: DeployEnginePluginDocContent;
}

export default function DeployEnginePluginDocResourcesOverview(props: Readonly<Props>) {
    const { resources, plugin } = props;

    const textContent = useDeployEnginePluginTextContent();

    return <div>
        <h2 className="anchor " id="plugin-resources">
            {textContent.resources.pluginResourcesTitle}
            <a 
                className="hash-link"
                aria-label={textContent.resources.pluginResourcesTitleAriaLabel}
                href="#plugin-resources"
            ></a>
        </h2>
        {resources.length === 0 && (
            <p>{textContent.resources.pluginNoResourcesText}</p>
        )}
        <ul className="plain-list">
            {resources.length > 0 && resources.map((resource) => (
                <div key={resource.type}>
                    <DeployEnginePluginDocResourceSummary resource={resource} plugin={plugin} textContent={textContent} />
                    <hr />
                </div>
            ))}
        </ul>
    </div>
}
