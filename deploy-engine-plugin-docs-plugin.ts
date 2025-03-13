import { readdirSync, readFileSync } from 'fs';

import { LoadContext, Plugin, PluginContentLoadedActions } from '@docusaurus/types'
import { DeployEnginePluginDocContent, DeployEnginePluginDocContentLink, DeployEnginePluginDocContentResourceWithPluginInfo, DeployEnginePluginType } from './src/utils/types'
import { 
    BASE_PATH,
    pluginResourceTypePath, 
    toSlug,
    extractAllLinksToMap,
    extractAllResourcesToMap,
    pluginLinkPath,
    pluginDataSourcePath,
    pluginCustomVarTypePath,
    pluginFunctionPath,
    pluginAbstractResourceTypePath
} from './src/utils/deploy-engine-plugin-docs';


async function deployEnginePlugindDocsPlugin(context: LoadContext, options: unknown): Promise<Plugin<DeployEnginePluginDocContent[]>> {
    return {
        name: 'deploy-engine-plugin-docs-gen',
        async loadContent() {
            return loadPluginDocsContent()
        },
        async contentLoaded({content, actions}) {
            const globalResourceMap = extractAllResourcesToMap(content);
            const globalLinkMap = extractAllLinksToMap(content, globalResourceMap);

            actions.addRoute({
                path: BASE_PATH,
                component: require.resolve('./src/components/DeployEnginePluginDocsHome.tsx'),
                exact: true,
                modules: {},
                customData: {
                    pluginsContent: content
                }
            })

            content.forEach((pluginContent) => {
                actions.addRoute({
                    path: toSlug(pluginContent.id, pluginContent.pluginType, pluginContent.version),
                    component: require.resolve('./src/components/DeployEnginePluginDocPage.tsx'),
                    exact: true,
                    modules: {},
                    customData: {
                        pluginContent,
                        allPluginsContent: content,
                        globalLinkMap,
                    }
                })

                addResourceRoutes(actions, pluginContent, content, globalLinkMap, globalResourceMap)
                addLinkRoutes(actions, pluginContent, content, globalLinkMap)
                addDataSourceRoutes(actions, pluginContent, content, globalLinkMap)
                addCustomVarTypeRoutes(actions, pluginContent, content, globalLinkMap)
                addFunctionRoutes(actions, pluginContent, content, globalLinkMap)
                addAbstractResourceRoutes(actions, pluginContent, content, globalResourceMap)
            })
        }
    }
}

function addResourceRoutes(
    actions: PluginContentLoadedActions,
    pluginContent: DeployEnginePluginDocContent,
    allContent: DeployEnginePluginDocContent[],
    globalLinkMap: Record<string, DeployEnginePluginDocContentLink>,
    globalResourceMap: Record<string, DeployEnginePluginDocContentResourceWithPluginInfo>
) {
    if (pluginContent.pluginType === 'provider') {
        pluginContent.resources.forEach((resource) => {
            actions.addRoute({
                path: pluginResourceTypePath(pluginContent, resource.type),
                component: require.resolve('./src/components/DeployEnginePluginDocResourcePage.tsx'),
                exact: true,
                modules: {},
                customData: {
                    pluginContent,
                    allPluginsContent: allContent,
                    resource,
                    globalLinkMap,
                    globalResourceMap,
                    kind: 'concrete'
                }
            })
        })
    }
}

function addAbstractResourceRoutes(
    actions: PluginContentLoadedActions,
    pluginContent: DeployEnginePluginDocContent,
    allContent: DeployEnginePluginDocContent[],
    globalResourceMap: Record<string, DeployEnginePluginDocContentResourceWithPluginInfo>
) {
    if (pluginContent.pluginType === 'transformer') {
        pluginContent.abstractResources.forEach((resource) => {
            actions.addRoute({
                path: pluginAbstractResourceTypePath(pluginContent, resource.type),
                component: require.resolve('./src/components/DeployEnginePluginDocAbstractResourcePage.tsx'),
                exact: true,
                modules: {},
                customData: {
                    pluginContent,
                    allPluginsContent: allContent,
                    resource,
                    globalResourceMap,
                    kind: 'abstract'
                }
            })
        })
    }
}

