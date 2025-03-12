import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import { PropSidebarBreadcrumbsItem } from '@docusaurus/plugin-content-docs';
import { useBreadcrumbsStructuredData } from '@site/src/hooks/use-breadcrumbs-structured-data';

type Props = {
    breadcrumbs: PropSidebarBreadcrumbsItem[];
};

export default function DeployEnginePluginBreadcrumbsStructuredData(
    props: Readonly<Props>,
): ReactNode {
  const structuredData = useBreadcrumbsStructuredData({
    breadcrumbs: props.breadcrumbs,
  });
  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Head>
  );
}
