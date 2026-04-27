# Phase 7 — Python MCP Server

## Goal

Build a **Python FastMCP server** that exposes the CL Component Library to GitHub Copilot Chat in VS Code via the Model Context Protocol. Developers can ask Copilot questions about components, props, snippets, and design tokens — answered in real-time from the library's own source of truth.

---

## What was built

| Artifact            | Path                                               |
| ------------------- | -------------------------------------------------- |
| Server entry point  | `mcp-server/main.py`                               |
| Requirements        | `mcp-server/requirements.txt`                      |
| Smoke test          | `mcp-server/test_tools.py`                         |
| Virtual environment | `mcp-server/.venv/`                                |
| Component manifests | `mcp-server/components/manifests/*.json` (6 files) |
| VS Code config      | `.vscode/mcp.json`                                 |

---

## 7.1 What is MCP?

The **Model Context Protocol (MCP)** is an open standard by Anthropic that lets AI assistants call structured tools provided by a local or remote server. The server exposes tools (functions with typed arguments and return values); the AI calls them during a conversation to retrieve grounded, structured data.

VS Code 1.99+ has built-in MCP client support. When a server is registered in `.vscode/mcp.json`, the Copilot Chat agent can invoke any of its tools without any special user syntax.

### Communication flow

```
VS Code Copilot Chat
      │
      │  stdio (JSON-RPC messages)
      ▼
mcp-server/main.py (FastMCP server)
      │
      ├── reads  mcp-server/components/manifests/*.json
      └── reads  packages/tokens/dist/tokens.json
```

The server communicates over **stdin/stdout** — VS Code spawns the server process and writes JSON-RPC requests to its stdin; the server writes responses to stdout.

---

## 7.2 FastMCP framework

`mcp.server.fastmcp.FastMCP` is the high-level Python SDK that wraps the raw MCP JSON-RPC protocol. It exposes a decorator-based API similar to FastAPI:

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP(name="cl-components", instructions="...")

@mcp.tool()
def my_tool(arg: str) -> list[dict]:
    """Tool docstring becomes the tool description visible to the AI."""
    return [{"result": arg}]

mcp.run(transport="stdio")
```

- **`@mcp.tool()`** — registers the function as an MCP tool. The function's docstring becomes the tool description. Argument types and return type are reflected from Python type annotations.
- **`mcp.run(transport="stdio")`** — starts the blocking event loop. The process waits indefinitely on stdin for JSON-RPC messages.

---

## 7.3 Path resolution

```python
_SERVER_DIR    = Path(__file__).parent          # mcp-server/
_WORKSPACE_ROOT = _SERVER_DIR.parent            # c:\ComponentLiabery\
_MANIFESTS_DIR  = _SERVER_DIR / "components" / "manifests"
_TOKENS_FILE    = _WORKSPACE_ROOT / "packages" / "tokens" / "dist" / "tokens.json"
```

Using `Path(__file__).parent` makes path resolution portable: the server works correctly regardless of the working directory, as long as VS Code sets `cwd: "${workspaceFolder}"` in `mcp.json`.

---

## 7.4 Component manifests

Each component has a JSON manifest file that is the data source for the MCP tools:

```json
{
  "name": "Button",
  "tag": "cl-button",
  "description": "Triggers actions and events...",
  "props": [
    {
      "name": "variant",
      "type": "'primary' | 'secondary' | 'ghost' | 'danger'",
      "default": "'primary'",
      "description": "Visual style variant"
    }
  ],
  "snippets": {
    "react": "import { Button } from '@cl/react';\n\n<Button variant=\"primary\" label=\"Save\" />",
    "webcomponent": "<cl-button label=\"Save\" variant=\"primary\"></cl-button>"
  }
}
```

**Why manifests instead of parsing TypeScript source?**

- Zero dependency on TypeScript compiler toolchain from Python.
- Manifests can be edited by a designer or product manager who doesn't know TypeScript.
- The snippet examples in manifests are curated by hand — the author controls exactly what Copilot shows.
- Manifests can include descriptions richer than what TypeScript JSDoc alone provides.

---

## 7.5 The four MCP tools

### `list_components()`

```python
@mcp.tool()
def list_components() -> list[dict]:
    result = []
    for manifest_path in sorted(_MANIFESTS_DIR.glob("*.json")):
        data = json.loads(manifest_path.read_text(encoding="utf-8"))
        result.append({
            "name": data["name"],
            "tag": data["tag"],
            "description": data["description"],
        })
    return result
```

Scans all `*.json` files in the manifests directory and returns a summary array. **Dynamic discovery** — adding a new manifest file automatically makes the component visible to Copilot without any code change.

---

### `get_component_props(component: str)`

```python
@mcp.tool()
def get_component_props(component: str) -> list[dict]:
    manifest = _load_manifest(component)
    return manifest["props"]
