import React, { useMemo } from 'react';
import { 
    DeployEnginePluginDocContentLinkWithPluginInfo, 
    DeployEnginePluginDocContentResource, 
    ProviderPluginDocContent,
} from '../utils/types';
import { createLinkId, pluginLinkPath, pluginLinkToResourceTypeElementId, pluginResourceTypePath } from '../utils/deploy-engine-plugin-docs';
import Link from '@docusaurus/Link';
import useDeployEnginePluginTextContent from '../hooks/use-deploy-engine-plugin-text-content';

type Props = {
    linkTo: string;
    currentResource: DeployEnginePluginDocContentResource;
    pluginContent: ProviderPluginDocContent;
    globalLinkMap: Record<string, DeployEnginePluginDocContentLinkWithPluginInfo>;
}

export default function DeployEnginePluginDocResourceLinkTo(
    { linkTo, currentResource, pluginContent, globalLinkMap }: Readonly<Props>,
) {
    const textContent = useDeployEnginePluginTextContent();
    const elementId = pluginLinkToResourceTypeElementId(linkTo);
    const linkId = createLinkId(currentResource.type, linkTo);
    const link = globalLinkMap[linkId];

    const linkPlugin = useMemo(
        () => globalLinkMap[linkId]?.plugin,
        [globalLinkMap, linkId],
    );

    const linkToResource = useMemo(
        () => link?.resourceTypeB,
        [link],
    );

    if (!linkToResource) {
        return null;
    }

    return <div>
        <h3 className="anchor" id={elementId}>
            <Link to={pluginResourceTypePath(pluginContent, linkTo)}>{linkToResource.label}</Link>
            <a
                className="hash-link"
                aria-label={textContent.resources.pluginResourceTypeAriaLabel(linkToResource.label)}
                href={`#${elementId}`}
            ></a>
        </h3>
        <p>
            {linkToResource.summary}
        </p>
        <p>
            <Link to={pluginLinkPath(linkPlugin, linkId)}>
                {textContent.resources.pluginResourceTypeLinkLabel(currentResource, linkToResource)}
            </Link>
        </p>
        <hr />
    </div>
}
