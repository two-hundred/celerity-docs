import React from 'react';
import ResourceSpecSchemaObject from './ResourceSpecSchemaObject';
import ResourceSpecSchemaScalar from './ResourceSpecSchemaScalar';
import ResourceSpecSchemaDataTypes from './ResourceSpecSchemaDataTypes';
import { ResourceSpecSchemaScalarType, ResourceSpecSchemaType } from '@site/src/utils/types';
import ResourceSpecSchemaUnion from './ResourceSpecSchemaUnion';
import ResourceSpecSchemaArray from './ResourceSpecSchemaArray';
import ResourceSpecSchemaMap from './ResourceSpecSchemaMap';

type Props = {
    schema: ResourceSpecSchemaType;
    schemaPath: string;
    dataTypeSchemas: Record<string, ResourceSpecSchemaType>;
    level: number;
}

function ResourceSpecSchema({ schema, schemaPath, dataTypeSchemas, level }: Readonly<Props>) {
    return <>
        {schema.type === 'object' && (
            <ResourceSpecSchemaObject schema={schema} schemaPath={schemaPath} dataTypeSchemas={dataTypeSchemas} level={level} />
        )}
        {isScalarType(schema) && (
            <ResourceSpecSchemaScalar schema={schema} />
        )}
        {schema.type === 'union' && (
            <ResourceSpecSchemaUnion schema={schema} schemaPath={schemaPath} dataTypeSchemas={dataTypeSchemas} level={level} />
        )}
        {schema.type === 'array' && (
            <ResourceSpecSchemaArray schema={schema} />
        )}
        {schema.type === 'map' && (
            <ResourceSpecSchemaMap schema={schema} />
        )}
    </>
}

export function isScalarType(schema: ResourceSpecSchemaType): schema is ResourceSpecSchemaScalarType {
    return SCALAR_TYPES.includes(schema.type as any);
}

const SCALAR_TYPES = ['string', 'boolean', 'integer', 'float'] as const;

export {
    ResourceSpecSchema,
    ResourceSpecSchemaObject,
    ResourceSpecSchemaScalar,
    ResourceSpecSchemaDataTypes
}
