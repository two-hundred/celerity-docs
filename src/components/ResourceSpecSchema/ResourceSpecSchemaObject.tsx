import React from 'react';

import { ResourceSpecSchemaObjectType, ResourceSpecSchemaType } from "@site/src/utils/types";
import { ResourceSpecSchema } from '.';
import { pluginDataTypeElementId, pluginSchemaElementId } from '@site/src/utils/deploy-engine-plugin-docs';
import useDeployEnginePluginTextContent from '@site/src/hooks/use-deploy-engine-plugin-text-content';
import MarkdownWithCodeBlocks from '../MarkdownWithCodeBlocks';

type Props = {
    schemaPath: string;
    schema: ResourceSpecSchemaObjectType;
    dataTypeSchemas: Record<string, ResourceSpecSchemaType>;
    level: number;
}

export default function ResourceSpecSchemaObject({ schema, schemaPath, dataTypeSchemas, level }: Readonly<Props>) {
    const textContent = useDeployEnginePluginTextContent();

    const renderObjectSchema = () => {
        return Object.entries(schema.attributes).map(([attrName, attribute]) => {
            const elementId = pluginSchemaElementId(schemaPath, attrName);
            return (
                <div key={attrName}>
                    <h4 className="anchor" id={elementId}>
                        {attrName}
                        <a className="hash-link" aria-label={attrName} href={`#${elementId}`}></a>
                    </h4>
                    {schema.required?.includes(attrName) && <div className="padding-bottom--md">
                        <i><b>{textContent.requiredText}</b></i>
                    </div>}
                    {attribute.computed && <div className="padding-bottom--md">
                        <i><b>{textContent.computedText}</b></i>
                    </div>}
                    <ResourceSpecSchema
                        schema={attribute}
                        schemaPath={`${schemaPath}/${attrName}`}
                        dataTypeSchemas={dataTypeSchemas}
                        level={level + 1}
                    />
                    <hr />
                </div>
            )
        })
    }

    const renderObjectSchemaRef = () => {
        return <div>
            <div>
                <MarkdownWithCodeBlocks>{schema.description}</MarkdownWithCodeBlocks>
            </div>
            <p><b>{textContent.pluginFieldTypeLabel}</b></p>
            <p><a href={`#${pluginDataTypeElementId(schema.label)}`}>{schema.label}</a></p>
            <p><b>{textContent.pluginFieldNullValueLabel}</b></p>
            <p>{schema.nullable ? textContent.yesText : textContent.noText}</p>
        </div>
    }

    return <>
        {level === 1 && renderObjectSchema()}
        {level > 1 && renderObjectSchemaRef()}
    </>
}
