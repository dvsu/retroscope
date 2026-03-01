#!/usr/bin/env python3
"""
Python theme fixture: type hints, f-strings, match/case, async/await, comprehensions, walrus, etc.
"""
# Absolute imports (full path from root)
import sys
import os
import math
import asyncio
from typing import Any, Callable, Generator, Literal, NotRequired, TypeAlias
from enum import Enum
from dataclasses import dataclass
from collections import defaultdict
import pathlib
from pathlib import Path

# Absolute from-import (specific names/objects)
from math import pi, sqrt, cos, sin
from typing import List, Dict, Tuple, Set
from datetime import datetime, timedelta
from functools import lru_cache, wraps

# Relative imports
from .module1 import func1          # Same package
from ..pkg_above import func_above  # Parent package  
from .subpackage.module2 import *   # Relative star (package-aware)
from ...grandparent import *        # Grandparent (3 levels up)

# Import as/aliasing
import numpy as np
from collections.abc import Mapping as MappingType

# Dynamic imports (importlib)
import importlib
lazy_module = importlib.import_module("json")

__all__ = [
    "Point", "Color", "decorated", "match_fixture", "square", "fibonacci",
    "process", "logged", "pi", "Path"
]

# Primitives, type hints, None/ellipsis
num: int = 42
neg: float = -3.14159
s: str = "hello world"
b_true: bool = True
b_false: bool = False
none_val: None = None
ell: Ellipsis = ...
big_int: int = 9007199254740991
bytes_val: bytes = b"bytes"
complex_val: complex = 3 + 4j

# Collections
list_val: list[int] = [1, 2, 3]
tuple_val: tuple[str, int] = ("a", 1)
set_val: set[int] = {1, 2, 3}
dict_val: dict[str, int] = {"a": 1, "b": 2}
defaultdict: collections.defaultdict[str, list[int]] = collections.defaultdict(list)

# Functions with type hints, *args/**kwargs, defaults, -> return
def func(a: int, b: str = "default", *args: int, *, kw_only: bool = True, **kwargs: str) -> tuple[int, str]:
    return (a, b)

async def async_func() -> str:
    await asyncio.sleep(0)
    return "async"

# Lambda with type hints
square: Callable[[int], int] = lambda x: x ** 2

# Decorators
def logged(func: Callable) -> Callable:
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@logged
@staticmethod
def decorated(x: int, y: int) -> int:
    return x + y

# Classes: dataclass, typing.TypedDict, inheritance, properties, slots
@dataclass
class Point:
    x: float
    y: float
    
    @property
    def magnitude(self) -> float:
        return (self.x ** 2 + self.y ** 2) ** 0.5
    
    def __repr__(self) -> str:
        return f"Point({self.x}, {self.y})"
    
    @classmethod
    def from_polar(cls, r: float, theta: float) -> "Point":
        return cls(r * math.cos(theta), r * math.sin(theta))

class SealedPoint(Point):
    __slots__ = ("x", "y")
    
    def sealed_method(self) -> None:
        pass

# Enums
class Color(Enum):
    RED = "red"
    GREEN = 2
    BLUE = 3.14

# TypedDict (Python 3.8+)
class User(TypedDict):
    name: str
    id: int
    email: NotRequired[str]

# Unions, literals, final, override
def process(item: int | str | None) -> Literal["ok", "error"]:
    match item:
        case int() | str():
            return "ok"
        case None:
            return "error"
        case _:
            raise ValueError("invalid")

# Pattern matching (3.10+)
def match_fixture(value: Any) -> str:
    match value:
        case {"name": str(name), **rest}:
            return f"Dict with name={name}"
        case [int(head), *tail]:
            return f"List head={head}"
        case Point(x, y) if x > 0:
            return f"Positive point"
        case Color.RED:
            return "red"
        case _ as unknown:
            return f"Unknown: {unknown}"

# Walrus operator (:=)
if (n := len("hello")) > 3:
    print(f"Length {n} is long")

# Comprehensions
squares: list[int] = [x**2 for x in range(10)]
evens: list[int] = [x for x in range(20) if x % 2 == 0]
dict_comp: dict[str, int] = {str(i): i for i in range(5)}
set_comp: set[int] = {x**2 for x in range(5)}
gen_expr = (x for x in range(1000000))  # generator

# F-strings, raw strings, triple quotes
name: str = "Alice"
f_string: str = f"Hello {name=}, PI={math.pi:.2f}"
raw_f: str = rf"Raw f-string: C:\path\to\{name}"
triple: str = """
Triple quoted
with indentation
"""

# Context managers
with open("nonexistent.txt") as f:
    content = f.read()

# Async context manager
class AsyncCM:
    async def __aenter__(self):
        return self
    async def __aexit__(self, exc_type, exc, tb):
        pass

# Exception handling: try/except/else/finally, match exceptions
try:
    risky()
except ValueError as e:
    print(f"ValueError: {e}")
except (TypeError, KeyError):
    print("Multiple types")
except *RuntimeErrorSubclasses as e:
    print("Multiple subclasses")
else:
    print("No exception")
finally:
    print("Cleanup")

# Control flow
if num > 0:
    print("positive")
elif num < 0:
    print("negative")
else:
    print("zero")

match Color.GREEN:
    case Color.RED:
        print("red")
    case _:
        print("other")

for i in range(3):
    for j in range(3):
        if i == 1 and j == 1:
            break  # No labels in Python!

while num > 0:
    num -= 1

# List/dict unpacking
a, *middle, z = [1, 2, 3, 4, 5]
first, **rest = {"first": 1, "second": 2}

# Type aliases, Final, override (3.11+)
Coord: TypeAlias = tuple[float, float]
AREA: Final[float] = math.pi

class Child(Parent):
    def method(self) -> None:
        super().method()
        print("override")

# Generator function
def fibonacci() -> Generator[int, None, None]:
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# Export-like structure (Python modules)
__all__ = ["Point", "Color", "decorated", "match_fixture"]

if __name__ == "__main__":
    print("Fixture loaded")