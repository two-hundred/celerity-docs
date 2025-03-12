import { ValueTypeDefinition } from '@site/src/utils/function-types';
import React from 'react';
import FunctionValueTypeDefinitionObject from './FunctionValueTypeDefinitionObject';
import FunctionValueTypeDefinitionFunction from './FunctionValueTypeDefinitionFunction';

type Props = {
    definition: ValueTypeDefinition;
    schemaPath: string;
    functionValueTypes: Record<string, ValueTypeDefinition>;
    level: number;
};

export default function FunctionValueTypeDefinition({ definition }: Readonly<Props>) {
    if (definition.type === 'object') {
        return <FunctionValueTypeDefinitionObject
            definition={definition}
        />
    }

    if (definition.type === 'function') {
        return <FunctionValueTypeDefinitionFunction
            definition={definition}
        />
    }

    return null;
}
