---
id: mcp-server
title: MCP Server Setup
sidebar_position: 8
---

# MCP Server Setup

The CL Component Library includes a Python MCP (Model Context Protocol) server that integrates with **VS Code + GitHub Copilot Chat**. Once configured, Copilot can answer questions about available components, their props, code snippets, and design tokens.

## Prerequisites

- Python 3.11+
- VS Code with the GitHub Copilot Chat extension

## Installation

```bash
cd c:\ComponentLiabery\mcp-server
python -m venv .venv
.venv\Scripts\activate    # Windows
pip install mcp
```

## VS Code Configuration

Add the server to `.vscode/mcp.json` in your project root:

```json
{
  "servers": {
    "cl-components": {
      "type": "stdio",
      "command": "python",
      "args": ["mcp-server/main.py"],
      "cwd": "${workspaceFolder}"
    }
  }
}
```

## Available Tools

| Tool                    | Inputs                                                                    | Description                                              |
| ----------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------- |
| `list_components`       | —                                                                         | Returns all 6 components with name, tag, and description |
| `get_component_props`   | `component: str`                                                          | Returns full prop schema for a component                 |
| `get_component_snippet` | `component: str`, `flavor: "react" \| "webcomponent"`                     | Returns a ready-to-use code snippet                      |
| `get_design_tokens`     | `category?: "color" \| "spacing" \| "typography" \| "shadow" \| "radius"` | Returns filtered design token map                        |

## Example Copilot Prompts

Once the MCP server is running, open **Copilot Chat** (⌃⌘I / Ctrl+Alt+I) and try:

```
List all CL components
```

```
What props does cl-button accept?
```

```
Show me a React snippet for cl-select with options
```

```
What are the color design tokens?
```

```
Give me a Web Component snippet for cl-textarea
```

## How It Works

The server is a stdio MCP process. VS Code spawns it on demand and routes tool calls from Copilot Chat:

```
Copilot Chat → VS Code MCP host → stdio → mcp-server/main.py → JSON response
```

- **Component data** comes from `mcp-server/components/manifests/*.json` (one file per component).
- **Token data** is read at runtime from `packages/tokens/dist/tokens.json`.
