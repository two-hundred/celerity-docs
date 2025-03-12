import React from 'react';
import { DeployEnginePluginDocContentResourceSpec, ResourceKind, ResourceSpecSchemaType } from '../utils/types';
import useDeployEnginePluginTextContent from '../hooks/use-deploy-engine-plugin-text-content';
import { ResourceSpecSchema, ResourceSpecSchemaDataTypes } from './ResourceSpecSchema';
import { pluginSchemaElementId } from '../utils/deploy-engine-plugin-docs';
import MarkdownWithCodeBlocks from './MarkdownWithCodeBlocks';

type Props = {
    resourceLabel: string;
    resourceSpec: DeployEnginePluginDocContentResourceSpec;
    dataTypeSchemas: Record<string, ResourceSpecSchemaType>;
    kind: ResourceKind;
}

export default function DeployEnginePluginDocResourceSpec(props: Readonly<Props>) {
    const { resourceSpec: { schema, idField }, resourceLabel, dataTypeSchemas, kind } = props;

    const textContent = useDeployEnginePluginTextContent();
    const resourceTextContent = kind === 'abstract' ? textContent.abstractResources : textContent.resources;

    return <div>
        <h2 className="anchor " id="plugin-resource-spec">
            {resourceTextContent.pluginResourceSpecTitle}
            <a
                className="hash-link"
                aria-label={resourceTextContent.pluginResourceSpecTitleAriaLabel(resourceLabel)}
                href="#plugin-resource-spec"
            ></a>
        </h2>
        <div>
            <MarkdownWithCodeBlocks>{resourceTextContent.pluginResourceSpecHelpText}</MarkdownWithCodeBlocks>
        </div>
        <ResourceSpecSchema schema={schema} schemaPath="root" dataTypeSchemas={dataTypeSchemas} level={1} />
        {Object.entries(dataTypeSchemas).length > 0 && (
            <>
                <h2 className="anchor " id="plugin-data-types">
                    {resourceTextContent.pluginResourceSpecDataTypesTitle}
                    <a
                        className="hash-link"
                        aria-label={resourceTextContent.pluginResourceSpecDataTypesTitleAriaLabel(resourceLabel)}
                        href="#plugin-data-types"
                    ></a>
                </h2>
                <ResourceSpecSchemaDataTypes dataTypeSchemas={dataTypeSchemas} kind={kind} />
            </>
        )}
        <div>
            <h2 className="anchor" id="plugin-resource-spec-id-field">
                {resourceTextContent.pluginResourceIdFieldTitle}
                <a
                    className="hash-link"
                    aria-label={resourceTextContent.pluginResourceIdFieldTitleAriaLabel}
                    href="#plugin-resource-spec-id-field"
                ></a>
            </h2>
            <div>
                <MarkdownWithCodeBlocks>
                    {resourceTextContent.pluginResourceIdFieldDescription}
                </MarkdownWithCodeBlocks>
            </div>
            <div>
                <MarkdownWithCodeBlocks>
                    {resourceTextContent.pluginResourceIdFieldText(
                        idField,
                        pluginSchemaElementId("root", idField)
                    )}
                </MarkdownWithCodeBlocks>
            </div>
        </div>
    </div>
}
