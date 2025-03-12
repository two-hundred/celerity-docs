import React, { useMemo } from "react"
import { DeployEnginePluginDocContent, DeployEnginePluginDocContentDataSource } from "../utils/types"
import useDeployEnginePluginTextContent from "../hooks/use-deploy-engine-plugin-text-content";
import { DeployEnginePluginTextContent } from "../contexts/deploy-engine";
import { pluginDataSourcePath, pluginDataSourceTypeElementId } from "../utils/deploy-engine-plugin-docs";
import Link from "@docusaurus/Link";
import MarkdownWithCodeBlocks from "./MarkdownWithCodeBlocks";

type DataSourceSummaryProps = {
    textContent: DeployEnginePluginTextContent;
    dataSource: DeployEnginePluginDocContentDataSource;
    plugin: DeployEnginePluginDocContent;
}

function DeployEnginePluginDocDataSourceSummary(props: Readonly<DataSourceSummaryProps>) {
    const { textContent, dataSource, plugin } = props;

    const elementId = useMemo(() => pluginDataSourceTypeElementId(dataSource.type), [dataSource.type]);

    return <>
        <h3 className="anchor" id={elementId}>
            <Link to={pluginDataSourcePath(plugin, dataSource.type)}>{dataSource.label}</Link>
            <a
                className="hash-link"
                aria-label={textContent.dataSources.pluginDataSourceTypeAriaLabel(dataSource.label)}
                href={`#${elementId}`}
            ></a>
        </h3>
        <div className="padding-bottom--md">
            <code>{dataSource.type}</code>
        </div>
        <div>
            <MarkdownWithCodeBlocks>{dataSource.summary}</MarkdownWithCodeBlocks>
        </div>
    </>
}

type Props = {
    dataSources: DeployEnginePluginDocContentDataSource[];
    plugin: DeployEnginePluginDocContent;
}

export default function DeployEnginePluginDocDataSourcesOverview(props: Readonly<Props>) {
    const { dataSources, plugin } = props;

    const textContent = useDeployEnginePluginTextContent();

    return <div>
        <h2 className="anchor " id="plugin-datasources">
            {textContent.dataSources.pluginDataSourcesTitle}
            <a 
                className="hash-link"
                aria-label={textContent.dataSources.pluginDataSourcesTitleAriaLabel}
                href="#plugin-datasources"
            ></a>
        </h2>
        {dataSources.length === 0 && (
            <p>{textContent.dataSources.pluginNoDataSourcesText}</p>
        )}
        <ul className="plain-list">
            {dataSources.length > 0 && dataSources.map((dataSource) => (
                <div key={dataSource.type}>
                    <DeployEnginePluginDocDataSourceSummary dataSource={dataSource} plugin={plugin} textContent={textContent} />
                    <hr />
                </div>
            ))}
        </ul>
    </div>
}
