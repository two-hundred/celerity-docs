import { PropSidebarItem } from "@docusaurus/plugin-content-docs";
import { TOCItem } from "@docusaurus/mdx-loader";
import {
    CustomVarTypeOption,
    DataSourceSpec,
    DeployEnginePluginDocContent,
    DeployEnginePluginDocContentCustomVarType,
    DeployEnginePluginDocContentDataSource,
    DeployEnginePluginDocContentLinkWithPluginInfo,
    DeployEnginePluginDocContentResource,
    DeployEnginePluginDocContentResourceWithPluginInfo,
    ProviderPluginDocContent,
    ResourceKind,
    ResourceSpecSchemaType,
    TransformerPluginDocContent
} from "./types";
import { DeployEnginePluginResourcesTextContent, DeployEnginePluginTextContent } from "../contexts/deploy-engine";
import { ValueTypeDefinition } from "./function-types";

export const BASE_PATH = '/community/deploy-engine/plugins';

export function toSidebarItems(pluginsContent: DeployEnginePluginDocContent[]): PropSidebarItem[] {
    const providerPluginsContent = pluginsContent.filter((pluginContent) => pluginContent.pluginType === 'provider');
    const transformerPluginsContent = pluginsContent.filter((pluginContent) => pluginContent.pluginType === 'transformer');

    return [
        {
            type: 'category',
            label: 'Deploy Engine Plugins',
            collapsed: false,
            collapsible: false,
            items: [
                {
                    type: 'category',
                    label: 'Providers',
                    collapsed: false,
                    collapsible: false,
                    items: toPluginSidebarItems(providerPluginsContent)
                },
                {
                    type: 'category',
                    label: 'Transformers',
                    collapsed: false,
                    collapsible: false,
                    items: toPluginSidebarItems(transformerPluginsContent)
                }
            ]
        }
    ]
}

function toPluginSidebarItems(pluginsContent: DeployEnginePluginDocContent[]): PropSidebarItem[] {
    return pluginsContent.map((pluginContent) => {
        return {
            type: 'category',
            label: pluginContent.displayName,
            collapsed: true,
            collapsible: true,
            items: [
                {
                    type: 'link',
                    label: 'Overview & Configuration',
                    href: toSlug(pluginContent.id, pluginContent.pluginType, pluginContent.version)
                },
            ]
        }
    })
}

export function toCurrentPluginSidebarItems(
    textContent: DeployEnginePluginTextContent,
    pluginContent: DeployEnginePluginDocContent,
    globalLinkMap: Record<string, DeployEnginePluginDocContentLinkWithPluginInfo>,
): PropSidebarItem[] {
    if (pluginContent.pluginType === 'provider') {
        return [
            {
                type: 'category',
                label: 'Resources',
                collapsed: false,
                collapsible: true,
                items: toPluginResourceSidebarItems(pluginContent)
            },
            {
                type: 'category',
                label: 'Links',
                collapsed: false,
                collapsible: true,
                items: toPluginLinkSidebarItems(textContent, pluginContent, globalLinkMap)
            },
            {
                type: 'category',
                label: 'Data Sources',
                collapsed: false,
                collapsible: true,
                items: toPluginDataSourceSidebarItems(pluginContent)
            },
            {
                type: 'category',
                label: 'Custom Variable Types',
                collapsed: false,
                collapsible: true,
                items: toPluginCustomVarTypeSidebarItems(pluginContent)
            },
            {
                type: 'category',
                label: 'Functions',
                collapsed: false,
                collapsible: true,
                items: toPluginFunctionSidebarItems(pluginContent)
            }
        ]
    }

    return [
        {
            type: 'category',
            label: 'Abstract Resources',
            collapsed: false,
            collapsible: true,
            items: toPluginAbstractResourceSidebarItems(pluginContent)
        }
    ]
}

function toPluginResourceSidebarItems(
    pluginContent: ProviderPluginDocContent,
): PropSidebarItem[] {
    return pluginContent.resources.map((resource) => {
        return {
            type: 'link',
            label: resource.label,
            href: pluginResourceTypePath(pluginContent, resource.type)
        }
    })
}

function toPluginAbstractResourceSidebarItems(
    pluginContent: TransformerPluginDocContent,
): PropSidebarItem[] {
    return pluginContent.abstractResources.map((resource) => {
        return {
            type: 'link',
            label: resource.label,
            href: pluginAbstractResourceTypePath(pluginContent, resource.type)
        }
    })
}

