#!/usr/bin/env python
from subprocess import call
import os
import sys

rootPath = os.path.realpath( os.path.dirname(sys.argv[0]))

call( ["twistd", "-n", "web", "--path", rootPath] )
