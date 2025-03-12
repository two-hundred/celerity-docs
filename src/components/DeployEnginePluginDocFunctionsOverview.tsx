import React, { useMemo } from "react"
import { DeployEnginePluginDocContent, DeployEnginePluginDocContentDataSource, DeployEnginePluginDocContentFunction } from "../utils/types"
import useDeployEnginePluginTextContent from "../hooks/use-deploy-engine-plugin-text-content";
import { DeployEnginePluginTextContent } from "../contexts/deploy-engine";
import { pluginFunctionPath, pluginFunctionElementId } from "../utils/deploy-engine-plugin-docs";
import Link from "@docusaurus/Link";
import MarkdownWithCodeBlocks from "./MarkdownWithCodeBlocks";

type FunctionSummaryProps = {
    textContent: DeployEnginePluginTextContent;
    func: DeployEnginePluginDocContentFunction;
    plugin: DeployEnginePluginDocContent;
}

function DeployEnginePluginDocFunctionSummary(props: Readonly<FunctionSummaryProps>) {
    const { textContent, func, plugin } = props;

    const elementId = useMemo(() => pluginFunctionElementId(func.name), [func.name]);

    return <>
        <h3 className="anchor" id={elementId}>
            <Link to={pluginFunctionPath(plugin, func.name)}><code>{func.name}</code></Link>
            <a
                className="hash-link"
                aria-label={textContent.functions.pluginFunctionAriaLabel(func.name)}
                href={`#${elementId}`}
            ></a>
        </h3>
        <div>
            <MarkdownWithCodeBlocks>{func.summary}</MarkdownWithCodeBlocks>
        </div>
    </>
}

type Props = {
    functions: DeployEnginePluginDocContentFunction[];
    plugin: DeployEnginePluginDocContent;
}

export default function DeployEnginePluginDocFunctionsOverview(props: Readonly<Props>) {
    const { functions, plugin } = props;

    const textContent = useDeployEnginePluginTextContent();

    return <div>
        <h2 className="anchor " id="plugin-functions">
            {textContent.functions.pluginFunctionsTitle}
            <a 
                className="hash-link"
                aria-label={textContent.functions.pluginFunctionsTitleAriaLabel}
                href="#plugin-functions"
            ></a>
        </h2>
        {functions.length === 0 && (
            <p>{textContent.functions.pluginNoFunctionsText}</p>
        )}
        <ul className="plain-list">
            {functions.length > 0 && functions.map((func) => (
                <div key={func.name}>
                    <DeployEnginePluginDocFunctionSummary func={func} plugin={plugin} textContent={textContent} />
                    <hr />
                </div>
            ))}
        </ul>
    </div>
}