function toPluginLinkSidebarItems(
    textContent: DeployEnginePluginTextContent,
    pluginContent: ProviderPluginDocContent,
    globalLinkMap: Record<string, DeployEnginePluginDocContentLinkWithPluginInfo>,
): PropSidebarItem[] {
    return pluginContent.links.map((link) => {
        const linkWithPluginInfo = globalLinkMap[link.type];
        return {
            type: 'link',
            label: textContent.resources.pluginResourceTypeLinkLabel(
                linkWithPluginInfo.resourceTypeA,
                linkWithPluginInfo.resourceTypeB,
            ),
            href: pluginLinkPath(pluginContent, link.type)
        }
    })
}

function toPluginDataSourceSidebarItems(
    pluginContent: ProviderPluginDocContent,
): PropSidebarItem[] {
    return pluginContent.dataSources.map((dataSource) => {
        return {
            type: 'link',
            label: dataSource.label,
            href: pluginDataSourcePath(pluginContent, dataSource.type)
        }
    })
}

function toPluginCustomVarTypeSidebarItems(
    pluginContent: ProviderPluginDocContent,
): PropSidebarItem[] {
    return pluginContent.customVarTypes.map((customVarType) => {
        return {
            type: 'link',
            label: customVarType.label,
            href: pluginCustomVarTypePath(pluginContent, customVarType.type)
        }
    })
}

function toPluginFunctionSidebarItems(
    pluginContent: ProviderPluginDocContent,
): PropSidebarItem[] {
    return pluginContent.functions.map((func) => {
        return {
            type: 'link',
            label: func.name,
            href: pluginFunctionPath(pluginContent, func.name)
        }
    })
}

export function pluginDocPageToC(
    textContent: DeployEnginePluginTextContent,
    pluginContent: DeployEnginePluginDocContent,
    globalLinkMap: Record<string, DeployEnginePluginDocContentLinkWithPluginInfo>,
): TOCItem[] {
    const configFieldItems = Object.entries(pluginContent.config).map(
        ([fieldName, schema]) => {
            return {
                id: pluginConfigFieldId(fieldName),
                value: schema.label,
                level: 3,
            }
        }
    )

    return [
        {
            id: 'plugin-configuration',
            value: textContent.pluginConfigTitle,
            level: 2,
        },
        ...configFieldItems,
        ...providerPluginResourcesToC(textContent, pluginContent),
        ...providerPluginLinksToC(textContent, pluginContent, globalLinkMap),
        ...providerPluginDataSourcesToC(textContent, pluginContent),
        ...providerPluginCustomVarTypesToC(textContent, pluginContent),
        ...providerPluginFunctionsToC(textContent, pluginContent),
    ]
}

export function providerPluginResourcesToC(
    textContent: DeployEnginePluginTextContent,
    pluginContent: DeployEnginePluginDocContent
): TOCItem[] {
    const resources = pluginContent.pluginType === 'provider' ?
        pluginContent.resources :
        pluginContent.abstractResources;

    const pluginTitleId = pluginContent.pluginType === 'provider' ? 'plugin-resources' : 'plugin-abstract-resources';

    const resourcesTextContent = pluginContent.pluginType === 'provider' ?
        textContent.resources :
        textContent.abstractResources;

    const createElementId = pluginContent.pluginType === 'provider' ?
        pluginResourceTypeElementId :
        pluginAbstractResourceTypeElementId;

    if (resources.length === 0) {
        return [];
    }

    const resourceTypeItems = resources.map((resource) => {
        return {
            id: createElementId(resource.type),
            value: resource.label,
            level: 3,
        }
    })

    return [
        {
            id: pluginTitleId,
            value: resourcesTextContent.pluginResourcesTitle,
            level: 2,
        },
        ...resourceTypeItems,
    ]
}

export function providerPluginLinksToC(
    textContent: DeployEnginePluginTextContent,
    pluginContent: DeployEnginePluginDocContent,
    globalLinkMap: Record<string, DeployEnginePluginDocContentLinkWithPluginInfo>,
): TOCItem[] {
    if (pluginContent.pluginType === 'provider') {
        const linkItems = pluginContent.links.map((link) => {
            const linkWithResourceInfo = globalLinkMap[link.type];
            return {
                id: pluginLinkTypeElementId(link.type),
                value: textContent.resources.pluginResourceTypeLinkLabel(
                    linkWithResourceInfo.resourceTypeA,
                    linkWithResourceInfo.resourceTypeB,
                ),
                level: 3,
            }
        })

        return [
            {
                id: 'plugin-links',
                value: textContent.links.pluginLinksTitle,
                level: 2,
            },
            ...linkItems,
        ]
    }

    return []
}

