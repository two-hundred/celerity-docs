import { FunctionTypeValueTypeDefinition } from '@site/src/utils/function-types';
import React from 'react';
import MarkdownWithCodeBlocks from '../MarkdownWithCodeBlocks';
import FunctionDefinition from '.';
import { renderFunctionSignature } from '@site/src/utils/render';

type Props = {
    definition: FunctionTypeValueTypeDefinition;
};

export default function FunctionValueTypeDefinitionFunction({ definition }: Readonly<Props>) {
    return <div>
        <MarkdownWithCodeBlocks>{definition.description}</MarkdownWithCodeBlocks>
        <code>{renderFunctionSignature(definition.functionDefinition)}</code>
        <FunctionDefinition 
            functionName={"anonymous-function"}
            functionDef={definition.functionDefinition}
            schemaPath={definition.label}
            parentValueType={definition.label}
            // Start at heading level 4 because this is a nested function definition.
            headingLevel={4}
        />
    </div>
}
