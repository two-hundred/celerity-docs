import { createContext } from 'react';
import {
    DeployEnginePluginDocContent,
    DeployEnginePluginDocContentCustomVarType,
    DeployEnginePluginDocContentDataSource,
    DeployEnginePluginDocContentLinkWithPluginInfo,
    DeployEnginePluginDocContentResource,
    ProviderPluginDocContent,
} from '../utils/types';


export type DeployEnginePluginTextContent = {
    pluginConfigTitle: string;
    pageMetaTitle: (pluginContent: DeployEnginePluginDocContent) => string;
    pluginConfigTitleAriaLabel: string;
    repositoryLabel: string;
    pluginConfigFieldAriaLabel: (fieldLabel: string) => string;
    requiredText: string;
    optionalText: string;
    pluginFieldTypeLabel: string;
    pluginFieldAllowedValuesLabel: string;
    pluginFieldDefaultValueLabel: string;
    pluginFieldExamplesLabel: string;
    pluginConfigEmptyFieldsText: string;
    pluginTransformNameText: string;
    pluginVersionText: string;
    yesText: string;
    noText: string;
    pluginFieldNullValueLabel: string;
    computedText: string;
    resources: DeployEnginePluginResourcesTextContent;
    abstractResources: DeployEnginePluginResourcesTextContent;
    links: DeployEnginePluginLinksTextContent;
    dataSources: DeployEnginePluginDataSourcesTextContent;
    customVarTypes: DeployEnginePluginCustomVarTypesTextContent;
    functions: DeployEnginePluginFunctionsTextContent;
}

export type DeployEnginePluginResourcesTextContent = {
    pageMetaTitle: (
        pluginContent: ProviderPluginDocContent,
        resourceType: DeployEnginePluginDocContentResource,
    ) => string;
    pluginResourceTypeAriaLabel: (resourceLabel: string) => string;
    pluginResourceSpecTitle: string;
    pluginResourceSpecTitleAriaLabel: (resourceLabel: string) => string;
    pluginResourceSpecHelpText: string;
    pluginResourceSpecDataTypesTitle: string;
    pluginResourceSpecDataTypesTitleAriaLabel: (resourceLabel: string) => string;
    pluginResourceIdFieldTitle: string;
    pluginResourceIdFieldTitleAriaLabel: string;
    pluginResourceIdFieldDescription: string;
    pluginResourceIdFieldText: (idField: string, idFieldElementId: string) => string;
    pluginResourceExamplesTitle: string;
    pluginResourceExamplesTitleAriaLabel: string;
    pluginResourceLinksToTitle: string;
    pluginResourceLinksToTitleAriaLabel: string;
    pluginResourceLinksToDescription: string;
    pluginResourceTypeLinkLabel: (
        fromResourceType: DeployEnginePluginDocContentResource,
        toResourceType: DeployEnginePluginDocContentResource,
    ) => string;
    pluginResourceTypeGoToLinkAriaLabel: (
        fromResourceType: DeployEnginePluginDocContentResource,
        toResourceType: DeployEnginePluginDocContentResource,
    ) => string;
    pluginResourcesTitle: string;
    pluginResourcesTitleAriaLabel: string;
    pluginNoResourcesText: string;
    pluginResourceSpecDataTypeArialLabel: (dataType: string) => string;
}

export type DeployEnginePluginLinksTextContent = {
    pageMetaTitle: (
        pluginContent: ProviderPluginDocContent,
        link: DeployEnginePluginDocContentLinkWithPluginInfo,
    ) => string;
    pluginLinksTitle: string;
    pluginLinksTitleAriaLabel: string;
    pluginLinkTypeAriaLabel: (linkLabel: string) => string;
    pluginNoLinksText: string;
    pluginLinkAnnotationsTitle: string;
    pluginNoLinkAnnotationsText: string;
    pluginLinkAnnotationAriaLabel: (annotationName: string) => string;
    pluginLinkAnnotationForResourcePrefix: string;
}