export function providerPluginDataSourcesToC(
    textContent: DeployEnginePluginTextContent,
    pluginContent: DeployEnginePluginDocContent
): TOCItem[] {
    if (pluginContent.pluginType === 'provider') {
        const dataSourceTypeItems = pluginContent.dataSources.map((dataSource) => {
            return {
                id: pluginDataSourceTypeElementId(dataSource.type),
                value: dataSource.label,
                level: 3,
            }
        })

        return [
            {
                id: 'plugin-datasources',
                value: textContent.dataSources.pluginDataSourcesTitle,
                level: 2,
            },
            ...dataSourceTypeItems,
        ]
    }

    return []
}

export function providerPluginCustomVarTypesToC(
    textContent: DeployEnginePluginTextContent,
    pluginContent: DeployEnginePluginDocContent
): TOCItem[] {
    if (pluginContent.pluginType === 'provider') {
        const customVarTypeItems = pluginContent.customVarTypes.map((customVarType) => {
            return {
                id: pluginCustomVarTypeElementId(customVarType.type),
                value: customVarType.label,
                level: 3,
            }
        })

        return [
            {
                id: 'plugin-custom-var-types',
                value: textContent.customVarTypes.pluginCustomVarTypesTitle,
                level: 2,
            },
            ...customVarTypeItems,
        ]
    }

    return []
}

export function providerPluginFunctionsToC(
    textContent: DeployEnginePluginTextContent,
    pluginContent: DeployEnginePluginDocContent
): TOCItem[] {
    if (pluginContent.pluginType === 'provider') {
        const functionItems = pluginContent.functions.map((func) => {
            return {
                id: pluginFunctionElementId(func.name),
                value: func.name,
                level: 3,
            }
        })

        return [
            {
                id: 'plugin-functions',
                value: textContent.functions.pluginFunctionsTitle,
                level: 2,
            },
            ...functionItems,
        ]
    }

    return []
}

export function pluginDocResourcePageToC(
    textContent: DeployEnginePluginTextContent,
    resource: DeployEnginePluginDocContentResource,
    dataTypeSchemas: Record<string, ResourceSpecSchemaType>,
    globalLinkMap: Record<string, DeployEnginePluginDocContentLinkWithPluginInfo>,
    globalResourceMap: Record<string, DeployEnginePluginDocContentResourceWithPluginInfo>,
    kind: ResourceKind,
): TOCItem[] {
    const resourcesTextContent = kind === 'abstract' ? textContent.abstractResources : textContent.resources;
    return [
        {
            id: resourceSpecTitleId(),
            value: resourcesTextContent.pluginResourceSpecTitle,
            level: 2,
        },
        ...resourceSpecToCItems(resource.specification.schema, "root", 3),
        ...dataTypeToCItems(dataTypeSchemas, 3, resourcesTextContent),
        {
            id: resourceSpecIdFieldTitleId(),
            value: resourcesTextContent.pluginResourceIdFieldTitle,
            level: 2
        },
        {
            id: resourceExamplesTitleId(),
            value: resourcesTextContent.pluginResourceExamplesTitle,
            level: 2
        },
        ...resourceTypeLinksToCItems(textContent, resource, globalLinkMap, globalResourceMap, kind),
    ]
}

function resourceSpecTitleId(): string {
    return 'plugin-resource-spec';
}

function resourceDataTypesTitleId(): string {
    return 'plugin-data-types';
}

function resourceSpecIdFieldTitleId(): string {
    return 'plugin-resource-spec-id-field';
}

function resourceExamplesTitleId(): string {
    return 'plugin-resource-examples';
}

