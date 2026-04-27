import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    'getting-started',
    'design-tokens',
    {
      type: 'category',
      label: 'Components',
      collapsed: false,
      items: [
        'components/button',
        'components/textbox',
        'components/numberbox',
        'components/select',
        'components/textarea',
        'components/list',
      ],
    },
    'web-components',
    'mcp-server',
  ],
};

export default sidebars;
