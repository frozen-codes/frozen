from _typeshed import Incomplete
from collections.abc import Generator

from corus.record import Record

class GareevToken(Record):
    __attributes__: Incomplete
    text: Incomplete
    tag: Incomplete
    def __init__(self, text, tag) -> None: ...

class GareevRecord(Record):
    __attributes__: Incomplete
    tokens: Incomplete
    def __init__(self, tokens) -> None: ...

def parse_conll(lines) -> Generator[Incomplete]: ...
def parse_gareev(lines): ...
def load_id(id, dir): ...
def list_ids(dir) -> Generator[Incomplete]: ...
def load_gareev(dir) -> Generator[Incomplete]: ...
