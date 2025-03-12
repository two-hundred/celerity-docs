import { ResourceSpecSchemaObjectType, ResourceSpecSchemaType } from "./types";


export function extractDataTypeSchemas(
    rootSchema: ResourceSpecSchemaType,
): Record<string, ResourceSpecSchemaObjectType> {
    const dataTypeSchemas: Record<string, ResourceSpecSchemaObjectType> = {};
    extractDataTypeSchemasRecursive(rootSchema, dataTypeSchemas, 1);
    return dataTypeSchemas;
}

function extractDataTypeSchemasRecursive(
    schema: ResourceSpecSchemaType,
    dataTypeSchemas: Record<string, ResourceSpecSchemaObjectType>,
    level: number,
) {
    if (schema.type === 'object') {
        if (level > 1) {
            dataTypeSchemas[schema.label] = schema;
        }
        Object.values(schema.attributes).forEach((attribute) => {
            extractDataTypeSchemasRecursive(attribute, dataTypeSchemas, level + 1);
        });
    } else if (schema.type === 'array') {
        extractDataTypeSchemasRecursive(schema.items, dataTypeSchemas, level + 1);
    } else if (schema.type === 'union') {
        schema.oneOf.forEach((type) => {
            extractDataTypeSchemasRecursive(type, dataTypeSchemas, level + 1);
        });
    } else if (schema.type === 'map') {
        extractDataTypeSchemasRecursive(schema.mapValues, dataTypeSchemas, level + 1);
    }
}