export type DeployEnginePluginDataSourcesTextContent = {
    pageMetaTitle: (
        pluginContent: ProviderPluginDocContent,
        dataSourceType: DeployEnginePluginDocContentDataSource,
    ) => string;
    pluginDataSourceSpecTitle: string;
    pluginDataSourceExamplesTitle: string;
    pluginDataSourceExamplesTitleAriaLabel: string;
    pluginDataSourceFieldsTitle: string;
    pluginDataSourceFieldsTitleAriaLabel: string;
    pluginNoDataSourceFieldsText: string;
    pluginDataSourceFieldAriaLabel: (fieldName: string) => string;
    dataSourceFieldFilterableText: string;
    pluginDataSourceTypeAriaLabel: (dataSourceLabel: string) => string;
    pluginDataSourcesTitle: string;
    pluginDataSourcesTitleAriaLabel: string;
    pluginNoDataSourcesText: string;
    pluginDataSourceFieldsHelpText: string;
}

export type DeployEnginePluginCustomVarTypesTextContent = {
    pageMetaTitle: (
        pluginContent: ProviderPluginDocContent,
        customVarType: DeployEnginePluginDocContentCustomVarType,
    ) => string;
    pluginCustomVarTypeOptionsTitle: string;
    pluginCustomVarTypeOptionAriaLabel: (optionLabel: string) => string;
    pluginCustomVarTypeOptionsHelpText: string;
    pluginNoCustomVarTypeOptionsText: string;
    pluginCustomVarTypeAriaLabel: (customVarTypeLabel: string) => string;
    pluginCustomVarTypesTitle: string;
    pluginCustomVarTypesTitleAriaLabel: string;
    pluginNoCustomVarTypesText: string;
    pluginCustomVarTypeExamplesTitle: string;
    pluginCustomVarTypeExamplesTitleAriaLabel: string;
}

export type DeployEnginePluginFunctionsTextContent = {
    pluginFunctionAriaLabel: (functionName: string) => string;
    pluginFunctionsTitle: string;
    pluginFunctionsTitleAriaLabel: string;
    pluginNoFunctionsText: string;
    pluginFunctionDefinitionTitle: string;
    pluginFunctionDefinitionTitleAriaLabel: (functionName: string) => string;
    pluginFunctionTypesTitle: string;
    pluginFunctionTypesTitleAriaLabel: (functionName: string) => string;
    pluginFunctionParametersTitle: string;
    pluginFunctionParametersTitleAriaLabel: (functionName: string) => string;
    pluginFunctionReturnTypeTitle: string;
    pluginFunctionReturnTypeTitleAriaLabel: (functionName: string) => string;
    pluginParamTypeLabel: string;
    pluginReturnTypeLabel: string;
    pluginFunctionTypeArialLabel: (functionName: string) => string;
    pluginNoParametersText: string;
    pageMetaTitle: (pluginContent: ProviderPluginDocContent, functionName: string) => string;
}

export function textContent(): DeployEnginePluginTextContent {
    return {
        pluginConfigTitle: "Configuration",
        pageMetaTitle: (pluginContent: DeployEnginePluginDocContent) => {
            return `${pluginContent.displayName} ${pluginContent.pluginType === 'provider' ? '| Providers' : ' | Transformers'}`;
        },
        pluginConfigTitleAriaLabel: "Direct link to plugin configuration section",
        repositoryLabel: "Repository",
        pluginConfigFieldAriaLabel: (fieldLabel: string) => `Direct link to the "${fieldLabel}" plugin configuration field`,
        requiredText: "required",
        optionalText: "optional",
        pluginFieldTypeLabel: 'field type',
        pluginFieldAllowedValuesLabel: 'allowed values',
        pluginFieldDefaultValueLabel: 'default value',
        pluginFieldExamplesLabel: 'examples',
        pluginConfigEmptyFieldsText: 'There are no configuration fields for this plugin.',
        pluginTransformNameText: 'Transform',
        pluginVersionText: 'Version',
        pluginFieldNullValueLabel: 'null value allowed',
        yesText: 'yes',
        noText: 'no',
        computedText: 'computed',
        resources: resourcesTextContent(),
        abstractResources: abstractResourcesTextContent(),
        links: linksTextContent(),
        dataSources: dataSourcesTextContent(),
        customVarTypes: customVarTypesTextContent(),
        functions: functionsTextContent(),
    }
}

