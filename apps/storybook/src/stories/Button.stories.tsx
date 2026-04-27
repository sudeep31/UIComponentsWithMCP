import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@cl/react';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    label: 'Button',
    variant: 'primary',
    size: 'md',
    loading: false,
    fullWidth: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size preset',
    },
    label: { control: 'text', description: 'Button label text' },
    loading: { control: 'boolean', description: 'Show loading spinner' },
    fullWidth: { control: 'boolean', description: 'Stretch to full width' },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: 'primary', label: 'Primary' } };

export const Secondary: Story = { args: { variant: 'secondary', label: 'Secondary' } };

export const Ghost: Story = { args: { variant: 'ghost', label: 'Ghost' } };

export const Danger: Story = { args: { variant: 'danger', label: 'Danger' } };

export const Loading: Story = { args: { loading: true, label: 'Loading…' } };

export const Disabled: Story = { args: { disabled: true, label: 'Disabled' } };

export const FullWidth: Story = { args: { fullWidth: true, label: 'Full Width' } };

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Button size="sm" label="Small" />
      <Button size="md" label="Medium" />
      <Button size="lg" label="Large" />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button variant="primary" label="Primary" />
      <Button variant="secondary" label="Secondary" />
      <Button variant="ghost" label="Ghost" />
      <Button variant="danger" label="Danger" />
    </div>
  ),
};
