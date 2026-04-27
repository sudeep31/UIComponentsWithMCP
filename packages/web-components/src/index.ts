/**
 * @cl/web-components — Custom Elements bundle
 *
 * Wraps every @cl/react component into a native Web Component (Custom Element)
 * using @r2wc/react-to-web-component. The resulting bundle is self-contained
 * (React runtime included) and works in Angular, Vue, Svelte, or plain HTML
 * without any additional dependencies.
 *
 * Usage (plain HTML):
 *   <script type="module" src="custom-elements.js"></script>
 *   <cl-button label="Click me" variant="primary"></cl-button>
 *
 * Usage (Angular):
 *   Add CUSTOM_ELEMENTS_SCHEMA to @NgModule schemas
 *
 * Usage (Vue):
 *   vite.config: vue({ template: { compilerOptions: { isCustomElement: t => t.startsWith('cl-') } } })
 */

import r2wc from '@r2wc/react-to-web-component'

// Import components directly from source (avoids double-bundling)
import { Button } from '../../react/src/components/Button/Button'
import { TextBox } from '../../react/src/components/TextBox/TextBox'
import { NumberBox } from '../../react/src/components/NumberBox/NumberBox'
import { Select } from '../../react/src/components/Select/Select'
import { TextArea } from '../../react/src/components/TextArea/TextArea'
import { List } from '../../react/src/components/List/List'

// Import compiled styles (tokens + Tailwind)
import '../../react/src/styles/index.css'

// ─── Prop type schemas ────────────────────────────────────────────────────────
// r2wc needs explicit prop definitions so it can map HTML attributes → React props
// Types: 'String' | 'Number' | 'Boolean' | 'Function' | 'Object' | 'Array'

/** Shared style override props present on every component */
const basePropTypes = {
    color: String,
    backgroundColor: String,
    padding: String,
    paddingX: String,
    paddingY: String,
    width: String,
    height: String,
    className: String,
} as const

// ─── <cl-button> ─────────────────────────────────────────────────────────────
const CLButton = r2wc(Button, {
    props: {
        ...basePropTypes,
        variant: String,  // 'primary' | 'secondary' | 'ghost' | 'danger'
        size: String,  // 'sm' | 'md' | 'lg'
        label: String,
        loading: Boolean,
        fullWidth: Boolean,
        disabled: Boolean,
        type: String,
        onClick: Function,
    },
    shadow: 'open',
})

// ─── <cl-textbox> ────────────────────────────────────────────────────────────
const CLTextBox = r2wc(TextBox, {
    props: {
        ...basePropTypes,
        label: String,
        placeholder: String,
        value: String,
        defaultValue: String,
        error: String,
        helperText: String,
        disabled: Boolean,
        readOnly: Boolean,
        required: Boolean,
        maxLength: Number,
        onChange: Function,
        onBlur: Function,
        onFocus: Function,
    },
    shadow: 'open',
})

// ─── <cl-numberbox> ──────────────────────────────────────────────────────────
const CLNumberBox = r2wc(NumberBox, {
    props: {
        ...basePropTypes,
        label: String,
        placeholder: String,
        value: Number,
        min: Number,
        max: Number,
        step: Number,
        error: String,
        helperText: String,
        disabled: Boolean,
        readOnly: Boolean,
        required: Boolean,
        onChange: Function,
    },
    shadow: 'open',
})

// ─── <cl-select> ─────────────────────────────────────────────────────────────
const CLSelect = r2wc(Select, {
    props: {
        ...basePropTypes,
        label: String,
        options: Array,  // SelectOption[]
        value: String,
        placeholder: String,
        error: String,
        helperText: String,
        disabled: Boolean,
        required: Boolean,
        onChange: Function,
    },
    shadow: 'open',
})

// ─── <cl-textarea> ───────────────────────────────────────────────────────────
const CLTextArea = r2wc(TextArea, {
    props: {
        ...basePropTypes,
        label: String,
        placeholder: String,
        value: String,
        defaultValue: String,
        rows: Number,
        resize: String,  // 'none' | 'vertical' | 'horizontal' | 'both'
        showCount: Boolean,
        error: String,
        helperText: String,
        disabled: Boolean,
        readOnly: Boolean,
        required: Boolean,
        maxLength: Number,
        onChange: Function,
    },
    shadow: 'open',
})

// ─── <cl-list> ───────────────────────────────────────────────────────────────
const CLList = r2wc(List, {
    props: {
        ...basePropTypes,
        items: Array,   // ListItem[]
        variant: String,  // 'unordered' | 'ordered' | 'descriptive'
        selectable: Boolean,
        selectedId: String,
        dividers: Boolean,
        compact: Boolean,
        onSelect: Function,
    },
    shadow: 'open',
})

// ─── Register custom elements ─────────────────────────────────────────────────
// Guard against double-registration (e.g. if bundle is loaded twice)
function define(tag: string, ctor: CustomElementConstructor) {
    if (!customElements.get(tag)) {
        customElements.define(tag, ctor)
    }
}

define('cl-button', CLButton)
define('cl-textbox', CLTextBox)
define('cl-numberbox', CLNumberBox)
define('cl-select', CLSelect)
define('cl-textarea', CLTextArea)
define('cl-list', CLList)

// Re-export the constructors for programmatic use (e.g. Angular ViewChild)
export { CLButton, CLTextBox, CLNumberBox, CLSelect, CLTextArea, CLList }
