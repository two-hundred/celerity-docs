import React, { ReactNode, useEffect } from 'react';
import { DeployEnginePluginDocContent, DeployEnginePluginDocContentCustomVarType, DeployEnginePluginDocContentDataSource, DeployEnginePluginDocContentFunction, DeployEnginePluginDocContentLinkWithPluginInfo, DeployEnginePluginDocContentResource } from '../../utils/types';
import { PropSidebarBreadcrumbsItem } from '@docusaurus/plugin-content-docs';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import HomeBreadcrumbItem from '@theme/DocBreadcrumbs/Items/Home';
import Link from '@docusaurus/Link';

import styles from './styles.module.css';
import { translate } from '@docusaurus/Translate';
import { pluginCustomVarTypePath, pluginDataSourcePath, pluginFunctionPath, pluginLinkPath, pluginResourceTypePath, pluralise, toUpperFirst } from '@site/src/utils/deploy-engine-plugin-docs';
import DeployEnginePluginBreadcrumbsStructuredData from './StructuredData';
import useDeployEnginePluginTextContent from '@site/src/hooks/use-deploy-engine-plugin-text-content';

type BreadcrumbsItemLinkProps = {
    children: ReactNode;
    href: string | undefined;
    isLast: boolean;
};

function BreadcrumbsItemLink({
    children,
    href,
    isLast,
}: Readonly<BreadcrumbsItemLinkProps>): ReactNode {
    const className = 'breadcrumbs__link';
    if (isLast) {
        return <span className={className}>{children}</span>;
    }
    return href ? (
        <Link className={className} href={href}>
            <span>{children}</span>
        </Link>
    ) : (
        <span className={className}>{children}</span>
    );
}

type BreadcrumbsItemProps = {
    children: ReactNode;
    active?: boolean;
};

function BreadcrumbsItem({
    children,
    active,
}: Readonly<BreadcrumbsItemProps>): ReactNode {
    return (
        <li
            className={clsx('breadcrumbs__item', {
                'breadcrumbs__item--active': active,
            })}>
            {children}
        </li>
    );
}

type Props = {
    pluginContent?: DeployEnginePluginDocContent;
    resource?: DeployEnginePluginDocContentResource;
    link?: DeployEnginePluginDocContentLinkWithPluginInfo;
    dataSource?: DeployEnginePluginDocContentDataSource;
    customVarType?: DeployEnginePluginDocContentCustomVarType;
    func?: DeployEnginePluginDocContentFunction;
}

export default function DeployEnginePluginBreadcrumbs(props: Readonly<Props>) {
    const textContent = useDeployEnginePluginTextContent();

    const [homePageRoute, setHomePageRoute] = React.useState<PropSidebarBreadcrumbsItem | undefined>(undefined);
    const [breadcrumbs, setBreadcrumbs] = React.useState<PropSidebarBreadcrumbsItem[]>([]);

    useEffect(() => {
        setHomePageRoute({
            type: 'link',
            label: 'Home',
            href: ''
        })
        const pluginElementPage = !!props.resource || !!props.link || !!props.dataSource || !!props.customVarType || !!props.func;
        const baseBreadcrumbs: PropSidebarBreadcrumbsItem[] = !pluginElementPage ? [
            {
                type: 'link',
                label: 'Community',
                href: ''
            },
            {
                type: 'link',
                label: 'Deploy Engine Plugins',
                href: '/community/deploy-engine/plugins'
            },
        ] : [
            {
                type: 'link',
                label: '...',
                href: ''
            }
        ]

        const providerBreadcrumbs: PropSidebarBreadcrumbsItem[] = props.pluginContent ? [

            {
                type: 'link',
                label: toUpperFirst(pluralise(props.pluginContent.pluginType)),
                href: ''
            },
            {
                type: 'link',
                label: props.pluginContent.displayName,
                href: `/community/deploy-engine/plugins/${pluralise(props.pluginContent.pluginType)}` +
                    `/${props.pluginContent.id}/${props.pluginContent.version}`
            }
        ] : []

        const resourceBreadcrumbs: PropSidebarBreadcrumbsItem[] = props.resource ? [
            {
                type: 'link',
                label: 'Resources',
                href: ''
            },
            {
                type: 'link',
                label: props.resource.label,
                href: pluginResourceTypePath(props.pluginContent, props.resource.type)
            }
        ] : []

        const linkBreadcrumbs: PropSidebarBreadcrumbsItem[] = props.link ? [
            {
                type: 'link',
                label: 'Links',
                href: ''
            },
            {
                type: 'link',
                label: textContent.resources.pluginResourceTypeLinkLabel(
                    props.link.resourceTypeA,
                    props.link.resourceTypeB,
                ),
                href: pluginLinkPath(props.link.plugin, props.link.type)
            }
        ] : []

        const dataSourceBreadcrumbs: PropSidebarBreadcrumbsItem[] = props.dataSource ? [
            {
                type: 'link',
                label: 'Data Sources',
                href: ''
            },
            {
                type: 'link',
                label: props.dataSource.label,
                href: pluginDataSourcePath(props.pluginContent, props.dataSource.type)
            }
        ] : []

        const customVarTypeBreadcrumbs: PropSidebarBreadcrumbsItem[] = props.customVarType ? [
            {
                type: 'link',
                label: 'Custom Variable Types',
                href: ''
            },
            {
                type: 'link',
                label: props.customVarType.label,
                href: pluginCustomVarTypePath(props.pluginContent, props.customVarType.type)
            }
        ] : []

        const functionBreadcrumbs: PropSidebarBreadcrumbsItem[] = props.func ? [
            {
                type: 'link',
                label: 'Functions',
                href: ''
            },
            {
                type: 'link',
                label: props.func.name,
                href: pluginFunctionPath(props.pluginContent, props.func.name)
            }
        ] : []

        setBreadcrumbs([
            ...baseBreadcrumbs,
            ...providerBreadcrumbs,
            ...resourceBreadcrumbs,
            ...linkBreadcrumbs,
            ...dataSourceBreadcrumbs,
            ...customVarTypeBreadcrumbs,
            ...functionBreadcrumbs,
        ])
    }, []);

    return (
        <>
            <DeployEnginePluginBreadcrumbsStructuredData breadcrumbs={breadcrumbs} />
            <nav
                className={clsx(
                    ThemeClassNames.docs.docBreadcrumbs,
                    styles.breadcrumbsContainer,
                )}
                aria-label={translate({
                    id: 'theme.docs.breadcrumbs.navAriaLabel',
                    message: 'Breadcrumbs',
                    description: 'The ARIA label for the breadcrumbs',
                })}>
                <ul className="breadcrumbs">
                    {homePageRoute && <HomeBreadcrumbItem />}
                    {breadcrumbs.map((item, idx) => {
                        const isLast = idx === breadcrumbs.length - 1;
                        const href =
                            item.type === 'category' && item.linkUnlisted
                                ? undefined
                                : item.href;
                        return (
                            <BreadcrumbsItem key={idx} active={isLast}>
                                <BreadcrumbsItemLink href={href} isLast={isLast}>
                                    {item.label}
                                </BreadcrumbsItemLink>
                            </BreadcrumbsItem>
                        );
                    })}
                </ul>
            </nav>
        </>
    )
} 
