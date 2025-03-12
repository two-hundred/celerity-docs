export type FunctionDefinition = {
    parameters: FunctionParameter[];
    return: FunctionReturn;
}

export type FunctionParameter =
    StringFunctionParameter |
    Int32FunctionParameter |
    Int64FunctionParameter |
    Uint32FunctionParameter |
    Uint64FunctionParameter |
    Float32FunctionParameter |
    Float64FunctionParameter |
    BooleanFunctionParameter |
    ListFunctionParameter |
    MapFunctionParameter |
    ObjectFunctionParameter |
    FunctionTypeFunctionParameter |
    AnyFunctionParameter |
    VariadicFunctionParameter;

export type FunctionParameterBase = {
    // The name of the parameter for functions that support named arguments.
    name?: string;
    // The usage label for both positional and named arguments
    // that will appear in the function signature docs.
    label?: string;
    description?: string;
    allowNullValue?: boolean;
    optional?: boolean;
}

export type StringFunctionParameter = {
    paramType: 'string';
    valueTypeDefinition: ValueTypeDefinition;
} & FunctionParameterBase;

export type Int32FunctionParameter = {
    paramType: 'int32';
    valueTypeDefinition: ValueTypeDefinition;
} & FunctionParameterBase;

export type Int64FunctionParameter = {
    paramType: 'int64';
    valueTypeDefinition: ValueTypeDefinition;
} & FunctionParameterBase;

export type Uint32FunctionParameter = {
    paramType: 'uint32';
    valueTypeDefinition: ValueTypeDefinition;
} & FunctionParameterBase;

export type Uint64FunctionParameter = {
    paramType: 'uint64';
    valueTypeDefinition: ValueTypeDefinition;
} & FunctionParameterBase;

export type Float32FunctionParameter = {
    paramType: 'float32';
    valueTypeDefinition: ValueTypeDefinition;
} & FunctionParameterBase;

export type Float64FunctionParameter = {
    paramType: 'float64';
    valueTypeDefinition: ValueTypeDefinition;
} & FunctionParameterBase;

export type BooleanFunctionParameter = {
    paramType: 'boolean';
    valueTypeDefinition: ValueTypeDefinition;
} & FunctionParameterBase;

export type ListFunctionParameter = {
    paramType: 'list';
    elementValueTypeDefinition: ValueTypeDefinition;
} & FunctionParameterBase;

export type MapFunctionParameter = {
    paramType: 'map';
    mapValueTypeDefinition: ValueTypeDefinition;
} & FunctionParameterBase;

export type ObjectFunctionParameter = {
    paramType: 'object';
    valueTypeDefinition: ValueTypeDefinition;
} & FunctionParameterBase;

export type FunctionTypeFunctionParameter = {
    paramType: 'function';
    valueTypeDefinition: ValueTypeDefinition;
} & FunctionParameterBase;

export type AnyFunctionParameter = {
    paramType: 'any';
    unionValueTypeDefinitions?: ValueTypeDefinition[];
} & FunctionParameterBase;

export type VariadicFunctionParameter = {
    paramType: 'variadic';
    valueTypeDefinition: ValueTypeDefinition;
    // The valueTypeDefinition field is only used in rendering
    // when single type is true.
    // This is treated as false by default, meaning
    // the variadic parameters can be of any type.
    singleType?: boolean;
    // Named determines whether or not the variadic parameters
    // are named arguments.
    // Named and positional arguments cannot be mixed.
    // If they are named arguments, all arguments do not need to be
    // of the same type.
    named?: boolean;
} & FunctionParameterBase;

export type ScalarFunctionParameter = 
    StringFunctionParameter |
    Int32FunctionParameter |
    Int64FunctionParameter |
    Uint32FunctionParameter |
    Uint64FunctionParameter |
    Float32FunctionParameter |
    Float64FunctionParameter |
    BooleanFunctionParameter;

export type FunctionReturn =
    StringFunctionReturn |
    Int32FunctionReturn |
    Int64FunctionReturn |
    Uint32FunctionReturn |
    Uint64FunctionReturn |
    Float32FunctionReturn |
    Float64FunctionReturn |
    BooleanFunctionReturn |
    ListFunctionReturn |
    MapFunctionReturn |
    ObjectFunctionReturn |
    FunctionTypeFunctionReturn |
    AnyFunctionReturn;

export type FunctionReturnBase = {
    description?: string;
}

export type StringFunctionReturn = {
    returnType: 'string';
    valueTypeDefinition: ValueTypeDefinition;
} & FunctionReturnBase;

export type Int32FunctionReturn = {
    returnType: 'int32';
    valueTypeDefinition: ValueTypeDefinition;
} & FunctionReturnBase;

export type Int64FunctionReturn = {
    returnType: 'int64';
    valueTypeDefinition: ValueTypeDefinition;
} & FunctionReturnBase;