```

`_load_manifest()` normalises the name to lowercase before constructing the path, so `"Button"`, `"BUTTON"`, and `"button"` all resolve to `button.json`.

```python
def _load_manifest(name: str) -> dict:
    path = _MANIFESTS_DIR / f"{name.lower()}.json"
    if not path.exists():
        available = [p.stem for p in _MANIFESTS_DIR.glob("*.json")]
        raise ValueError(f"Component '{name}' not found. Available: {', '.join(available)}")
    return json.loads(path.read_text(encoding="utf-8"))
```

The `ValueError` message includes the list of valid component names, so if Copilot uses a wrong name it immediately knows what is available.

---

### `get_component_snippet(component: str, flavor: Literal["react", "webcomponent"] = "react")`

```python
@mcp.tool()
def get_component_snippet(
    component: str,
    flavor: Literal["react", "webcomponent"] = "react",
) -> str:
    manifest = _load_manifest(component)
    snippets = manifest.get("snippets", {})
    if flavor not in snippets:
        raise ValueError(
            f"No '{flavor}' snippet for {component}. Available: {list(snippets.keys())}"
        )
    return snippets[flavor]
```

The `Literal["react", "webcomponent"]` type annotation is reflected by FastMCP into the tool schema. The AI sees that only those two values are valid for `flavor`.

---

### `get_design_tokens(category: str | None = None)`

```python
@mcp.tool()
def get_design_tokens(
    category: Literal["color", "spacing", "font", "radius", "shadow", "transition", "z-index"] | None = None,
) -> dict:
    tokens = _load_tokens()
    if category is None:
        return tokens
    # tokens.json has a top-level "cl" key from Style Dictionary prefix
    inner = tokens.get("cl", tokens)
    if category not in inner:
        available = list(inner.keys())
        raise ValueError(f"Unknown token category '{category}'. Available: {available}")
    return {category: inner[category]}
```

The `tokens.json` output from Style Dictionary v5 with `prefix: "cl"` has a nested structure: `{ "cl": { "color": { "primary": { "value": "#4f81f5" } } } }`. The tool peels off the `"cl"` wrapper so callers get a flat `{ "color": { ... } }` response.

---

## 7.6 VS Code registration: `.vscode/mcp.json`

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

- **`type: "stdio"`** — VS Code spawns the process and communicates via stdin/stdout.
- **`command`** — uses the venv Python interpreter directly. No `python` on PATH required.
- **`${workspaceFolder}`** — VS Code substitutes this with the absolute path to the workspace root at runtime.
- **`cwd: "${workspaceFolder}"`** — ensures `Path(__file__).parent.parent` resolves to the workspace root correctly.

> **Windows path**: `Scripts/python` (not `bin/python`). On macOS/Linux this would be `.venv/bin/python`.

---

## 7.7 Startup behaviour

The server is a **blocking stdio process**. When VS Code starts it:

1. The process starts and FastMCP initialises the tool registry.
2. `mcp.run(transport="stdio")` blocks, waiting for JSON-RPC messages on stdin.
3. When Copilot Chat sends a tool call request, FastMCP deserialises it, calls the Python function, serialises the result, and writes it to stdout.
4. The process runs for the entire VS Code session. When VS Code closes, the process is terminated.

Because the server blocks on stdio, running it directly in a terminal (`python main.py`) makes it appear to hang. This is **correct behaviour** — it is waiting for a client to connect. Use `py_compile` to syntax-check the server, and `test_tools.py` to test the tool functions, both without starting the server.

---

## 7.8 Offline test suite: `test_tools.py`

```python
# Patch FastMCP.run to a no-op so importing main.py does not block
from mcp.server.fastmcp import FastMCP as _FastMCP
_FastMCP.run = lambda self, **kw: None

import main
```

By monkey-patching `FastMCP.run` before importing `main`, the test file can call the tool functions directly as regular Python functions without starting the server.

The test file covers:

- `list_components` — returns exactly 6 components with correct names.
- `get_component_props` — case-insensitive name lookup, non-empty prop list, `ValueError` for unknown component.
- `get_component_snippet` — React and web component flavors, `ValueError` for unknown flavor.
- `get_design_tokens` — all tokens, filtered by category, `ValueError` for unknown category.

All 24 assertions pass.

---

## 7.9 Extending the server

### Adding a new component

1. Create `mcp-server/components/manifests/{name}.json` following the existing schema.
2. No changes to `main.py` are needed — `list_components` and the manifest loader discover files dynamically.
3. Run `python mcp-server/test_tools.py` to verify.

### Adding a new tool

1. Define a new Python function decorated with `@mcp.tool()`.
2. Write a detailed docstring — Copilot Chat uses this to decide when to invoke the tool.
3. Annotate arguments with Python types; FastMCP reflects them into the tool schema.
4. Add a corresponding test case in `test_tools.py`.
