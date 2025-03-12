import React, { useMemo } from 'react';
import {
    DeployEnginePluginDocContentLinkWithPluginInfo,
    DeployEnginePluginDocContentResource,
    DeployEnginePluginDocContentResourceWithPluginInfo,
    ProviderPluginDocContent,
    ResourceKind,
} from '../utils/types';
import { createLinkId, pluginAbstractResourceTypePath, pluginLinkPath, pluginLinkToResourceTypeElementId, pluginResourceTypePath } from '../utils/deploy-engine-plugin-docs';
import Link from '@docusaurus/Link';
import useDeployEnginePluginTextContent from '../hooks/use-deploy-engine-plugin-text-content';

type Props = {
    linkTo: string;
    currentResource: DeployEnginePluginDocContentResource;
    pluginContent: ProviderPluginDocContent;
    globalLinkMap: Record<string, DeployEnginePluginDocContentLinkWithPluginInfo>;
    globalResourceMap: Record<string, DeployEnginePluginDocContentResourceWithPluginInfo>;
    kind: ResourceKind;
}

export default function DeployEnginePluginDocResourceLinkTo({
    linkTo,
    currentResource,
    pluginContent,
    globalLinkMap,
    globalResourceMap,
    kind,
}: Readonly<Props>) {
    const textContent = useDeployEnginePluginTextContent();
    const resourcesTextContent = kind === 'abstract' ? textContent.abstractResources : textContent.resources;
    const resourceTypePathFunc = kind === 'abstract' ? pluginAbstractResourceTypePath : pluginResourceTypePath;
    const elementId = pluginLinkToResourceTypeElementId(linkTo);
    const linkId = createLinkId(currentResource.type, linkTo);
    const link = globalLinkMap[linkId];

    const linkPlugin = useMemo(
        () => globalLinkMap[linkId]?.plugin,
        [globalLinkMap, linkId],
    );

    const linkToResource = useMemo(
        () => link?.resourceTypeB ?? globalResourceMap[linkTo],
        [link],
    );

    if (!linkToResource) {
        return null;
    }

    return <div>
        <h3 className="anchor" id={elementId}>
            <Link to={resourceTypePathFunc(pluginContent, linkTo)}>{linkToResource.label}</Link>
            <a
                className="hash-link"
                aria-label={resourcesTextContent.pluginResourceTypeAriaLabel(linkToResource.label)}
                href={`#${elementId}`}
            ></a>
        </h3>
        <p>
            {linkToResource.summary}
        </p>
        {kind === 'concrete' && <p>
            <Link to={pluginLinkPath(linkPlugin, linkId)}>
                {resourcesTextContent.pluginResourceTypeLinkLabel(currentResource, linkToResource)}
            </Link>
        </p>}
        <hr />
    </div>
}
