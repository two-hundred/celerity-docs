import { FunctionDefinition } from "./function-types";

export type CustomFields = {
    customPluginContent: Record<string, CustomPluginContent>;
}

export type CustomPluginContent = {
    title: string
}

// Supported deploy engine plugin protocol versions.
type DeployEngineProtocolVersion = 1;

// The type of a deploy engine plugin.
export type DeployEnginePluginType = 'provider' | 'transformer';

/**
 * The type for the content that represents the documentation
 * of a deploy engine plugin.
 */
export type DeployEnginePluginDocContent = ProviderPluginDocContent | TransformerPluginDocContent;

export type ProviderPluginDocContent = DeployEnginePluginDocContentBase & {
    pluginType: 'provider';
    resources: DeployEnginePluginDocContentResource[];
    links: DeployEnginePluginDocContentLink[];
    dataSources: DeployEnginePluginDocContentDataSource[];
    customVarTypes: DeployEnginePluginDocContentCustomVarType[];
    functions: DeployEnginePluginDocContentFunction[];
};

export type TransformerPluginDocContent = DeployEnginePluginDocContentBase & {
    pluginType: 'transformer';
    transformName: string;
    abstractResources: DeployEnginePluginDocContentResource[];
};

type DeployEnginePluginDocContentBase = {
    id: string;
    displayName: string;
    version: string;
    protocolVersion: DeployEngineProtocolVersion;
    description: string;
    author: string;
    repository: string;
    config: DeployEnginePluginDocContentConfig;
}

export type DeployEnginePluginDocContentResource = {
    type: string;
    label: string;
    summary: string;
    description: string;
    specification: DeployEnginePluginDocContentResourceSpec;
    examples: string[];
    canLinkTo: string[];
};

export type DeployEnginePluginDocContentResourceWithPluginInfo = 
    DeployEnginePluginDocContentResource & { plugin: ProviderPluginDocContent };

export type DeployEnginePluginDocContentResourceSpec = {
    schema: ResourceSpecSchemaType;
    idField: string;
}

export type ResourceSpecSchemaType =
    ResourceSpecSchemaStringType |
    ResourceSpecSchemaIntType |
    ResourceSpecSchemaFloatType |
    ResourceSpecSchemaBooleanType |
    ResourceSpecSchemaObjectType |
    ResourceSpecSchemaMapType |
    ResourceSpecSchemaArrayType |
    ResourceSpecSchemaUnionType;

export type ResourceSpecSchemaStringType = {
    type: 'string';
    default?: string | null;
    examples?: string[];
} & ResourceSpecSchemaBaseType;

export type ResourceSpecSchemaIntType = {
    type: 'integer';
    default?: number | null;
    examples?: number[];
} & ResourceSpecSchemaBaseType;

export type ResourceSpecSchemaFloatType = {
    type: 'float';
    default?: number | null;
    examples?: number[];
} & ResourceSpecSchemaBaseType;

export type ResourceSpecSchemaBooleanType = {
    type: 'boolean';
    default?: boolean | null;
    examples?: boolean[];
} & ResourceSpecSchemaBaseType;

export type ResourceSpecSchemaObjectType = {
    type: 'object';
    attributes: Record<string, ResourceSpecSchemaType>;
    required?: string[];
    default?: Record<string, unknown>;
    examples?: Record<string, unknown>[];
} & ResourceSpecSchemaBaseType;

export type ResourceSpecSchemaMapType = {
    type: 'map';
    mapValues: ResourceSpecSchemaType;
    default?: Record<string, unknown>;
    examples?: Record<string, unknown>[];
} & ResourceSpecSchemaBaseType;

export type ResourceSpecSchemaArrayType = {
    type: 'array';
    items: ResourceSpecSchemaType;
    default?: unknown[];
    examples?: unknown[][];
} & ResourceSpecSchemaBaseType;

export type ResourceSpecSchemaUnionType = {
    type: 'union';
    oneOf: ResourceSpecSchemaType[];
    default?: unknown;
    examples?: unknown[];
} & ResourceSpecSchemaBaseType;

export type ResourceSpecSchemaBaseType = {
    label: string;
    description: string;
    nullable?: boolean;
    computed?: boolean;
    mustRecreate?: boolean;
}

export type ResourceSpecSchemaScalarType =
    ResourceSpecSchemaStringType |
    ResourceSpecSchemaIntType |
    ResourceSpecSchemaFloatType |
    ResourceSpecSchemaBooleanType;

export type DeployEnginePluginDocContentLink = {
    type: string;
    summary: string;
    description: string;
    annotationDefinitions: Record<string, DeployEnginePluginDocContentLinkAnnotation>;
}

export type DeployEnginePluginDocContentLinkAnnotation = {
    name: string;
    label: string;
    type: Scalar;
    description: string;
    default?: Scalar;
    allowedValues?: Scalar[];
    examples?: Scalar[];
    required?: boolean;
}

export type DeployEnginePluginDocContentLinkWithPluginInfo = DeployEnginePluginDocContentLink & {
    plugin: ProviderPluginDocContent;
    resourceTypeA: DeployEnginePluginDocContentResourceWithPluginInfo;
    resourceTypeB: DeployEnginePluginDocContentResourceWithPluginInfo;
}

export type DeployEnginePluginDocContentDataSource ={
    type: string;
    label: string;
    summary: string;
    description: string;
    specification: DataSourceSpec;
    examples?: string[];
}

export type DataSourceSpec = {
    fields: Record<string, DataSourceFieldSpec>;
}

export type DataSourceFieldSpec = {
    type: DataSourceFieldType;
    description: string;
    nullable?: boolean;
    filterable?: boolean;
}

export type DataSourceFieldType = 'string' | 'integer' | 'float' | 'boolean' | 'array';


export type DeployEnginePluginDocContentCustomVarType = {
    type: string;
    label: string;
    summary: string;
    description: string;
    options: Record<string, CustomVarTypeOption>;
    examples?: string[];
}

export type CustomVarTypeOption = {
    label: string;
    description: string;
}

/**
 * The type for the configuration schema of a deploy engine plugin.
 */
export type DeployEnginePluginDocContentConfig = Record<string, DeployEnginePluginDocContentConfigField>;

/**
 * The type for a field in the configuration schema of a deploy engine plugin.
 */
export type DeployEnginePluginDocContentConfigField = {
    type: DeployEnginePluginDocContentConfigFieldType;
    label: string;
    description: string;
    required?: boolean;
    default?: Scalar;
    allowedValues?: Scalar[];
    examples?: Scalar[];
}

export type Scalar = string | number | boolean;

type DeployEnginePluginDocContentConfigFieldType = 'string' | 'integer' | 'float' | 'boolean';

export type DeployEnginePluginDocContentFunction = {
    name: string;
    summary: string;
    description: string;
} & FunctionDefinition;


export type ResourceKind = 'concrete' | 'abstract';
 