function addLinkRoutes(
    actions: PluginContentLoadedActions,
    pluginContent: DeployEnginePluginDocContent,
    allContent: DeployEnginePluginDocContent[],
    globalLinkMap: Record<string, DeployEnginePluginDocContentLink>
) {
    if (pluginContent.pluginType === 'provider') {
        pluginContent.links.forEach((link) => {
            const linkWithPluginInfo = globalLinkMap[link.type];
            actions.addRoute({
                path: pluginLinkPath(pluginContent, link.type),
                component: require.resolve('./src/components/DeployEnginePluginDocLinkPage.tsx'),
                exact: true,
                modules: {},
                customData: {
                    pluginContent,
                    allPluginsContent: allContent,
                    link: linkWithPluginInfo,
                    globalLinkMap,
                }
            })
        })
    }
}

function addDataSourceRoutes(
    actions: PluginContentLoadedActions,
    pluginContent: DeployEnginePluginDocContent,
    allContent: DeployEnginePluginDocContent[],
    globalLinkMap: Record<string, DeployEnginePluginDocContentLink>
) {
    if (pluginContent.pluginType === 'provider') {
        pluginContent.dataSources.forEach((dataSource) => {
            actions.addRoute({
                path: pluginDataSourcePath(pluginContent, dataSource.type),
                component: require.resolve('./src/components/DeployEnginePluginDocDataSourcePage.tsx'),
                exact: true,
                modules: {},
                customData: {
                    pluginContent,
                    allPluginsContent: allContent,
                    dataSource,
                    globalLinkMap,
                }
            })
        }) 
    }
}

function addCustomVarTypeRoutes(
    actions: PluginContentLoadedActions,
    pluginContent: DeployEnginePluginDocContent,
    allContent: DeployEnginePluginDocContent[],
    globalLinkMap: Record<string, DeployEnginePluginDocContentLink>
) {
    if (pluginContent.pluginType === 'provider') {
        pluginContent.customVarTypes.forEach((customVarType) => {
            actions.addRoute({
                path: pluginCustomVarTypePath(pluginContent, customVarType.type),
                component: require.resolve('./src/components/DeployEnginePluginDocCustomVarTypePage.tsx'),
                exact: true,
                modules: {},
                customData: {
                    pluginContent,
                    allPluginsContent: allContent,
                    customVarType,
                    globalLinkMap,
                }
            })
        }) 
    }
}

function addFunctionRoutes(
    actions: PluginContentLoadedActions,
    pluginContent: DeployEnginePluginDocContent,
    allContent: DeployEnginePluginDocContent[],
    globalLinkMap: Record<string, DeployEnginePluginDocContentLink>
) {
    if (pluginContent.pluginType === 'provider') {
        pluginContent.functions.forEach((func) => {
            actions.addRoute({
                path: pluginFunctionPath(pluginContent, func.name),
                component: require.resolve('./src/components/DeployEnginePluginDocFunctionPage.tsx'),
                exact: true,
                modules: {},
                customData: {
                    pluginContent,
                    allPluginsContent: allContent,
                    func,
                    globalLinkMap,
                }
            })
        })
    }
}

function loadPluginDocsContent(): DeployEnginePluginDocContent[] {
    const providerPlugins = loadPluginDocsFromDir(
        './plugin-framework/community/plugins/providers',
        'provider',
    );
    const transformerPlugins = loadPluginDocsFromDir(
        './plugin-framework/community/plugins/transformers',
        'transformer',
    );

    return [
        ...providerPlugins,
        ...transformerPlugins,
    ]
}

function loadPluginDocsFromDir(dir: string, pluginType: DeployEnginePluginType): DeployEnginePluginDocContent[] {
    const pluginDocs: DeployEnginePluginDocContent[] = [];

    readdirSync(dir).forEach((pluginFile) => {
        if (pluginFile.endsWith('.json')) {
            const contents = readFileSync(`${dir}/${pluginFile}`, 'utf-8')
            const pluginContent = JSON.parse(contents)

            pluginDocs.push({
                ...pluginContent,
                pluginType,
            })
        }
    });

    return pluginDocs
}

export default deployEnginePlugindDocsPlugin
