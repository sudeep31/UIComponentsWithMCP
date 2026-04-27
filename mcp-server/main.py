"""
CL Component Library — MCP Server

Exposes 4 tools to GitHub Copilot Chat via VS Code MCP integration:
  - list_components       → all 6 components with name, tag, description
  - get_component_props   → full prop schema for a named component
  - get_component_snippet → React or Web Component code snippet
  - get_design_tokens     → filtered design token map (all or by category)
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Literal

from mcp.server.fastmcp import FastMCP

# ---------------------------------------------------------------------------
# Paths — relative to the workspace root (cwd when VS Code spawns the server)
# ---------------------------------------------------------------------------

_SERVER_DIR = Path(__file__).parent
_WORKSPACE_ROOT = _SERVER_DIR.parent
_MANIFESTS_DIR = _SERVER_DIR / "components" / "manifests"
_TOKENS_FILE = _WORKSPACE_ROOT / "packages" / "tokens" / "dist" / "tokens.json"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _load_manifest(name: str) -> dict:
    """Load a component manifest by case-insensitive name. Raises ValueError if not found."""
    path = _MANIFESTS_DIR / f"{name.lower()}.json"
    if not path.exists():
        available = [p.stem for p in _MANIFESTS_DIR.glob("*.json")]
        raise ValueError(
            f"Component '{name}' not found. Available: {', '.join(available)}"
        )
    return json.loads(path.read_text(encoding="utf-8"))


def _load_tokens() -> dict:
    """Load the compiled design tokens JSON."""
    if not _TOKENS_FILE.exists():
        raise FileNotFoundError(
            f"tokens.json not found at {_TOKENS_FILE}. "
            "Run `pnpm --filter @cl/tokens build` first."
        )
    return json.loads(_TOKENS_FILE.read_text(encoding="utf-8"))


# ---------------------------------------------------------------------------
# MCP server
# ---------------------------------------------------------------------------

mcp = FastMCP(
    name="cl-components",
    instructions=(
        "You are an assistant for the CL Component Library. "
        "Use list_components to discover available components, "
        "get_component_props to learn about their props, "
        "get_component_snippet to generate ready-to-use code, and "
        "get_design_tokens to retrieve design token values."
    ),
)


@mcp.tool()
def list_components() -> list[dict]:
    """
    List all available CL components.

    Returns a list of objects with name, tag, and description for each component.
    """
    result = []
    for manifest_path in sorted(_MANIFESTS_DIR.glob("*.json")):
        data = json.loads(manifest_path.read_text(encoding="utf-8"))
        result.append({
            "name": data["name"],
            "tag": data["tag"],
            "description": data["description"],
        })
    return result


@mcp.tool()
def get_component_props(component: str) -> list[dict]:
    """
    Return the full prop schema for a CL component.

    Args:
        component: Component name, e.g. "Button", "TextBox", "Select".

    Returns a list of prop objects with name, type, default, and description.
    """
    manifest = _load_manifest(component)
    return manifest["props"]


@mcp.tool()
def get_component_snippet(
    component: str,
    flavor: Literal["react", "webcomponent"] = "react",
) -> str:
    """
    Return a ready-to-use code snippet for a CL component.

    Args:
        component: Component name, e.g. "Button", "TextBox".
        flavor: "react" (default) for a React/TSX snippet,
                "webcomponent" for a plain HTML + Custom Elements snippet.

    Returns the snippet as a string.
    """
    manifest = _load_manifest(component)
    snippets: dict = manifest.get("snippets", {})
    if flavor not in snippets:
        raise ValueError(
            f"No '{flavor}' snippet for {component}. Available: {list(snippets.keys())}"
        )
    return snippets[flavor]


@mcp.tool()
def get_design_tokens(
    category: Literal["color", "spacing", "font", "radius", "shadow", "transition", "z-index"] | None = None,
) -> dict:
    """
    Return CL design tokens, optionally filtered to a single category.

    Args:
        category: Optional filter — one of "color", "spacing", "font",
                  "radius", "shadow", "transition", "z-index".
                  If omitted, all tokens are returned.

    Returns a dict of token names → values.
    """
    tokens = _load_tokens()
    if category is None:
        return tokens
    if category not in tokens:
        raise ValueError(
            f"Category '{category}' not found. Available: {', '.join(tokens.keys())}"
        )
    return {category: tokens[category]}


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    mcp.run(transport="stdio")
