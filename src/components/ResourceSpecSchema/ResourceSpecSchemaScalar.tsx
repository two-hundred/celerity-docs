import React from 'react';

import { ResourceSpecSchemaScalarType} from "@site/src/utils/types";
import useDeployEnginePluginTextContent from '@site/src/hooks/use-deploy-engine-plugin-text-content';
import { renderDefaultValue, renderExamples } from '@site/src/utils/render';
import MarkdownWithCodeBlocks from '../MarkdownWithCodeBlocks';

type Props = {
    schema: ResourceSpecSchemaScalarType;
}

export default function ResourceSpecSchemaScalar({ schema }: Readonly<Props>) {
    const textContent = useDeployEnginePluginTextContent();

    return <div>
        <div>
            <MarkdownWithCodeBlocks>{schema.description}</MarkdownWithCodeBlocks>
        </div>
        <p><b>{textContent.pluginFieldTypeLabel}</b></p>
        <p>{schema.type}</p>
        <p><b>{textContent.pluginFieldNullValueLabel}</b></p>
        <p>{schema.nullable ? textContent.yesText : textContent.noText}</p>
        {schema.default && (<>
            <p><b>{textContent.pluginFieldDefaultValueLabel}</b></p>
            <div>{renderDefaultValue(schema.default)}</div>
        </>)}
        {schema.examples && (<>
            <p><b>{textContent.pluginFieldExamplesLabel}</b></p>
            <div>{renderExamples(schema.examples)}</div>
        </>)}
    </div>
}
