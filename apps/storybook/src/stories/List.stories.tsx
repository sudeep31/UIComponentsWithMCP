import type { Meta, StoryObj } from '@storybook/react';
import { List } from '@cl/react';
import type { ListItem } from '@cl/react';

const todoItems: ListItem[] = [
  { id: '1', label: 'Design tokens' },
  { id: '2', label: 'React components' },
  { id: '3', label: 'Web Components export' },
  { id: '4', label: 'Storybook', description: 'Interactive component sandbox' },
  { id: '5', label: 'Docusaurus', description: 'Public documentation site' },
];

const descItems: ListItem[] = [
  { id: 'a', label: 'Button', description: 'Trigger actions and events' },
  { id: 'b', label: 'TextBox', description: 'Single-line text input' },
  { id: 'c', label: 'Select', description: 'Dropdown option picker' },
];

const meta: Meta<typeof List> = {
  title: 'Components/List',
  component: List,
  tags: ['autodocs'],
  args: {
    items: todoItems,
    variant: 'unordered',
    selectable: false,
    dividers: false,
    compact: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['unordered', 'ordered', 'descriptive'],
      description: 'List rendering mode',
    },
    selectable: { control: 'boolean', description: 'Highlight and emit onSelect on click' },
    selectedId: { control: 'text', description: 'Currently selected item id' },
    dividers: { control: 'boolean', description: 'Show dividers between items' },
    compact: { control: 'boolean', description: 'Reduce item padding' },
    onSelect: { action: 'selected' },
  },
};

export default meta;
type Story = StoryObj<typeof List>;

export const Unordered: Story = { args: { variant: 'unordered' } };

export const Ordered: Story = { args: { variant: 'ordered', items: todoItems } };

export const Descriptive: Story = {
  args: { variant: 'descriptive', items: descItems },
};

export const Selectable: Story = {
  args: { selectable: true, selectedId: '2', items: todoItems },
};

export const WithDividers: Story = {
  args: { dividers: true, items: todoItems },
};

export const Compact: Story = {
  args: { compact: true, dividers: true, items: todoItems },
};

export const Empty: Story = {
  args: { items: [] },
};