function resourceTypeLinksToCItems(
    textContent: DeployEnginePluginTextContent,
    resource: DeployEnginePluginDocContentResource,
    globalLinkMap: Record<string, DeployEnginePluginDocContentLinkWithPluginInfo>,
    globalResourceMap: Record<string, DeployEnginePluginDocContentResourceWithPluginInfo>,
    kind: ResourceKind,
): TOCItem[] {
    const validLinks = resource.canLinkTo?.filter(
        (linkTo) => (kind === 'concrete' && !!globalLinkMap[createLinkId(resource.type, linkTo)]) ||
            (kind === 'abstract' && !!globalResourceMap[linkTo])
    );

    if (validLinks?.length > 0) {
        return [
            {
                id: 'plugin-resource-links-to',
                value: textContent.resources.pluginResourceLinksToTitle,
                level: 2,
            },
            ...validLinks.map((linkTo) => {
                const linkId = createLinkId(resource.type, linkTo);
                const link = globalLinkMap[linkId];
                return {
                    id: pluginLinkToResourceTypeElementId(linkTo),
                    value: link?.resourceTypeB?.label ?? globalResourceMap[linkTo]?.label,
                    level: 3,
                }
            })
        ]
    }

    return []
}

function resourceSpecToCItems(
    schema: ResourceSpecSchemaType,
    schemaPath: string,
    level: number,
): TOCItem[] {
    const items: TOCItem[] = [];

    if (schema.type === 'object') {
        Object.entries(schema.attributes).forEach(([attrName, attribute]) => {
            items.push({
                id: pluginSchemaElementId(schemaPath, attrName),
                value: attrName,
                level,
            })
        });
    }

    return items;
}

function dataTypeToCItems(
    dataTypeSchemas: Record<string, ResourceSpecSchemaType>,
    level: number,
    resourcesTextContent: DeployEnginePluginResourcesTextContent,
): TOCItem[] {
    if (Object.keys(dataTypeSchemas).length === 0) {
        return [];
    }

    const dataTypesTitleItem = {
        id: resourceDataTypesTitleId(),
        value: resourcesTextContent.pluginResourceSpecDataTypesTitle,
        level: 2,
    };

    const dataTypeItems = Object.entries(dataTypeSchemas).map(([dataType, _]) => {
        return {
            id: pluginDataTypeElementId(dataType),
            value: dataType,
            level,
        }
    });

    return [dataTypesTitleItem, ...dataTypeItems];
}

export function pluginDocLinkPageToC(
    textContent: DeployEnginePluginTextContent,
    link: DeployEnginePluginDocContentLinkWithPluginInfo,
): TOCItem[] {
    return [
        {
            id: 'plugin-link-annotations',
            value: textContent.links.pluginLinkAnnotationsTitle,
            level: 2,
        },
        ...linkAnnotationsToCItems(link)
    ]
}

function linkAnnotationsToCItems(
    link: DeployEnginePluginDocContentLinkWithPluginInfo,
): TOCItem[] {
    return Object.keys(link.annotationDefinitions).map((annotationName) => {
        const [resourceType, annotationFieldName] = splitAnnotationName(annotationName);
        const resourceTypeLabel = link.resourceTypeA.type === resourceType
            ? link.resourceTypeA.label
            : link.resourceTypeB.label;
        return {
            id: pluginLinkAnnotationElementId(annotationName),
            value: `${resourceTypeLabel} → ${annotationFieldName}`,
            level: 3,
        }
    });
}

export function pluginDocDataSourcePageToC(
    textContent: DeployEnginePluginTextContent,
    dataSource: DeployEnginePluginDocContentDataSource,
): TOCItem[] {
    return [
        {
            id: 'plugin-datasource-fields',
            value: textContent.dataSources.pluginDataSourceFieldsTitle,
            level: 2,
        },
        ...dataSourceSpecToCItems(dataSource.specification),
        {
            id: 'plugin-datasource-examples',
            value: textContent.dataSources.pluginDataSourceExamplesTitle,
            level: 2
        },
    ]
}

function dataSourceSpecToCItems(spec: DataSourceSpec): TOCItem[] {
    return Object.keys(spec.fields).map((fieldName) => {
        return {
            id: pluginDataSourceSpecFieldElementId(fieldName),
            value: fieldName,
            level: 3,
        }
    })
}

export function pluginDocCustomVarTypePageToC(
    textContent: DeployEnginePluginTextContent,
    customVarType: DeployEnginePluginDocContentCustomVarType,
): TOCItem[] {
    return [
        {
            id: 'plugin-custom-var-type-options',
            value: textContent.customVarTypes.pluginCustomVarTypeOptionsTitle,
            level: 2,
        },
        ...customVarTypeOptionsToCItems(customVarType.options),
        {
            id: 'plugin-custom-var-type-examples',
            value: textContent.customVarTypes.pluginCustomVarTypeExamplesTitle,
            level: 2
        },
    ]
}