function resourcesTextContent(): DeployEnginePluginResourcesTextContent {
    return {
        pageMetaTitle: (pluginContent: ProviderPluginDocContent, resourceType: DeployEnginePluginDocContentResource) =>
            `${resourceType.label} | Resources | ${pluginContent.displayName} Provider`,
        pluginResourceTypeAriaLabel: (resourceLabel: string) => `Direct link to the "${resourceLabel}" plugin resource type`,
        pluginResourceSpecTitle: 'Specification',
        pluginResourceSpecTitleAriaLabel: (resourceLabel: string) => `Direct link to the "${resourceLabel}" plugin resource type specification`,
        pluginResourceSpecHelpText: 'The following section is a detailed specification for the contents of the **_spec_** field in a resource defined in a blueprint' +
            ' with this resource type. This includes fields that can be defined in the blueprint along with output data that is produced as a result of deploying the resource,' +
            ' outputs are fields in the specification that are marked as **_computed_**.',
        pluginResourceSpecDataTypesTitle: 'Data Types',
        pluginResourceSpecDataTypesTitleAriaLabel: (resourceLabel: string) => `Direct link to the data types for the "${resourceLabel}" plugin resource type`,
        pluginResourceIdFieldTitle: 'ID Field',
        pluginResourceIdFieldTitleAriaLabel: 'Direct link to the plugin resource ID field',
        pluginResourceIdFieldDescription: 'The field in the resource spec that ' +
            'uniquely identifies the resource in the upstream provider (e.g. an `arn` in AWS).',
        pluginResourceIdFieldText: (idField: string, idFieldElementId: string) => `**[\`${idField}\`](#${idFieldElementId})** is the ID field for this resource.`,
        pluginResourceExamplesTitle: 'Examples',
        pluginResourceExamplesTitleAriaLabel: 'Direct link to the plugin resource examples section',
        pluginResourceLinksToTitle: 'Links To',
        pluginResourceLinksToTitleAriaLabel: 'Direct link to the plugin resource links to section',
        pluginResourceLinksToDescription: 'The following section lists the resource types that a resource of this type can link to in a blueprint.',
        pluginResourceTypeLinkLabel: (
            fromResourceType: DeployEnginePluginDocContentResource,
            toResourceType: DeployEnginePluginDocContentResource,
        ) => {
            return `${fromResourceType.label} 🔗 ${toResourceType.label}`;
        },
        pluginResourceTypeGoToLinkAriaLabel: (
            fromResourceType: DeployEnginePluginDocContentResource,
            toResourceType: DeployEnginePluginDocContentResource,
        ) => {
            return `Go to the ${fromResourceType.label} to ${toResourceType.label} link`;
        },
        pluginResourcesTitle: 'Resources',
        pluginResourcesTitleAriaLabel: 'Direct link to plugin resources overview section',
        pluginNoResourcesText: 'There are no resources for this plugin.',
        pluginResourceSpecDataTypeArialLabel: (dataType: string) => `Direct link to the "${dataType}" data type`,
    }
}

