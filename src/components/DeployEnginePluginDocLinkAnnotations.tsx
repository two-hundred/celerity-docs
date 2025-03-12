import React, { useMemo } from 'react';
import {
    DeployEnginePluginDocContentLinkAnnotation,
    DeployEnginePluginDocContentLinkWithPluginInfo,
    DeployEnginePluginDocContentResourceWithPluginInfo
} from '../utils/types';
import useDeployEnginePluginTextContent from '../hooks/use-deploy-engine-plugin-text-content';
import { DeployEnginePluginTextContent } from '../contexts/deploy-engine';
import { pluginLinkAnnotationElementId, pluginResourceTypePath } from '../utils/deploy-engine-plugin-docs';
import { renderDefaultValue, renderExamples, renderScalarValues } from '../utils/render';
import Link from '@docusaurus/Link';
import MarkdownWithCodeBlocks from './MarkdownWithCodeBlocks';

type LinkAnnotationDefinitionProps = {
    annotationName: string;
    forResource: DeployEnginePluginDocContentResourceWithPluginInfo;
    definition: DeployEnginePluginDocContentLinkAnnotation;
    textContent: DeployEnginePluginTextContent;
};

function LinkAnnotationDefinition({ 
    annotationName, 
    forResource,
    definition,
    textContent
}: Readonly<LinkAnnotationDefinitionProps>) {

    const elementId = useMemo(() => pluginLinkAnnotationElementId(annotationName), [annotationName]);

    return <>
        <h3 className="anchor" id={elementId}>
            {annotationName}
            <a 
                className="hash-link"
                aria-label={textContent.links.pluginLinkAnnotationAriaLabel(annotationName)}
                href={`#${elementId}`}
            ></a>
        </h3>
        <div className="padding-bottom--md">
            {textContent.links.pluginLinkAnnotationForResourcePrefix}
            <Link to={pluginResourceTypePath(
                forResource.plugin,
                forResource.type,
            )}>{forResource.label}</Link>
        </div>
        {definition.required && <div className="padding-bottom--md"><i><b>{textContent.requiredText}</b></i></div>}
        <div>
            <MarkdownWithCodeBlocks>{definition.description}</MarkdownWithCodeBlocks>
        </div>
        <p><b>{textContent.pluginFieldTypeLabel}</b></p>
        <p>{definition.type}</p>
        {definition.allowedValues && (<>
            <p><b>{textContent.pluginFieldAllowedValuesLabel}</b></p>
            <div className="margin-bottom--md">{renderScalarValues(definition.allowedValues)}</div>
        </>)}
        {definition.default && (<>
            <p><b>{textContent.pluginFieldDefaultValueLabel}</b></p>
            <div className="margin-bottom--md">{renderDefaultValue(definition.default)}</div>
        </>)}
        {definition.examples && (<>
            <p><b>{textContent.pluginFieldExamplesLabel}</b></p>
            <div className="margin-bottom--md">{renderExamples(definition.examples)}</div>
        </>)}
    </>
}

type Props = {
    link: DeployEnginePluginDocContentLinkWithPluginInfo;
}

export default function DeployEnginePluginDocLinkAnnotations({ link }: Readonly<Props>) {
    const textContent = useDeployEnginePluginTextContent();
    const annotationItems = Object.entries(link.annotationDefinitions);

    return <div>
        <h2 className="anchor" id="plugin-link-annotations">
            {textContent.links.pluginLinkAnnotationsTitle}
            <a 
                className="hash-link"
                aria-label={textContent.links.pluginLinkAnnotationsTitle}
                href="#plugin-link-annotations"
            ></a>
        </h2>
        {annotationItems.length === 0 && (
            <p>{textContent.links.pluginNoLinkAnnotationsText}</p>
        )}
        <ul className="plain-list">
            {annotationItems.length > 0 && annotationItems.map(
                ([annotationFullName, annotationDefinition]) => {
                    const [resourceType, annotationName] = annotationFullName.split('::');
                    return (
                        <li key={annotationFullName}>
                            <LinkAnnotationDefinition
                                annotationName={annotationName}
                                forResource={resourceType === link.resourceTypeA.type ? link.resourceTypeA : link.resourceTypeB}
                                definition={annotationDefinition}
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