export type Uint32FunctionReturn = {
    returnType: 'uint32';
    valueTypeDefinition: ValueTypeDefinition;
} & FunctionReturnBase;

export type Uint64FunctionReturn = {
    returnType: 'uint64';
    valueTypeDefinition: ValueTypeDefinition;
} & FunctionReturnBase;

export type Float32FunctionReturn = {
    returnType: 'float32';
    valueTypeDefinition: ValueTypeDefinition;
} & FunctionReturnBase;

export type Float64FunctionReturn = {
    returnType: 'float64';
    valueTypeDefinition: ValueTypeDefinition;
} & FunctionReturnBase;

export type BooleanFunctionReturn = {
    returnType: 'boolean';
    valueTypeDefinition: ValueTypeDefinition;
} & FunctionReturnBase;

export type ListFunctionReturn = {
    returnType: 'list';
    elementValueTypeDefinition: ValueTypeDefinition;
} & FunctionReturnBase;

export type MapFunctionReturn = {
    returnType: 'map';
    mapValueTypeDefinition: ValueTypeDefinition;
} & FunctionReturnBase;

export type ObjectFunctionReturn = {
    returnType: 'object';
    valueTypeDefinition: ValueTypeDefinition;
} & FunctionReturnBase;

export type FunctionTypeFunctionReturn = {
    returnType: 'function';
    valueTypeDefinition: ValueTypeDefinition;
} & FunctionReturnBase;

export type AnyFunctionReturn = {
    returnType: 'any';
    unionValueTypeDefinitions?: ValueTypeDefinition[];
} & FunctionReturnBase;

export type ScalarFunctionReturn =
    StringFunctionReturn |
    Int32FunctionReturn |
    Int64FunctionReturn |
    Uint32FunctionReturn |
    Uint64FunctionReturn |
    Float32FunctionReturn |
    Float64FunctionReturn |
    BooleanFunctionReturn;

export type ValueTypeDefinition =
    StringValueTypeDefinition |
    Int32ValueTypeDefinition |
    Int64ValueTypeDefinition |
    Uint32ValueTypeDefinition |
    Uint64ValueTypeDefinition |
    Float32ValueTypeDefinition |
    Float64ValueTypeDefinition |
    BooleanValueTypeDefinition |
    ListValueTypeDefinition |
    MapValueTypeDefinition |
    ObjectValueTypeDefinition |
    FunctionTypeValueTypeDefinition |
    AnyValueTypeDefinition;

export type ValueTypeDefinitionBase = {
    label?: string;
    description?: string;
}

export type StringValueTypeDefinition = {
    type: 'string';
    // enum for string value type definitions.
    stringChoices?: string[];
} & ValueTypeDefinitionBase;

export type Int32ValueTypeDefinition = {
    type: 'int32';
} & ValueTypeDefinitionBase;

export type Int64ValueTypeDefinition = {
    type: 'int64';
} & ValueTypeDefinitionBase;

export type Uint32ValueTypeDefinition = {
    type: 'uint32';
} & ValueTypeDefinitionBase;

export type Uint64ValueTypeDefinition = {
    type: 'uint64';
} & ValueTypeDefinitionBase;

export type Float32ValueTypeDefinition = {
    type: 'float32';
} & ValueTypeDefinitionBase;

export type Float64ValueTypeDefinition = {
    type: 'float64';
} & ValueTypeDefinitionBase;

export type BooleanValueTypeDefinition = {
    type: 'boolean';
} & ValueTypeDefinitionBase;

export type ListValueTypeDefinition = {
    type: 'list';
    elementValueTypeDefinition: ValueTypeDefinition;
} & ValueTypeDefinitionBase;

export type MapValueTypeDefinition = {
    type: 'map';
    mapValueTypeDefinition: ValueTypeDefinition;
} & ValueTypeDefinitionBase;

export type ObjectValueTypeDefinition = {
    type: 'object';
    attributeValueTypeDefinitions: Record<string, ValueTypeDefinition & Nullable>;
} & ValueTypeDefinitionBase;

export type FunctionTypeValueTypeDefinition = {
    type: 'function';
    functionDefinition: FunctionDefinition;
} & ValueTypeDefinitionBase;

export type AnyValueTypeDefinition = {
    type: 'any';
    unionValueTypeDefinitions?: ValueTypeDefinition[];
} & ValueTypeDefinitionBase;

export type Nullable = {
    nullable?: boolean;
}

export type ScalarValueTypeDefinition = 
    StringValueTypeDefinition |
    Int32ValueTypeDefinition |
    Int64ValueTypeDefinition |
    Uint32ValueTypeDefinition |
    Uint64ValueTypeDefinition |
    Float32ValueTypeDefinition |
    Float64ValueTypeDefinition |
    BooleanValueTypeDefinition;