function abstractResourcesTextContent(): DeployEnginePluginResourcesTextContent {
    return {
        pageMetaTitle: (pluginContent: ProviderPluginDocContent, resourceType: DeployEnginePluginDocContentResource) =>
            `${resourceType.label} | Abstract Resources | ${pluginContent.displayName} Transformer`,
        pluginResourceTypeAriaLabel: (resourceLabel: string) => `Direct link to the "${resourceLabel}" plugin abstract resource type`,
        pluginResourceSpecTitle: 'Specification',
        pluginResourceSpecTitleAriaLabel: (resourceLabel: string) => `Direct link to the "${resourceLabel}" plugin abstract resource type specification`,
        pluginResourceSpecHelpText: 'The following section is a detailed specification for the contents of the **_spec_** field in a resource defined in a blueprint' +
            ' with this abstract resource type. This includes fields that can be defined in the blueprint along with output data that is produced as a result of deploying the underlying concrete resources,' +
            ' outputs are fields in the specification that are marked as **_computed_**.',
        pluginResourceSpecDataTypesTitle: 'Data Types',
        pluginResourceSpecDataTypesTitleAriaLabel: (resourceLabel: string) => `Direct link to the data types for the "${resourceLabel}" plugin abstract resource type`,
        pluginResourceIdFieldTitle: 'ID Field',
        pluginResourceIdFieldTitleAriaLabel: 'Direct link to the plugin resource ID field',
        pluginResourceIdFieldDescription: 'The field in the abstract resource spec that ' +
            'uniquely identifies the resource in the upstream provider (e.g. an `arn` in AWS).',
        pluginResourceIdFieldText: (idField: string, idFieldElementId: string) => `**[\`${idField}\`](#${idFieldElementId})** is the ID field for this resource.`,
        pluginResourceExamplesTitle: 'Examples',
        pluginResourceExamplesTitleAriaLabel: 'Direct link to the plugin abstract resource examples section',
        pluginResourceLinksToTitle: 'Links To',
        pluginResourceLinksToTitleAriaLabel: 'Direct link to the plugin abstract resource links to section',
        pluginResourceLinksToDescription: 'The following section lists the abstract resource types that a resource of this type can link to in a blueprint.',
        pluginResourceTypeLinkLabel: (
            fromResourceType: DeployEnginePluginDocContentResource,
            toResourceType: DeployEnginePluginDocContentResource,
        ) => {
            return `${fromResourceType.label} 🔗 ${toResourceType.label}`;
        },
        pluginResourceTypeGoToLinkAriaLabel: (
            fromResourceType: DeployEnginePluginDocContentResource,
            toResourceType: DeployEnginePluginDocContentResource,
        ) => {
            return `Go to the ${fromResourceType.label} to ${toResourceType.label} link`;
        },
        pluginResourcesTitle: 'Abstract Resources',
        pluginResourcesTitleAriaLabel: 'Direct link to plugin abstract resources overview section',
        pluginNoResourcesText: 'There are no abstract resources for this plugin.',
        pluginResourceSpecDataTypeArialLabel: (dataType: string) => `Direct link to the "${dataType}" data type`,
    }
}

function linksTextContent(): DeployEnginePluginLinksTextContent {
    return {
        pageMetaTitle: (pluginContent: ProviderPluginDocContent, link: DeployEnginePluginDocContentLinkWithPluginInfo) =>
            `${link.resourceTypeA.label} to ${link.resourceTypeB.label} | Links | ${pluginContent.displayName} Provider`,
        pluginLinksTitle: 'Links',
        pluginLinksTitleAriaLabel: 'Direct link to plugin links overview section',
        pluginLinkTypeAriaLabel: (linkLabel: string) => `Direct link to the "${linkLabel}" link type plugin`,
        pluginNoLinksText: 'There are no links for this plugin.',
        pluginLinkAnnotationsTitle: 'Annotations',
        pluginNoLinkAnnotationsText: 'There are no annotations for this link.',
        pluginLinkAnnotationAriaLabel: (annotationName: string) => `Direct link to the "${annotationName}" link annotation`,
        pluginLinkAnnotationForResourcePrefix: 'To be used in ',
    }
}

