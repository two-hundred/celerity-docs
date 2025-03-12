import React, { useMemo } from "react"
import { DeployEnginePluginDocContent, DeployEnginePluginDocContentCustomVarType } from "../utils/types"
import useDeployEnginePluginTextContent from "../hooks/use-deploy-engine-plugin-text-content";
import { DeployEnginePluginTextContent } from "../contexts/deploy-engine";
import { pluginCustomVarTypePath, pluginCustomVarTypeElementId } from "../utils/deploy-engine-plugin-docs";
import Link from "@docusaurus/Link";
import MarkdownWithCodeBlocks from "./MarkdownWithCodeBlocks";

type DataSourceSummaryProps = {
    textContent: DeployEnginePluginTextContent;
    customVarType: DeployEnginePluginDocContentCustomVarType;
    plugin: DeployEnginePluginDocContent;
}

function DeployEnginePluginDocCustomVarTypeSummary(props: Readonly<DataSourceSummaryProps>) {
    const { textContent, customVarType, plugin } = props;

    const elementId = useMemo(() => pluginCustomVarTypeElementId(customVarType.type), [customVarType.type]);

    return <>
        <h3 className="anchor" id={elementId}>
            <Link to={pluginCustomVarTypePath(plugin, customVarType.type)}>{customVarType.label}</Link>
            <a
                className="hash-link"
                aria-label={textContent.customVarTypes.pluginCustomVarTypeAriaLabel(customVarType.label)}
                href={`#${elementId}`}
            ></a>
        </h3>
        <div className="padding-bottom--md">
            <code>{customVarType.type}</code>
        </div>
        <div>
            <MarkdownWithCodeBlocks>{customVarType.summary}</MarkdownWithCodeBlocks>
        </div>
    </>
}

type Props = {
    customVarTypes: DeployEnginePluginDocContentCustomVarType[];
    plugin: DeployEnginePluginDocContent;
}

export default function DeployEnginePluginDocCustomVarTypesOverview(props: Readonly<Props>) {
    const { customVarTypes, plugin } = props;

    const textContent = useDeployEnginePluginTextContent();

    return <div>
        <h2 className="anchor " id="plugin-custom-var-types">
            {textContent.customVarTypes.pluginCustomVarTypesTitle}
            <a 
                className="hash-link" 
                aria-label={textContent.customVarTypes.pluginCustomVarTypesTitleAriaLabel} 
                href="#plugin-custom-var-types"
            ></a>
        </h2>
        {customVarTypes.length === 0 && (
            <p>{textContent.customVarTypes.pluginNoCustomVarTypesText}</p>
        )}
        <ul className="plain-list">
            {customVarTypes.length > 0 && customVarTypes.map((customVarType) => (
                <div key={customVarType.type}>
                    <DeployEnginePluginDocCustomVarTypeSummary customVarType={customVarType} plugin={plugin} textContent={textContent} />
                    <hr />
                </div>
            ))}
        </ul>
    </div>
}
