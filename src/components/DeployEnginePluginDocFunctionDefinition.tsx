import React from 'react';

import { ValueTypeDefinition } from "../utils/function-types";
import { DeployEnginePluginDocContentFunction } from "../utils/types"
import useDeployEnginePluginTextContent from '../hooks/use-deploy-engine-plugin-text-content';
import FunctionDefinition, { FunctionValueTypes } from './FunctionDefinition';

type Props = {
    func: DeployEnginePluginDocContentFunction;
    functionValueTypes: Record<string, ValueTypeDefinition>;
}

export default function DeployEnginePluginDocFunctionDefinition({ func, functionValueTypes }: Readonly<Props>) {
    const textContent = useDeployEnginePluginTextContent();

    return <div>
        <h2 className="anchor " id="plugin-function-definition">
            {textContent.functions.pluginFunctionDefinitionTitle}
            <a
                className="hash-link"
                aria-label={textContent.functions.pluginFunctionDefinitionTitleAriaLabel(func.name)}
                href="#plugin-function-definition"
            ></a>
        </h2>
        <FunctionDefinition functionName={func.name} functionDef={func} schemaPath="root" />
        {Object.entries(functionValueTypes).length > 0 && (
            <>
                <h2 className="anchor " id="plugin-function-value-types">
                    {textContent.functions.pluginFunctionTypesTitle}
                    <a
                        className="hash-link"
                        aria-label={textContent.functions.pluginFunctionTypesTitleAriaLabel(func.name)}
                        href="#plugin-function-value-types"
                    ></a>
                </h2>
                <FunctionValueTypes functionValueTypes={functionValueTypes} />
            </>
        )}
    </div>
}
