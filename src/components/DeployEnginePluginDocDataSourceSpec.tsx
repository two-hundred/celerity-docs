import React, { useMemo } from 'react';
import {
    DataSourceFieldSpec,
    DeployEnginePluginDocContentDataSource,
} from '../utils/types';
import useDeployEnginePluginTextContent from '../hooks/use-deploy-engine-plugin-text-content';
import { DeployEnginePluginTextContent } from '../contexts/deploy-engine';
import { pluginDataSourceSpecFieldElementId } from '../utils/deploy-engine-plugin-docs';
import MarkdownWithCodeBlocks from './MarkdownWithCodeBlocks';

type DataSourceFieldDefinitionProps = {
    fieldName: string;
    definition: DataSourceFieldSpec;
    textContent: DeployEnginePluginTextContent;
};

function DataSourceFieldDefinition({ 
    fieldName,
    definition,
    textContent
}: Readonly<DataSourceFieldDefinitionProps>) {

    const elementId = useMemo(() => pluginDataSourceSpecFieldElementId(fieldName), [fieldName]);

    return <>
        <h3 className="anchor" id={elementId}>
            {fieldName}
            <a 
                className="hash-link"
                aria-label={textContent.dataSources.pluginDataSourceFieldAriaLabel(fieldName)}
                href={`#${elementId}`}
            ></a>
        </h3>
        {definition.filterable && <div className="padding-bottom--md"><i><b>
            {textContent.dataSources.dataSourceFieldFilterableText}
        </b></i></div>}
        <div>
            <MarkdownWithCodeBlocks>{definition.description}</MarkdownWithCodeBlocks>
        </div>
        <p><b>{textContent.pluginFieldTypeLabel}</b></p>
        <p>{definition.type}</p>
        <p><b>{textContent.pluginFieldNullValueLabel}</b></p>
        <p>{definition.nullable ? textContent.yesText : textContent.noText}</p>
    </>
}

type Props = {
    dataSource: DeployEnginePluginDocContentDataSource;
}

export default function DeployEnginePluginDocDataSourceSpec({ dataSource }: Readonly<Props>) {
    const textContent = useDeployEnginePluginTextContent();
    const specFields = Object.entries(dataSource.specification.fields);

    return <div>
        <h2 className="anchor" id="plugin-datasource-fields">
            {textContent.dataSources.pluginDataSourceFieldsTitle}
            <a 
                className="hash-link"
                aria-label={textContent.dataSources.pluginDataSourceFieldsTitle}
                href="#plugin-datasource-fields"
            ></a>
        </h2>
        <div>
            <MarkdownWithCodeBlocks>
                {textContent.dataSources.pluginDataSourceFieldsHelpText}
            </MarkdownWithCodeBlocks>
        </div>
        {specFields.length === 0 && (
            <p>{textContent.dataSources.pluginNoDataSourceFieldsText}</p>
        )}
        <ul className="plain-list">
            {specFields.length > 0 && specFields.map(
                ([fieldName, fieldDefinition]) => {
                    return (
                        <li key={fieldName}>
                            <DataSourceFieldDefinition
                                fieldName={fieldName}
                                definition={fieldDefinition}
                                textContent={textContent}
                            />
                            <hr />
                        </li>
                    )
                },
            )}
        </ul>
    </div>
}
