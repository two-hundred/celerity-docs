import { ObjectValueTypeDefinition } from '@site/src/utils/function-types';
import React from 'react';
import MarkdownWithCodeBlocks from '../MarkdownWithCodeBlocks';
import useDeployEnginePluginTextContent from '@site/src/hooks/use-deploy-engine-plugin-text-content';
import { renderFunctionValueType } from '@site/src/utils/render';

type Props = {
    definition: ObjectValueTypeDefinition;
};

export default function FunctionValueTypeDefinitionObject({ definition }: Readonly<Props>) {
    const textContent = useDeployEnginePluginTextContent();

    return <div>
        <MarkdownWithCodeBlocks>{definition.description}</MarkdownWithCodeBlocks>
        <ul className="plain-list">
            {Object.entries(definition.attributeValueTypeDefinitions).map(([attrName, attrDefinition]) => {
                return <li key={attrName}>
                    <h4>{attrName}</h4>
                    <MarkdownWithCodeBlocks>{attrDefinition.description}</MarkdownWithCodeBlocks>
                    <p><b>{textContent.pluginFieldTypeLabel}</b></p>
                    <p>{renderFunctionValueType(attrDefinition)}</p>
                    <hr />
                </li>
            })}
        </ul>
    </div>
}
