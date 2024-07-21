import React from 'react';
import useRouteContext from '@docusaurus/useRouteContext';
import DocsVersionDropdownNavbarItem from '@theme-original/NavbarItem/DocsVersionDropdownNavbarItem';

export default function DocsVersionDropdownNavbarItemWrapper(props) {
  const {plugin} = useRouteContext();

  if (props.docsPluginId !== plugin.id) {
    // Ensure version dropdowns are only rendered for the active docs plugin,
    // meaning that a version dropdown will only display when the user is
    // currently browsing the docs for that specific SDK or application.
    return null;
  }

  return <DocsVersionDropdownNavbarItem {...props} />;
}
