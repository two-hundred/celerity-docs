import React, { useMemo } from "react"
import { DeployEnginePluginDocContent, DeployEnginePluginDocContentLink, DeployEnginePluginDocContentLinkWithPluginInfo } from "../utils/types"
import useDeployEnginePluginTextContent from "../hooks/use-deploy-engine-plugin-text-content";
import { DeployEnginePluginTextContent } from "../contexts/deploy-engine";
import { pluginLinkTypeElementId, pluginLinkPath } from "../utils/deploy-engine-plugin-docs";
import Link from "@docusaurus/Link";
import MarkdownWithCodeBlocks from "./MarkdownWithCodeBlocks";

type LinkSummaryProps = {
    textContent: DeployEnginePluginTextContent;
    link: DeployEnginePluginDocContentLink;
    plugin: DeployEnginePluginDocContent;
    globalLinkMap: Record<string, DeployEnginePluginDocContentLinkWithPluginInfo>;
}

function DeployEnginePluginDocLinkSummary(props: Readonly<LinkSummaryProps>) {
    const { textContent, link, plugin, globalLinkMap } = props;

    const elementId = useMemo(() => pluginLinkTypeElementId(link.type), [link.type]);
    const linkLabel = useMemo(() => {
        const linkWithResourceInfo = globalLinkMap[link.type];
        return linkWithResourceInfo ? textContent.resources.pluginResourceTypeLinkLabel(
            linkWithResourceInfo.resourceTypeA,
            linkWithResourceInfo.resourceTypeB,
        ) : "";
    }, [globalLinkMap, link.type]);

    return <>
        <h3 className="anchor" id={elementId}>
            <Link to={pluginLinkPath(plugin, link.type)}>{linkLabel}</Link>
            <a
                className="hash-link"
                aria-label={textContent.links.pluginLinkTypeAriaLabel(linkLabel)}
                href={`#${elementId}`}
            ></a>
        </h3>
        <div className="padding-bottom--md">
            <code>{link.type}</code>
        </div>
        <div>
            <MarkdownWithCodeBlocks>{link.summary}</MarkdownWithCodeBlocks>
        </div>
    </>
}

type Props = {
    links: DeployEnginePluginDocContentLink[];
    plugin: DeployEnginePluginDocContent;
    globalLinkMap: Record<string, DeployEnginePluginDocContentLinkWithPluginInfo>;
}

export default function DeployEnginePluginDocLinksOverview(props: Readonly<Props>) {
    const { links, plugin, globalLinkMap } = props;

    const textContent = useDeployEnginePluginTextContent();

    return <div>
        <h2 className="anchor " id="plugin-link">
            {textContent.links.pluginLinksTitle}
            <a className="hash-link" aria-label={textContent.links.pluginLinksTitleAriaLabel} href="#plugin-link"></a>
        </h2>
        {links.length === 0 && (
            <p>{textContent.links.pluginNoLinksText}</p>
        )}
        <ul className="plain-list">
            {links.length > 0 && links.map((link) => (
                <div key={link.type}>
                    <DeployEnginePluginDocLinkSummary link={link} plugin={plugin} globalLinkMap={globalLinkMap} textContent={textContent} />
                    <hr />
                </div>
            ))}
        </ul>
    </div>
}
