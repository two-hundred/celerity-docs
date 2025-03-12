import React, { useMemo } from 'react';

import {
    DeployEnginePluginDocContentConfig,
    DeployEnginePluginDocContentConfigField,
} from "../utils/types";
import useDeployEnginePluginTextContent from '../hooks/use-deploy-engine-plugin-text-content';
import { DeployEnginePluginTextContent } from '../contexts/deploy-engine';
import { pluginConfigFieldId } from '../utils/deploy-engine-plugin-docs';
import { renderDefaultValue, renderExamples, renderScalarValues } from '../utils/render';
import MarkdownWithCodeBlocks from './MarkdownWithCodeBlocks';

type FieldProps = {
    fieldName: string;
    schema: DeployEnginePluginDocContentConfigField;
    textContent: DeployEnginePluginTextContent;
}

function DeployEnginePluginDocConfigField(props: Readonly<FieldProps>) {
    const { textContent, fieldName, schema } = props;

    const elementId = useMemo(() => pluginConfigFieldId(fieldName), [fieldName]);

    return <>
        <h3 className="anchor" id={elementId}>
            {props.schema.label}
            <a className="hash-link" aria-label={textContent.pluginConfigFieldAriaLabel(schema.label)} href={`#${elementId}`}></a>
        </h3>
        <div className="padding-bottom--md">
            <code>{fieldName}</code>
        </div>
        {schema.required && <div className="padding-bottom--md"><i><b>{textContent.requiredText}</b></i></div>}
        <div>
            <MarkdownWithCodeBlocks>{schema.description}</MarkdownWithCodeBlocks>
        </div>
        <p><b>{textContent.pluginFieldTypeLabel}</b></p>
        <p>{schema.type}</p>
        {schema.allowedValues && (<>
            <p><b>{textContent.pluginFieldAllowedValuesLabel}</b></p>
            <div className="margin-bottom--md">{renderScalarValues(schema.allowedValues)}</div>
        </>)}
        {schema.default && (<>
            <p><b>{textContent.pluginFieldDefaultValueLabel}</b></p>
            <div className="margin-bottom--md">{renderDefaultValue(schema.default)}</div>
        </>)}
        {schema.examples && (<>
            <p><b>{textContent.pluginFieldExamplesLabel}</b></p>
            <div className="margin-bottom--md">{renderExamples(schema.examples)}</div>
        </>)}
    </>
}

type Props = {
    configSchema: DeployEnginePluginDocContentConfig;
}

export default function DeployEnginePluginDocConfig(props: Readonly<Props>) {
    const textContent = useDeployEnginePluginTextContent();
    const configSchemaItems = Object.entries(props.configSchema);

    return <div>
        <h2 className="anchor" id="plugin-configuration">
            {textContent.pluginConfigTitle}
            <a className="hash-link" aria-label={textContent.pluginConfigTitleAriaLabel} href="#plugin-configuration"></a>
        </h2>
        {configSchemaItems.length === 0 && (
            <p>{textContent.pluginConfigEmptyFieldsText}</p>
        )}
        <ul className="plain-list">
            {configSchemaItems.length > 0 && configSchemaItems.map(
                ([fieldName, schema]) => (
                    <li key={fieldName}>
                        <DeployEnginePluginDocConfigField fieldName={fieldName} schema={schema} textContent={textContent} />
                        <hr />
                    </li>
                ),
            )}
        </ul>
    </div>
}

