import {
    FunctionDefinition,
    FunctionParameter,
    FunctionReturn,
    ScalarFunctionParameter,
    ScalarValueTypeDefinition,
    ValueTypeDefinition,
    ScalarFunctionReturn
} from "./function-types";


export function extractFunctionTypeDefinitions(
    rootFunc: FunctionDefinition,
): Record<string, ValueTypeDefinition> {
    const functionTypes: Record<string, ValueTypeDefinition> = {};
    extractFunctionTypeDefsRecursive(rootFunc, functionTypes, 1);
    return functionTypes;
}

function extractFunctionTypeDefsRecursive(
    functionDefinition: FunctionDefinition,
    functionTypes: Record<string, ValueTypeDefinition>,
    level: number,
) {

    functionDefinition.parameters.forEach((param) => {
        if (param.paramType === 'function' || param.paramType === 'object') {
            extractFunctionTypeDefsFromValueType(param.valueTypeDefinition, functionTypes, level + 1);
        } else if (param.paramType === 'list') {
            extractFunctionTypeDefsFromValueType(param.elementValueTypeDefinition, functionTypes, level + 1);
        } else if (param.paramType === 'map') {
            extractFunctionTypeDefsFromValueType(param.mapValueTypeDefinition, functionTypes, level + 1);
        } else if (param.paramType === 'any') {
            param.unionValueTypeDefinitions?.forEach((unionValueTypeDefinition) => {
                extractFunctionTypeDefsFromValueType(unionValueTypeDefinition, functionTypes, level + 1);
            });
        } else if (param.paramType === 'variadic') {
            // Treat variadic as "...any" if it is not for a single type,
            // otherwise, we can drill down into the specific type
            // for the variadic arguments.
            if (param.singleType) {
                extractFunctionTypeDefsFromValueType(param.valueTypeDefinition, functionTypes, level + 1);
            }
        }
    });

    const { return: returnTypeDef } = functionDefinition;
    if (returnTypeDef.returnType === 'function' || returnTypeDef.returnType === 'object') {
        extractFunctionTypeDefsFromValueType(returnTypeDef.valueTypeDefinition, functionTypes, level + 1);
    } else if (returnTypeDef.returnType === 'list') {
        extractFunctionTypeDefsFromValueType(returnTypeDef.elementValueTypeDefinition, functionTypes, level + 1);
    } else if (returnTypeDef.returnType === 'map') {
        extractFunctionTypeDefsFromValueType(returnTypeDef.mapValueTypeDefinition, functionTypes, level + 1);
    } else if (returnTypeDef.returnType === 'any') {
        returnTypeDef.unionValueTypeDefinitions?.forEach((unionValueTypeDefinition) => {
            extractFunctionTypeDefsFromValueType(unionValueTypeDefinition, functionTypes, level + 1);
        });
    }
}

function extractFunctionTypeDefsFromValueType(
    valueType: ValueTypeDefinition,
    functionTypes: Record<string, ValueTypeDefinition>,
    level: number,
) {
    if (valueType.type === 'function') {
        functionTypes[valueType.label] = valueType;
        extractFunctionTypeDefsRecursive(valueType.functionDefinition, functionTypes, level + 1);
    } else if (valueType.type === 'object') {
        functionTypes[valueType.label] = valueType;
        Object.values(valueType.attributeValueTypeDefinitions).forEach((attribute) => {
            extractFunctionTypeDefsFromValueType(attribute, functionTypes, level + 1);
        });
    } else if (valueType.type === 'list') {
        extractFunctionTypeDefsFromValueType(valueType.elementValueTypeDefinition, functionTypes, level + 1);
    } else if (valueType.type === 'map') {
        extractFunctionTypeDefsFromValueType(valueType.mapValueTypeDefinition, functionTypes, level + 1);
    }
}

export function isScalarValueType(valueType: ValueTypeDefinition): valueType is ScalarValueTypeDefinition {
    return SCALAR_TYPES.includes(valueType.type as any);
}

export function isScalarFunctionParameter(param: FunctionParameter): param is ScalarFunctionParameter {
    return SCALAR_TYPES.includes(param.paramType as any);
}

export function isScalarFunctionReturnType(returnTypeDef: FunctionReturn): returnTypeDef is ScalarFunctionReturn {
    return SCALAR_TYPES.includes(returnTypeDef.returnType as any);
}

const SCALAR_TYPES = ['string', 'boolean', 'int32', 'int64', 'uint32', 'uint64', 'float32', 'float64'] as const;
