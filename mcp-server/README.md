# CL Component Library — MCP Server

The MCP (Model Context Protocol) server exposes the CL Component Library to **GitHub Copilot Chat** inside VS Code. Once registered, you can ask Copilot about any component, its props, usage snippets, and design tokens without leaving your editor.

---

## What is MCP?

The [Model Context Protocol](https://modelcontextprotocol.io/) is an open standard that lets AI assistants call structured tools defined by a local or remote server. VS Code 1.99+ has built-in MCP support — the AI can invoke your server's tools as part of a conversation.

---

## Prerequisites

| Requirement                   | Version |
| ----------------------------- | ------- |
| Python                        | 3.10 +  |
| VS Code                       | 1.99 +  |
| GitHub Copilot Chat extension | Latest  |

---

## Quick setup

### 1 — Create the virtual environment

Run these commands from the **workspace root** (`c:\ComponentLiabery`):

```powershell
cd mcp-server
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
```

### 2 — Verify the install

```powershell
.venv\Scripts\python -c "from mcp.server.fastmcp import FastMCP; print('OK')"
# Expected output: OK
```

### 3 — Register in VS Code

The file `.vscode/mcp.json` is already committed to this workspace:

```json
{
  "servers": {
    "cl-components": {
      "type": "stdio",
      "command": "${workspaceFolder}/mcp-server/.venv/Scripts/python",
      "args": ["${workspaceFolder}/mcp-server/main.py"],
      "cwd": "${workspaceFolder}"
    }
  }
}
```

VS Code reads this file automatically when you open `c:\ComponentLiabery` as the workspace root.

### 4 — Start the server

Open the Command Palette (`Ctrl + Shift + P`) and run:

```
MCP: Start Server
```

Select **cl-components** from the list. The status bar will show the server as running.

---

## Using the tools in Copilot Chat

Open Copilot Chat (`Ctrl + Alt + I`) and type your question. You do not need any special syntax — Copilot will call the right tool automatically.

### Example prompts

```
List all CL components.
```

```
What props does the Select component accept?
```

```
Show me a React snippet for the Button component.
```

```
Give me a Web Component snippet for TextArea.
```

```
What design tokens does the library expose?
```

```
Show me the color tokens only.
```

---

## Available tools

| Tool                    | Description                                                                   |
| ----------------------- | ----------------------------------------------------------------------------- |
| `list_components`       | Returns all 6 components with name, custom-element tag, and description       |
| `get_component_props`   | Full prop schema (name, type, default, description) for a named component     |
| `get_component_snippet` | React or Web Component code snippet for a named component                     |
| `get_design_tokens`     | All design tokens, or filtered by category (`color`, `spacing`, `font`, etc.) |

---

## Tool reference

### `list_components`

Returns an array of component summaries:

```json
[
  { "name": "Button", "tag": "cl-button", "description": "Triggers actions…" },
  {
    "name": "TextBox",
    "tag": "cl-textbox",
    "description": "Single-line text input…"
  },
  {
    "name": "NumberBox",
    "tag": "cl-numberbox",
    "description": "Numeric input…"
  },
  { "name": "Select", "tag": "cl-select", "description": "Dropdown select…" },
  {
    "name": "TextArea",
    "tag": "cl-textarea",
    "description": "Multi-line textarea…"
  },
  { "name": "List", "tag": "cl-list", "description": "Ordered/unordered list…" }
]
```

---

### `get_component_props(name)`

| Parameter | Type   | Required | Example    |
| --------- | ------ | -------- | ---------- |
| `name`    | string | Yes      | `"Button"` |

Name matching is **case-insensitive** (`button`, `BUTTON`, and `Button` all work).

Returns an array of prop objects:

```json
[
  { "name": "variant", "type": "'primary' | 'secondary' | 'ghost' | 'danger'", "default": "'primary'", "description": "Visual style variant" },
  ...
]
```

---

### `get_component_snippet(name, flavor)`

| Parameter | Type                          | Required | Default   |
| --------- | ----------------------------- | -------- | --------- |
| `name`    | string                        | Yes      | —         |
| `flavor`  | `"react"` \| `"webcomponent"` | No       | `"react"` |

Returns a code string ready to paste into your project.

---

### `get_design_tokens(category?)`

| Parameter  | Type   | Required | Options                                                                 |
| ---------- | ------ | -------- | ----------------------------------------------------------------------- |
| `category` | string | No       | `color`, `spacing`, `font`, `radius`, `shadow`, `transition`, `z-index` |

When called with no arguments, returns all tokens. When a category is given, returns only that branch of the token tree.

---

## Directory structure

```
mcp-server/
├── main.py                     # FastMCP server — 4 tool definitions
├── requirements.txt            # mcp>=1.0.0
├── test_tools.py               # Offline smoke test (no server needed)
├── .venv/                      # Python virtual environment (not committed)
└── components/
    └── manifests/
        ├── button.json         # Props + snippets for Button
        ├── textbox.json
        ├── numberbox.json
        ├── select.json
        ├── textarea.json
        └── list.json
```

---

## Troubleshooting

### "Server not found" in VS Code

- Make sure you opened `c:\ComponentLiabery` as the workspace root (not a subfolder).
- Check that `.vscode/mcp.json` exists and is valid JSON.

### Python not found

Ensure the venv was created in `mcp-server/.venv/`:

```powershell
Test-Path mcp-server\.venv\Scripts\python.exe
# Expected: True
```

### `mcp` package not installed

```powershell
cd mcp-server
.venv\Scripts\pip install -r requirements.txt
```

### Server crashes on startup

Run the syntax check:

```powershell
cd c:\ComponentLiabery
mcp-server\.venv\Scripts\python.exe -m py_compile mcp-server\main.py
```

Run the full tool smoke test:

```powershell
mcp-server\.venv\Scripts\python.exe mcp-server\test_tools.py
```

### Token file not found

The design-tokens tool reads `packages/tokens/dist/tokens.json`. If it's missing, rebuild tokens:

```powershell
pnpm --filter @cl/tokens build
```

---

## Adding a new component

1. Create `mcp-server/components/manifests/{name}.json` following the existing schema.
2. The server loads manifests dynamically — no code change in `main.py` is needed.
3. Re-run `test_tools.py` to verify.
