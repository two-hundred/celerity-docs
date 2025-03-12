import React from 'react';

import { ResourceSpecSchemaType, ResourceSpecSchemaUnionType } from '@site/src/utils/types';
import useDeployEnginePluginTextContent from '@site/src/hooks/use-deploy-engine-plugin-text-content';
import { renderAnyExamples, renderAnyValue, renderType } from '@site/src/utils/render';
import { isScalarType } from '.';
import { pluginDataTypeElementId } from '@site/src/utils/deploy-engine-plugin-docs';
import MarkdownWithCodeBlocks from '../MarkdownWithCodeBlocks';

type Props = {
    schema: ResourceSpecSchemaUnionType;
    schemaPath: string;
    dataTypeSchemas: Record<string, ResourceSpecSchemaType>;
    level: number;
}

export default function ResourceSpecSchemaUnion({ schema, schemaPath, dataTypeSchemas, level }: Readonly<Props>) {
    const textContent = useDeployEnginePluginTextContent();

    const renderUnionType = () => {
        return schema.oneOf.map((schemaInUnion, index) => {
            if (isScalarType(schemaInUnion)) {
                return (
                    <>
                        <div className="union-field-type-item">{schemaInUnion.type}</div>
                        {index < schema.oneOf.length - 1 && <div className="union-field-type-item">|</div>}
                    </>
                )
            }

            if (schemaInUnion.type === 'object') {
                return (
                    <>
                        <div className="union-field-type-item">
                            <a href={`#${pluginDataTypeElementId(schemaInUnion.label)}`}>{schemaInUnion.label}</a>
                        </div>
                        {index < schema.oneOf.length - 1 && <div className="union-field-type-item">|</div>}
                    </>
                )
            }

            if (schemaInUnion.type === 'array') {
                return (
                    <>
                        <div className="union-field-type-item">
                            array[ {renderType(schemaInUnion.items)} ]
                        </div>
                        {index < schema.oneOf.length - 1 && <div className="union-field-type-item">|</div>}
                    </>
                )
            }

            if (schemaInUnion.type === 'map') {
                return (
                    <>
                        <div className="union-field-type-item">
                            map[ string, {renderType(schemaInUnion.mapValues)} ]
                        </div>
                        {index < schema.oneOf.length - 1 && <div className="union-field-type-item">|</div>}
                    </>
                )
            }

            return null;
        })
    }

    return <div>
        <div>
            <MarkdownWithCodeBlocks>{schema.description}</MarkdownWithCodeBlocks>
        </div>
        <p><b>{textContent.pluginFieldTypeLabel}</b></p>
        <p className="union-field-type-items">{renderUnionType()}</p>
        <p><b>{textContent.pluginFieldNullValueLabel}</b></p>
        <p>{schema.nullable ? textContent.yesText : textContent.noText}</p>
        {schema.default && (<>
            <p><b>{textContent.pluginFieldDefaultValueLabel}</b></p>
            <div>{renderAnyValue(schema.default)}</div>
        </>)}
        {schema.examples && (<>
            <p><b>{textContent.pluginFieldExamplesLabel}</b></p>
            <div>{renderAnyExamples(schema.examples)}</div>
        </>)}
    </div>
}
