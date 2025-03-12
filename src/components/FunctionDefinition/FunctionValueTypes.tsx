import React from 'react';

import { ValueTypeDefinition } from '@site/src/utils/function-types';
import useDeployEnginePluginTextContent from '@site/src/hooks/use-deploy-engine-plugin-text-content';
import { pluginFunctionValueTypeElementId } from '@site/src/utils/deploy-engine-plugin-docs';
import FunctionValueTypeDefinition from './FunctionValueTypeDefinition';

type FunctionValueTypeProps = {
    typeLabel: string;
    definition: ValueTypeDefinition;
    functionValueTypes: Record<string, ValueTypeDefinition>;
};

function FuntionValueType({ typeLabel, definition, functionValueTypes }: Readonly<FunctionValueTypeProps>) {
    const textContent = useDeployEnginePluginTextContent();
    const elementId = pluginFunctionValueTypeElementId(typeLabel);

    return <div>
        <h3 className="anchor" id={elementId}>
            {typeLabel}
            <a className="hash-link" aria-label={textContent.functions.pluginFunctionTypeArialLabel(typeLabel)} href={`#${elementId}`}></a>
        </h3>
        <FunctionValueTypeDefinition definition={definition} schemaPath={typeLabel} functionValueTypes={functionValueTypes} level={1} />
    </div>
}

type Props = {
    functionValueTypes: Record<string, ValueTypeDefinition>;
}

export default function FunctionValueTypes({ functionValueTypes }: Readonly<Props>) {
    return <ul className="plain-list">
        {Object.entries(functionValueTypes).map(([typeLabel, definition]) => {
            return <li key={typeLabel}>
                <FuntionValueType typeLabel={typeLabel} definition={definition} functionValueTypes={functionValueTypes} />
            </li>
        })}
    </ul>
}