function dataSourcesTextContent(): DeployEnginePluginDataSourcesTextContent {
    return {
        pageMetaTitle: (pluginContent: ProviderPluginDocContent, dataSourceType: DeployEnginePluginDocContentDataSource) =>
            `${dataSourceType.label} | Data Sources | ${pluginContent.displayName} Provider`,
        pluginDataSourceSpecTitle: 'Specification',
        pluginDataSourceExamplesTitle: 'Examples',
        pluginDataSourceExamplesTitleAriaLabel: 'Direct link to the plugin data source examples section',
        pluginDataSourceFieldsTitle: 'Fields',
        pluginDataSourceFieldsTitleAriaLabel: 'Direct link to the plugin data source fields section',
        pluginNoDataSourceFieldsText: 'There are no fields for this data source.',
        pluginDataSourceFieldAriaLabel: (fieldName: string) => `Direct link to the "${fieldName}" data source field`,
        dataSourceFieldFilterableText: 'filterable',
        pluginDataSourceTypeAriaLabel: (dataSourceLabel: string) => `Direct link to the "${dataSourceLabel}" data source type`,
        pluginDataSourcesTitle: 'Data Sources',
        pluginDataSourcesTitleAriaLabel: 'Direct link to plugin data sources overview section',
        pluginNoDataSourcesText: 'There are no data sources for this plugin.',
        pluginDataSourceFieldsHelpText: 'The following section is a detailed specification for the fields that can be exported from a data source in a blueprint' +
            ' with this data source type. This includes fields that can be used to filter the upstream data source in the blueprint,' +
            ' fields that can be used in a data source filter are marked as **_filterable_**.',
    }
}

function customVarTypesTextContent(): DeployEnginePluginCustomVarTypesTextContent {
    return {
        pageMetaTitle: (pluginContent: ProviderPluginDocContent, customVarType: DeployEnginePluginDocContentCustomVarType) =>
            `${customVarType.label} | Custom Variable Types | ${pluginContent.displayName} Provider`,
        pluginCustomVarTypeOptionsTitle: 'Options',
        pluginCustomVarTypeOptionAriaLabel: (optionLabel: string) => `Direct link to the "${optionLabel}" custom variable type option`,
        pluginCustomVarTypeOptionsHelpText: 'The following section is a detailed specification for the options that can be used in a custom variable type in a blueprint.',
        pluginNoCustomVarTypeOptionsText: 'There are no options for this custom variable type.',
        pluginCustomVarTypeAriaLabel: (customVarTypeLabel: string) => `Direct link to the "${customVarTypeLabel}" custom variable type`,
        pluginCustomVarTypesTitle: 'Custom Variable Types',
        pluginCustomVarTypesTitleAriaLabel: 'Direct link to plugin custom variable types overview section',
        pluginNoCustomVarTypesText: 'There are no custom variable types for this plugin.',
        pluginCustomVarTypeExamplesTitle: 'Examples',
        pluginCustomVarTypeExamplesTitleAriaLabel: 'Direct link to the plugin custom variable type examples section',
    }
}

function functionsTextContent(): DeployEnginePluginFunctionsTextContent {
    return {
        pluginFunctionAriaLabel: (functionName: string) => `Direct link to the "${functionName}" function`,
        pluginFunctionsTitle: 'Functions',
        pluginFunctionsTitleAriaLabel: 'Direct link to plugin functions overview section',
        pluginNoFunctionsText: 'There are no functions for this plugin.',
        pluginFunctionDefinitionTitle: 'Definition',
        pluginFunctionDefinitionTitleAriaLabel: (functionName: string) => `Direct link to the "${functionName}" function definition`,
        pluginFunctionTypesTitle: 'Types',
        pluginFunctionTypesTitleAriaLabel: (functionName: string) => `Direct link to the "${functionName}" function types`,
        pluginFunctionParametersTitle: 'Parameters',
        pluginFunctionParametersTitleAriaLabel: (functionName: string) => `Direct link to the "${functionName}" function parameters`,
        pluginFunctionReturnTypeTitle: 'Return Type',
        pluginFunctionReturnTypeTitleAriaLabel: (functionName: string) => `Direct link to the "${functionName}" function return type`,
        pluginParamTypeLabel: 'type',
        pluginReturnTypeLabel: 'type',
        pluginFunctionTypeArialLabel: (functionName: string) => `Direct link to the "${functionName}" function value type`,
        pluginNoParametersText: 'There are no parameters for this function.',
        pageMetaTitle: (pluginContent: ProviderPluginDocContent, functionName: string) => `${functionName} | Functions | ${pluginContent.displayName} Provider`,
    }
}

export const DeployEnginePluginTextContentContext = createContext<DeployEnginePluginTextContent>(textContent());
