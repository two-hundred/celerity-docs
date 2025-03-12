import { ResourceKind, ResourceSpecSchemaType } from '@site/src/utils/types';
import React from 'react';
import { ResourceSpecSchema } from '.';
import useDeployEnginePluginTextContent from '@site/src/hooks/use-deploy-engine-plugin-text-content';
import { pluginDataTypeElementId } from '@site/src/utils/deploy-engine-plugin-docs';
import MarkdownWithCodeBlocks from '../MarkdownWithCodeBlocks';

type DataTypeProps = {
    dataType: string; 
    schema: ResourceSpecSchemaType;
    dataTypeSchemas: Record<string, ResourceSpecSchemaType>;
    kind: ResourceKind;
}

function ResourceSpecSchemaDataType({ dataType, schema, dataTypeSchemas, kind }: Readonly<DataTypeProps>) {
    const textContent = useDeployEnginePluginTextContent();
    const resourceTextContent = kind === 'abstract' ? textContent.abstractResources : textContent.resources;
    const elementId = pluginDataTypeElementId(dataType);

    return <div>
        <h3 className="anchor" id={elementId}>
            {dataType}
            <a className="hash-link" aria-label={resourceTextContent.pluginResourceSpecDataTypeArialLabel(schema.label)} href={`#${elementId}`}></a>
        </h3>
        <MarkdownWithCodeBlocks>{schema.description}</MarkdownWithCodeBlocks>
        <ResourceSpecSchema schema={schema} schemaPath={dataType} dataTypeSchemas={dataTypeSchemas} level={1} />
    </div>
}

type Props = {
    dataTypeSchemas: Record<string, ResourceSpecSchemaType>;
    kind: ResourceKind;
}

export default function ResourceSpecSchemaDataTypes({ dataTypeSchemas, kind }: Readonly<Props>) {
    return <ul className="plain-list">
        {Object.entries(dataTypeSchemas).map(([dataType, schema]) => {
            return <li key={dataType}>
                <ResourceSpecSchemaDataType dataType={dataType} schema={schema} dataTypeSchemas={dataTypeSchemas} kind={kind} />
            </li>
        })}
    </ul>
}
