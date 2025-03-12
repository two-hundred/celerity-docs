import React from 'react';
import useRouteContext from '@docusaurus/useRouteContext';
import DocsVersionDropdownNavbarItem from '@theme-original/NavbarItem/DocsVersionDropdownNavbarItem';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { CustomFields } from '@site/src/utils/types';
import styles from './navbaritem.module.css';

export default function DocsVersionDropdownNavbarItemWrapper(props) {
  const { plugin } = useRouteContext();
  const { siteConfig: { customFields } } = useDocusaurusContext();
  const title = (customFields as CustomFields).customPluginContent[plugin.id]?.title ?? "Version";

  if (props.docsPluginId !== plugin.id) {
    // Ensure version dropdowns are only rendered for the active docs plugin,
    // meaning that a version dropdown will only display when the user is
    // currently browsing the docs for that specific SDK or application.
    return null;
  }

  return (
    <div className={styles.versionDropdownWrapper}>
      <span className={`${styles.versionDropdownLabel} text--truncate`}>{title}</span>
      <DocsVersionDropdownNavbarItem {...props} />
    </div>
  );
}
