import React, { useMemo } from 'react';
import {
    CustomVarTypeOption,
    DeployEnginePluginDocContentCustomVarType,
} from '../utils/types';
import useDeployEnginePluginTextContent from '../hooks/use-deploy-engine-plugin-text-content';
import { DeployEnginePluginTextContent } from '../contexts/deploy-engine';
import { pluginCustomVarTypeOptionElementId } from '../utils/deploy-engine-plugin-docs';
import MarkdownWithCodeBlocks from './MarkdownWithCodeBlocks';

type CustomVarTypeOptionDefinitionProps = {
    name: string;
    option: CustomVarTypeOption;
    textContent: DeployEnginePluginTextContent;
};

function CustomVarTypeOptionDefinition({
    name,
    option,
    textContent
}: Readonly<CustomVarTypeOptionDefinitionProps>) {

    const elementId = useMemo(() => pluginCustomVarTypeOptionElementId(name), [name]);

    return <>
        <h3 className="anchor" id={elementId}>
            {option.label}
            <a
                className="hash-link"
                aria-label={textContent.customVarTypes.pluginCustomVarTypeOptionAriaLabel(option.label)}
                href={`#${elementId}`}
            ></a>
        </h3>
        <div className="padding-top--sm padding-bottom--sm">
            <code>{name}</code>
        </div>
        <div>
            <MarkdownWithCodeBlocks>{option.description}</MarkdownWithCodeBlocks>
        </div>
    </>
}

type Props = {
    customVarType: DeployEnginePluginDocContentCustomVarType;
}

export default function DeployEnginePluginDocCustomVarTypeOptions({ customVarType }: Readonly<Props>) {
    const textContent = useDeployEnginePluginTextContent();
    const options = Object.entries(customVarType.options);

    return <div>
        <h2 className="anchor" id="plugin-custom-var-type-options">
            {textContent.customVarTypes.pluginCustomVarTypeOptionsTitle}
            <a 
                className="hash-link"
                aria-label={textContent.customVarTypes.pluginCustomVarTypeOptionsTitle} 
                href="#plugin-custom-var-type-options"
            ></a>
        </h2>
        <div>
            <MarkdownWithCodeBlocks>
                {textContent.customVarTypes.pluginCustomVarTypeOptionsHelpText}
            </MarkdownWithCodeBlocks>
        </div>
        {options.length === 0 && (
            <p>{textContent.customVarTypes.pluginNoCustomVarTypeOptionsText}</p>
        )}
        <ul className="plain-list">
            {options.length > 0 && options.map(
                ([name, option]) => {
                    return (
                        <li key={name}>
                            <CustomVarTypeOptionDefinition
                                name={name}
                                option={option}
                                textContent={textContent}
                            />
                            <hr />
                        </li>
                    )
                },
            )}
        </ul>
    </div>
}