function customVarTypeOptionsToCItems(options: Record<string, CustomVarTypeOption>): TOCItem[] {
    return Object.entries(options).map(([name, option]) => {
        return {
            id: pluginCustomVarTypeOptionElementId(name),
            value: option.label,
            level: 3,
        }
    })
}

export function pluginDocFunctionPageToC(
    textContent: DeployEnginePluginTextContent,
    funcTypeDefs: Record<string, ValueTypeDefinition>,
): TOCItem[] {
    return [
        {
            id: 'plugin-function-definition',
            value: textContent.functions.pluginFunctionDefinitionTitle,
            level: 2,
        },
        {
            id: 'plugin-function-parameters',
            value: textContent.functions.pluginFunctionParametersTitle,
            level: 3,
        },
        {
            id: 'plugin-function-return-type',
            value: textContent.functions.pluginFunctionReturnTypeTitle,
            level: 3,
        },
        ...functionTypeToCItems(funcTypeDefs, textContent, 3),
    ]
}

function functionTypeToCItems(
    funcTypeDefs: Record<string, ValueTypeDefinition>,
    textContent: DeployEnginePluginTextContent,
    level: number,
): TOCItem[] {
    if (Object.keys(funcTypeDefs).length === 0) {
        return [];
    }

    const typesSectionItem = {
        id: 'plugin-function-value-types',
        value: textContent.functions.pluginFunctionTypesTitle,
        level: 2,
    };

    const typeItems = Object.entries(funcTypeDefs).map(([typeLabel, _]) => {
        return {
            id: pluginFunctionValueTypeElementId(typeLabel),
            value: typeLabel,
            level,
        }
    });

    return [typesSectionItem, ...typeItems];
}

function splitAnnotationName(annotationName: string): [string, string] {
    return annotationName.split('::') as [string, string];
}

export function pluginLinkAnnotationElementId(annotationName: string): string {
    return `plugin-link-annotation-${normaliseForElementId(annotationName)}`;
}

export function pluginDataSourceSpecFieldElementId(fieldName: string): string {
    return `plugin-datasource-field-${normaliseForElementId(fieldName)}`;
}

export function pluginCustomVarTypeOptionElementId(optionName: string): string {
    return `plugin-custom-var-type-option-${normaliseForElementId(optionName)}`;
}

export function extractAllResourcesToMap(
    content: DeployEnginePluginDocContent[],
): Record<string, DeployEnginePluginDocContentResourceWithPluginInfo> {
    return content.reduce((acc, pluginContent) => {
        if (isProviderPlugin(pluginContent)) {
            pluginContent.resources.forEach((resource) => {
                acc[resource.type] = {
                    ...resource,
                    plugin: pluginContent,
                };
            });
        }

        if (isTransformerPlugin(pluginContent)) {
            pluginContent.abstractResources.forEach((resource) => {
                acc[resource.type] = {
                    ...resource,
                    plugin: pluginContent,
                };
            });
        }

        return acc;
    }, {});
}

export function extractAllLinksToMap(
    content: DeployEnginePluginDocContent[],
    globalResourceMap: Record<string, DeployEnginePluginDocContentResourceWithPluginInfo>,
): Record<string, DeployEnginePluginDocContentLinkWithPluginInfo> {
    return content.reduce((acc, pluginContent) => {
        const links = extractLinks(pluginContent, globalResourceMap);
        return { ...acc, ...links };
    }, {});
}

function extractLinks(
    pluginContent: DeployEnginePluginDocContent,
    globalResourceMap: Record<string, DeployEnginePluginDocContentResourceWithPluginInfo>,
): Record<string, DeployEnginePluginDocContentLinkWithPluginInfo> {
    const links: Record<string, DeployEnginePluginDocContentLinkWithPluginInfo> = {};

    if (isProviderPlugin(pluginContent)) {
        pluginContent.links.forEach((link) => {
            const [resourceTypeA, resourceTypeB] = expandLinkResourceTypes(link.type);
            links[link.type] = {
                ...link,
                plugin: pluginContent,
                resourceTypeA: globalResourceMap[resourceTypeA],
                resourceTypeB: globalResourceMap[resourceTypeB],
            };
        });
    }

    return links;
}

function expandLinkResourceTypes(
    linkType: string,
): [string, string] {
    return linkType.split('::') as [string, string];
}


