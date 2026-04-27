import type { Meta, StoryObj } from '@storybook/react';
import { TextArea } from '@cl/react';

const meta: Meta<typeof TextArea> = {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  args: {
    label: 'Description',
    placeholder: 'Enter description…',
    rows: 4,
    resize: 'vertical',
    showCount: false,
    disabled: false,
    readOnly: false,
    required: false,
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    rows: { control: { type: 'number', min: 2, max: 20 } },
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
      description: 'Resize handle direction',
    },
    showCount: { control: 'boolean', description: 'Show character count' },
    maxLength: { control: 'number', description: 'Max characters (enables count when showCount=true)' },
    error: { control: 'text' },
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {};

export const WithCharacterCount: Story = {
  args: {
    label: 'Bio',
    showCount: true,
    maxLength: 280,
    placeholder: 'Tell us about yourself…',
    value: 'I love building component libraries.',
  },
};

export const ResizeNone: Story = {
  args: { label: 'Fixed Height', resize: 'none', rows: 3 },
};

export const WithError: Story = {
  args: { label: 'Notes', error: 'Notes cannot be empty.', value: '' },
};

export const Disabled: Story = {
  args: { label: 'Read-only', value: 'This field is disabled.', disabled: true },
};

export const Tall: Story = {
  args: { label: 'Long Text', rows: 10, placeholder: 'Write something long…' },
};
