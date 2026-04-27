import type { Meta, StoryObj } from '@storybook/react';
import { TextBox } from '@cl/react';

const meta: Meta<typeof TextBox> = {
  title: 'Components/TextBox',
  component: TextBox,
  tags: ['autodocs'],
  args: {
    label: 'Label',
    placeholder: 'Enter text…',
    disabled: false,
    readOnly: false,
    required: false,
  },
  argTypes: {
    label: { control: 'text', description: 'Field label' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    error: { control: 'text', description: 'Validation error message' },
    helperText: { control: 'text', description: 'Helper text below input' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof TextBox>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { label: 'Full Name', value: 'Jane Doe', placeholder: 'Enter name' },
};

export const WithHelperText: Story = {
  args: { label: 'Email', helperText: 'We will never share your email.' },
};

export const WithError: Story = {
  args: { label: 'Username', error: 'Username is already taken.', value: 'jdoe' },
};

export const Disabled: Story = {
  args: { label: 'Disabled Field', value: 'Read only value', disabled: true },
};

export const Required: Story = {
  args: { label: 'Required Field', required: true },
};
