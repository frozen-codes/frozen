"""
This type stub file was generated by pyright.
"""

from prompt_toolkit.key_binding import KeyPressEvent

"""
Utilities function for keybinding with prompt toolkit.

This will be bound to specific key press and filter modes,
like whether we are in edit mode, and whether the completer is open.
"""
def parenthesis(event: KeyPressEvent): # -> None:
    """Auto-close parenthesis"""
    ...

def brackets(event: KeyPressEvent): # -> None:
    """Auto-close brackets"""
    ...

def braces(event: KeyPressEvent): # -> None:
    """Auto-close braces"""
    ...

def double_quote(event: KeyPressEvent): # -> None:
    """Auto-close double quotes"""
    ...

def single_quote(event: KeyPressEvent): # -> None:
    """Auto-close single quotes"""
    ...

def docstring_double_quotes(event: KeyPressEvent): # -> None:
    """Auto-close docstring (double quotes)"""
    ...

def docstring_single_quotes(event: KeyPressEvent): # -> None:
    """Auto-close docstring (single quotes)"""
    ...

def raw_string_parenthesis(event: KeyPressEvent): # -> None:
    """Auto-close parenthesis in raw strings"""
    ...

def raw_string_bracket(event: KeyPressEvent): # -> None:
    """Auto-close bracker in raw strings"""
    ...

def raw_string_braces(event: KeyPressEvent): # -> None:
    """Auto-close braces in raw strings"""
    ...

def skip_over(event: KeyPressEvent): # -> None:
    """Skip over automatically added parenthesis/quote.

    (rather than adding another parenthesis/quote)"""
    ...

def delete_pair(event: KeyPressEvent): # -> None:
    """Delete auto-closed parenthesis"""
    ...

auto_match_parens = ...
auto_match_parens_raw_string = ...
