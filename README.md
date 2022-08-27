<html lang="eng">
<div>
    <h1 style="line-height: 2px">Electronic Voting and Web3</h1>
    <h2>Developing a decentralized e-voting system using blockchain technology</h2>
    <h5>by Nils Boehm</h5>
</div>
</html>

## Contents

- **[Introduction](#introduction)**
- **[Thesis](#thesis)**
  - [Compiling](#compiling)
- **[Application](#application)**

## Introduction

The main goal of this project is the development of a decentralized electronic voting system to
further the research into voting systems based on blockchain technology, which nations could ultimately refer to should they
want to explore possibilities to ensure more secure, transparent, and cost-efficient elections without having to sacrifice the anonymity of voters.
The research is carried out within the scope of a bachelor's dissertation.

## Thesis

The `docs/` directory contains all research and the thesis derived from it. The thesis is written in
[TeX](https://tug.org/begin.html) format and can be compiled by following the setup instructions below.
A [TeX](https://tug.org/begin.html) distribution needs to be installed on your system.

### Compiling

```shell
# project root
cd docs

# use the xml files in ./idea/runConfiguration to compile the document
# 1. run Initial_Document.xml
# 2. run Document.xml

# alternatively, you can compile it yourself via the terminal
# use lualatex
lualatex --output-dir=out main.tex
# or xelatex
xelatex -output-directory=out main.tex

# to compile main document
# compile bibliography and glossaries
biber --output-directory out main
makeglossaries -d out main

# rerun latex compiler
lualatex --output-dir=out main.tex
# or
xelatex -output-directory=out main.tex
```

## Application
