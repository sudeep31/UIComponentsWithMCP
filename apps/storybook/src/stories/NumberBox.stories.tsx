import type { Meta, StoryObj } from '@storybook/react';
import { NumberBox } from '@cl/react';

const meta: Meta<typeof NumberBox> = {
  title: 'Components/NumberBox',
  component: NumberBox,
  tags: ['autodocs'],
  args: {
    label: 'Quantity',
    placeholder: '0',
    disabled: false,
    readOnly: false,
    required: false,
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    value: { control: 'number' },
    min: { control: 'number', description: 'Minimum allowed value' },
    max: { control: 'number', description: 'Maximum allowed value' },
    step: { control: 'number', description: 'Increment step' },
    error: { control: 'text' },
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof NumberBox>;

export const Default: Story = {};

export const WithRange: Story = {
  args: { label: 'Age', min: 0, max: 120, step: 1, helperText: 'Enter your age (0 – 120)' },
};

export const WithError: Story = {
  args: { label: 'Price', value: -5, error: 'Price cannot be negative.' },
};

export const Disabled: Story = {
  args: { label: 'Score', value: 42, disabled: true },
};

export const WithStep: Story = {
  args: { label: 'Percentage', min: 0, max: 100, step: 5, helperText: 'Increments of 5' },
};