export function toSlug(id: string, pluginType: string, version: string): string {
    return `${BASE_PATH}/${pluralise(pluginType)}/${id}/${version}`
}

export function pluginResourceTypePath(plugin: DeployEnginePluginDocContent, resourceType: string): string {
    return `${toSlug(plugin.id, plugin.pluginType, plugin.version)}/resources/${pluginResourceTypeId(resourceType)}`
}

export function pluginLinkPath(plugin: DeployEnginePluginDocContent | undefined, linkId: string): string {
    if (!plugin) {
        return '';
    }

    return `${toSlug(plugin.id, plugin.pluginType, plugin.version)}/links/${normaliseForElementId(linkId)}`
}

export function pluginDataSourcePath(
    plugin: DeployEnginePluginDocContent,
    dataSourceType: string,
): string {
    return `${toSlug(plugin.id, plugin.pluginType, plugin.version)}/data-sources/${normaliseForElementId(dataSourceType)}`
}

export function pluginCustomVarTypePath(
    plugin: DeployEnginePluginDocContent,
    customVarType: string,
): string {
    return `${toSlug(plugin.id, plugin.pluginType, plugin.version)}/custom-var-types/${normaliseForElementId(customVarType)}`
}

export function pluginFunctionPath(
    plugin: DeployEnginePluginDocContent,
    functionName: string,
): string {
    return `${toSlug(plugin.id, plugin.pluginType, plugin.version)}/functions/${normaliseForElementId(functionName)}`
}

export function pluginAbstractResourceTypePath(
    plugin: DeployEnginePluginDocContent,
    resourceType: string,
): string {
    return `${toSlug(plugin.id, plugin.pluginType, plugin.version)}/abstract-resources/${pluginResourceTypeId(resourceType)}`
}

export function pluralise(pluginType: string): string {
    return `${pluginType}s`
}

export function toUpperFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function pluginConfigFieldId(fieldName: string): string {
    return `plugin-config-field-${fieldName.toLowerCase()}`;
}

export function pluginResourceTypeElementId(resourceType: string): string {
    return `plugin-resource-type-${normaliseForElementId(resourceType)}`;
}

export function pluginAbstractResourceTypeElementId(resourceType: string): string {
    return `plugin-abstract-resource-type-${normaliseForElementId(resourceType)}`;
}

export function pluginLinkTypeElementId(linkType: string): string {
    return `plugin-link-type-${normaliseForElementId(linkType)}`;
}

export function pluginLinkToResourceTypeElementId(linkToType: string): string {
    return `plugin-link-to-resource-type-${normaliseForElementId(linkToType)}`;
}

export function pluginDataSourceTypeElementId(dataSourceType: string): string {
    return `plugin-data-source-${normaliseForElementId(dataSourceType)}`;
}

export function pluginCustomVarTypeElementId(customVarType: string): string {
    return `plugin-custom-var-type-${normaliseForElementId(customVarType)}`;
}

export function pluginFunctionElementId(functionName: string): string {
    return `plugin-function-${normaliseForElementId(functionName)}`;
}

export function pluginResourceTypeId(resourceType: string): string {
    return normaliseForElementId(resourceType);
}

export function pluginSchemaElementId(schemaPath: string, elementName: string): string {
    return `plugin-schema-element-${schemaPathElementId(schemaPath)}-${elementName.toLowerCase()}`;
}

export function pluginDataTypeElementId(dataType: string): string {
    return `plugin-data-type-${normaliseForElementId(dataType)}`;
}

export function pluginFunctionValueTypeElementId(valueType: string): string {
    return `plugin-function-value-type-${normaliseForElementId(valueType)}`;
}

export function schemaPathElementId(schemaPath: string): string {
    return normaliseForElementId(schemaPath);
}

export function normaliseForElementId(input: string): string {
    return input.replace(/[/\s:_]/g, '-').toLowerCase();
}

export function createLinkId(resourceTypeA: string, resourceTypeB: string): string {
    return `${resourceTypeA}::${resourceTypeB}`;
}

function isProviderPlugin(pluginContent: DeployEnginePluginDocContent): pluginContent is ProviderPluginDocContent {
    return pluginContent.pluginType === 'provider';
}

function isTransformerPlugin(pluginContent: DeployEnginePluginDocContent): pluginContent is TransformerPluginDocContent {
    return pluginContent.pluginType === 'transformer';
}
