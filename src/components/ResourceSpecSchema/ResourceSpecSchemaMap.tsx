import React from 'react';

import { ResourceSpecSchemaMapType } from "@site/src/utils/types";
import useDeployEnginePluginTextContent from '@site/src/hooks/use-deploy-engine-plugin-text-content';
import { renderAnyExamples, renderAnyValue, renderType } from '@site/src/utils/render';
import MarkdownWithCodeBlocks from '../MarkdownWithCodeBlocks';

type Props = {
    schema: ResourceSpecSchemaMapType;
}

export default function ResourceSpecSchemaMap({ schema }: Readonly<Props>) {
    const textContent = useDeployEnginePluginTextContent();

    return <div>
        <div>
            <MarkdownWithCodeBlocks>{schema.description}</MarkdownWithCodeBlocks>
        </div>
        <p><b>{textContent.pluginFieldTypeLabel}</b></p>
        <p>map[ string, {renderType(schema.mapValues)} ]</p>
        <p><b>{textContent.pluginFieldNullValueLabel}</b></p>
        <p>{schema.nullable ? textContent.yesText : textContent.noText}</p>
        {schema.default && (<>
            <p><b>{textContent.pluginFieldDefaultValueLabel}</b></p>
            <div>{renderAnyValue(schema.default)}</div>
        </>)}
        {schema.examples && (<>
            <p><b>{textContent.pluginFieldExamplesLabel}</b></p>
            <div>{renderAnyExamples(schema.examples)}</div>
        </>)}
    </div>
}
