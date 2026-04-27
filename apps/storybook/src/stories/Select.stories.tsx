import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '@cl/react';
import type { SelectOption } from '@cl/react';

const fruitOptions: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'durian', label: 'Durian', disabled: true },
];

const countryOptions: SelectOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'in', label: 'India' },
];

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    label: 'Choose an option',
    placeholder: 'Select…',
    options: fruitOptions,
    disabled: false,
    required: false,
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    error: { control: 'text' },
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {};

export const WithSelection: Story = {
  args: { label: 'Fruit', options: fruitOptions, value: 'banana' },
};

export const WithError: Story = {
  args: { label: 'Country', options: countryOptions, error: 'Please select a country.' },
};

export const WithHelperText: Story = {
  args: { label: 'Region', options: countryOptions, helperText: 'Select the region closest to you.' },
};

export const Disabled: Story = {
  args: { label: 'Locked', options: fruitOptions, value: 'apple', disabled: true },
};

export const ManyOptions: Story = {
  args: { label: 'Country', options: countryOptions },
};
