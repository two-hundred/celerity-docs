import React, { ReactNode } from 'react';

import CodeBlock from '@theme/CodeBlock';

import { ResourceSpecSchemaType, Scalar } from './types';
import { isScalarType } from '../components/ResourceSpecSchema';
import { pluginDataTypeElementId, pluginFunctionValueTypeElementId } from './deploy-engine-plugin-docs';
import { FunctionDefinition, FunctionParameter, FunctionReturn, ValueTypeDefinition } from './function-types';
import { isScalarValueType, isScalarFunctionParameter, isScalarFunctionReturnType } from './function-definitions';


export function renderDefaultValue(defaultValue: Scalar): ReactNode {
    return <code>{defaultValue}</code>
}

export function renderExamples(examples: Scalar[]): ReactNode {
    return (
        <>
            {examples.map((example, index) => {
                return (
                    <CodeBlock key={`${example}--${index}`}>{example}</CodeBlock>
                )
            })}
        </>
    )
}

export function renderAnyValue(value: unknown): ReactNode {
    if (typeof value === 'string'
        || typeof value === 'number'
        || typeof value === 'boolean') {
        return <code>{value}</code>
    }

    if (Array.isArray(value) || typeof value === 'object') {
        return (
            <CodeBlock language="json">{JSON.stringify(value, null, 2)}</CodeBlock>
        )
    }

    return null;
}


export function renderAnyExamples(examples: unknown[]): ReactNode {
    return (
        <>
            {examples.map((example, index) => {
                return (
                    <CodeBlock key={index}>{renderAnyValue(example)}</CodeBlock>
                )
            })}
        </>
    )
}

export function renderType(schema: ResourceSpecSchemaType): ReactNode {
    if (isScalarType(schema)) {
        return schema.type;
    }

    if (schema.type === 'object') {
        return <a href={`#${pluginDataTypeElementId(schema.label)}`}>{schema.label}</a>;
    }

    if (schema.type === 'array') {
        return <>array[ {renderType(schema.items)} ]</>;
    }

    if (schema.type === 'map') {
        return <>map[ string, {renderType(schema.mapValues)} ]</>;
    }

    if (schema.type === 'union') {
        return (
            <>
                {schema.oneOf.map((type, index) => {
                    return (
                        <React.Fragment key={index}>
                            {renderType(type)}{index < schema.oneOf.length - 1 ? ' | ' : ''}
                        </React.Fragment>
                    )
                })}
            </>
        )
    }

    return null;
}


export function renderFunctionParamType(param: FunctionParameter): ReactNode {
    if (isScalarFunctionParameter(param)) {
        return param.paramType;
    }

    if (param.paramType === 'object' ||
        param.paramType === 'function'
    ) {
        return renderFunctionValueType(param.valueTypeDefinition);
    }

    if (param.paramType === 'list') {
        return <>list[ {renderFunctionValueType(param.elementValueTypeDefinition)} ]</>;
    }

    if (param.paramType === 'map') {
        return <>map[ string, {renderFunctionValueType(param.mapValueTypeDefinition)} ]</>;
    }

    if (param.paramType === 'variadic') {
        if (param.singleType) {
            return <>{renderFunctionValueType(param.valueTypeDefinition)}{"..."}</>;
        }

        return 'any';
    }

    if (param.paramType === 'any') {
        return param.unionValueTypeDefinitions?.map((unionValueTypeDefinition, index) => {
            return (
                <React.Fragment key={index}>
                    {renderFunctionValueType(unionValueTypeDefinition)}{index < param.unionValueTypeDefinitions.length - 1 ? ' | ' : ''}
                </React.Fragment>
            )
        }) ?? 'any';
    }

    return null;
}

export function renderFunctionReturnType(returnTypeDef: FunctionReturn): ReactNode {
    if (isScalarFunctionReturnType(returnTypeDef)) {
        return returnTypeDef.returnType;
    }

    if (returnTypeDef.returnType === 'object' ||
        returnTypeDef.returnType === 'function'
    ) {
        return renderFunctionValueType(returnTypeDef.valueTypeDefinition);
    }

    if (returnTypeDef.returnType === 'list') {
        return <>list[ {renderFunctionValueType(returnTypeDef.elementValueTypeDefinition)} ]</>;
    }

    if (returnTypeDef.returnType === 'map') {
        return <>map[ string, {renderFunctionValueType(returnTypeDef.mapValueTypeDefinition)} ]</>;
    }


    if (returnTypeDef.returnType === 'any') {
        return renderAnyFunctionValueType(returnTypeDef.unionValueTypeDefinitions);
    }

    return null;
}

export function renderFunctionValueType(valueType: ValueTypeDefinition): ReactNode {
    if (isScalarValueType(valueType)) {
        return valueType.type;
    }

    if (valueType.type === 'object' || valueType.type === 'function') {
        return <a href={`#${pluginFunctionValueTypeElementId(valueType.label)}`}>{valueType.label}</a>;
    }

    if (valueType.type === 'list') {
        return <>list[ {renderFunctionValueType(valueType.elementValueTypeDefinition)} ]</>;
    }

    if (valueType.type === 'map') {
        return <>map[ string, {renderFunctionValueType(valueType.mapValueTypeDefinition)} ]</>;
    }

    if (valueType.type === 'any') {
        return renderAnyFunctionValueType(valueType.unionValueTypeDefinitions);
    }

    return null;
}

function renderAnyFunctionValueType(unionValueTypes?: ValueTypeDefinition[]): ReactNode {
    return unionValueTypes?.map((unionValueTypeDefinition, index) => {
        return (
            <React.Fragment key={index}>
                {renderFunctionValueType(unionValueTypeDefinition)}{index < unionValueTypes.length - 1 ? ' | ' : ''}
            </React.Fragment>
        )
    }) ?? 'any';
}

export function renderFunctionSignature(functionDef: FunctionDefinition): ReactNode {
    return (
        <>
            {"("}{renderFunctionParams(functionDef.parameters)}{")"}{" -> "}{renderFunctionReturnType(functionDef.return)}
        </>
    )
}

export function renderFunctionParams(params: FunctionParameter[]): ReactNode {
    if (params.length === 1 && params[0].paramType === 'variadic') {
        return (
            <>
               {params[0].named ? '[name]: ' : ''}{renderFunctionParamType(params[0])}
            </>
        )
    }

    return (
        <>
            {params.map((param, index) => {
                return (
                    <React.Fragment key={index}>
                        {param.name ? `${param.name}: ` : ''}{renderFunctionParamType(param)}{index < params.length - 1 ? ', ' : ''}
                    </React.Fragment>
                )
            })}
        </>
    )
}


export function renderScalarValues(values: Scalar[]): ReactNode {
    return (
        <>
            {values.map((value, index) => {
                return (
                    <>
                        <code>{value}</code>{index < values.length - 1 ? ' | ' : ''}
                    </>
                )
            })}
        </>
    )
}
