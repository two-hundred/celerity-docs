import useDeployEnginePluginTextContent from '@site/src/hooks/use-deploy-engine-plugin-text-content';
import { FunctionDefinition, FunctionParameter } from '@site/src/utils/function-types';
import React from 'react';
import FunctionValueTypes from './FunctionValueTypes';
import { normaliseForElementId, pluginFunctionValueTypeElementId } from '@site/src/utils/deploy-engine-plugin-docs';
import MarkdownWithCodeBlocks from '../MarkdownWithCodeBlocks';
import { renderFunctionParamType, renderFunctionReturnType } from '@site/src/utils/render';

type Props = {
    functionName: string;
    functionDef: FunctionDefinition;
    schemaPath: string;
    parentValueType?: string;
    headingLevel?: number;
}

export default function FunctionDefinitionComp({ functionName, functionDef, schemaPath, parentValueType, headingLevel = 3 }: Readonly<Props>) {
    const textContent = useDeployEnginePluginTextContent();
    const TopLevelHeading = `h${headingLevel}` as keyof React.JSX.IntrinsicElements;
    const SecondLevelHeading = `h${headingLevel + 1}` as keyof React.JSX.IntrinsicElements;
    const elementIdPrefix = parentValueType ? `${pluginFunctionValueTypeElementId(parentValueType)}--` : '';
    return <>
        <TopLevelHeading className="anchor " id={`${elementIdPrefix}plugin-function-parameters`}>
            {textContent.functions.pluginFunctionParametersTitle}
            <a
                className="hash-link"
                aria-label={textContent.functions.pluginFunctionParametersTitleAriaLabel(functionName)}
                href={`#${elementIdPrefix}plugin-function-parameters`}
            ></a>
        </TopLevelHeading>
        {functionDef.parameters.length === 0 && <div>
            <p>{textContent.functions.pluginNoParametersText}</p>
        </div>}
        <ul className="plain-list">
            {functionDef.parameters.map((param, index) => {
                const paramNameIdSafe = getParamName(param, index);
                const elementId = `${elementIdPrefix}${schemaPath}/${paramNameIdSafe}`;
                const paramNameTitle = getParamNameTitle(param, index);
                return <li key={paramNameIdSafe}>
                    <SecondLevelHeading className="anchor" id={elementId}>
                        {paramNameTitle}
                        <a className="hash-link" aria-label={paramNameTitle} href={`#${elementId}`}></a>
                    </SecondLevelHeading>
                    {param.optional && <div className="padding-bottom--md">
                        <i><b>{textContent.optionalText}</b></i>
                    </div>}
                    {param.description && <div>
                        <MarkdownWithCodeBlocks>{param.description}</MarkdownWithCodeBlocks>
                    </div>}
                    <p><b>{textContent.functions.pluginParamTypeLabel}</b></p>
                    <p>{renderFunctionParamType(param)}</p>
                    <p><b>{textContent.pluginFieldNullValueLabel}</b></p>
                    <p>{param.allowNullValue ? textContent.yesText : textContent.noText}</p>
                    <hr />
                </li>
            })}
        </ul>
        <TopLevelHeading className="anchor " id={`${elementIdPrefix}plugin-function-return-type`}>
            {textContent.functions.pluginFunctionReturnTypeTitle}
            <a
                className="hash-link"
                aria-label={textContent.functions.pluginFunctionReturnTypeTitleAriaLabel(functionName)}
                href={`#${elementIdPrefix}plugin-function-return-type`}
            ></a>
        </TopLevelHeading>
        <div>
            {functionDef.return.description && <div>
                <MarkdownWithCodeBlocks>{functionDef.return.description}</MarkdownWithCodeBlocks>
            </div>}
            <p><b>{textContent.functions.pluginReturnTypeLabel}</b></p>
            <p>{renderFunctionReturnType(functionDef.return)}</p>
            <hr />
        </div>
    </>
}

function getParamName(param: FunctionParameter, index: number): string {
    if (param.name) {
        return `param-${normaliseForElementId(param.name)}`;
    }

    if (param.label) {
        return `param-${normaliseForElementId(param.label)}`;
    }

    return `param-${index}`;
}

function getParamNameTitle(param: FunctionParameter, index: number): string {
    if (param.paramType === 'variadic') {
        if (param.named) {
            return "0..N named parameters";
        }
        return "0..N parameters"
    }

    if (param.name) {
        return param.name;
    }

    const label = param.label ?? "param";
    return `${label} (${index})`;
}

export {
    FunctionValueTypes
}
