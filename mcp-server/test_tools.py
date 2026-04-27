"""Quick smoke test for MCP tool functions (no server started)."""
import sys
import os

# Run from workspace root
os.chdir(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

# Patch FastMCP.run to a no-op so importing main.py does not block
from mcp.server.fastmcp import FastMCP as _FastMCP
_FastMCP.run = lambda self, **kw: None  # type: ignore[method-assign]

import main  # noqa: E402 — must come after patch

PASS = "\033[32mPASS\033[0m"
FAIL = "\033[31mFAIL\033[0m"
errors = 0


def check(label: str, condition: bool, detail: str = "") -> None:
    global errors
    if condition:
        print(f"  {PASS}  {label}")
    else:
        print(f"  {FAIL}  {label}{': ' + detail if detail else ''}")
        errors += 1


print("\n=== list_components ===")
components = main.list_components()
check("returns 6 components", len(components) == 6, str(len(components)))
names = [c["name"] for c in components]
for expected in ["Button", "TextBox", "NumberBox", "Select", "TextArea", "List"]:
    check(f"  includes {expected}", expected in names)

print("\n=== get_component_props ===")
for comp in ["button", "TextBox", "SELECT"]:
    props = main.get_component_props(comp)
    check(f"props for {comp} is a list", isinstance(props, list))
    check(f"props for {comp} is non-empty", len(props) > 0, str(len(props)))

try:
    main.get_component_props("nonexistent")
    check("raises ValueError for unknown component", False)
except ValueError:
    check("raises ValueError for unknown component", True)

print("\n=== get_component_snippet ===")
react_snippet = main.get_component_snippet("Button", "react")
check("React snippet for Button is a string", isinstance(react_snippet, str))
check("React snippet contains import", "import" in react_snippet)

wc_snippet = main.get_component_snippet("select", "webcomponent")
check("WC snippet for Select is a string", isinstance(wc_snippet, str))
check("WC snippet contains cl-select", "cl-select" in wc_snippet)

try:
    main.get_component_snippet("Button", "vue")  # type: ignore[arg-type]
    check("raises ValueError for unknown flavor", False)
except ValueError:
    check("raises ValueError for unknown flavor", True)

print("\n=== get_design_tokens ===")
all_tokens = main.get_design_tokens()
check("all tokens returns dict", isinstance(all_tokens, dict))
check("all tokens has color key", "color" in all_tokens)

color_tokens = main.get_design_tokens("color")
check("color category returns dict with color key", "color" in color_tokens)
check("color primary token present", "primary" in color_tokens["color"])

spacing = main.get_design_tokens("spacing")
check("spacing category present", "spacing" in spacing)

try:
    main.get_design_tokens("nonexistent")  # type: ignore[arg-type]
    check("raises ValueError for unknown category", False)
except ValueError:
    check("raises ValueError for unknown category", True)

print(f"\n{'All tests passed!' if errors == 0 else f'{errors} test(s) FAILED'}\n")
sys.exit(0 if errors == 0 else 1)
