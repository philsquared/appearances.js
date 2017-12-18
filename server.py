#!/usr/bin/env python
from subprocess import call
call( ["twistd", "-n", "web", "--path", "/Development/Projects/appearances.js"] )
