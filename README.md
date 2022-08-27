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
- **[Architecture](#architecture)**
  - [Workspace](#workspace)
  - [Frontend](#frontend)
  - [Backend](#backend)
    - [Prisma](#prisma)
    - [Nest.js](#nestjs)
- **[Blockchain](#blockchain)**

## Introduction

The main goal of this project is the development of a decentralized electronic voting system to
further the research into voting systems based on blockchain technology, which nations could ultimately refer to should they
want to explore possibilities to ensure more secure, transparent, and cost-efficient elections without having to sacrifice the anonymity of voters.
The research is carried out within the scope of a bachelor's dissertation.

## Thesis

The `docs/` directory contains all research and the thesis derived from it. The thesis is written in
[TeX](https://tug.org/begin.html) format and can be compiled by following the setup instructions below.
A Tex distribution needs to be installed on your system.

### Compiling

```shell
# project root
cd docs

# use the xml files located in .run/ to compile the document
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

## Architecture

This chapter provides a quick overview over the projects architecture.

### Workspace

The workspace is a [nx monorepo](https://nx.dev/), which means that the project is split into modular applications that share code
among themselves. This approach was chosen in order to make this project easily extendable in the future.
Nx provides a growing ecosystem of plugins and its cli makes creating new applications within the repo due to its vast
collection of boilerplate code.

#### Dependency Graph

The dependency graph can be called with `nx graph` in the project root and provides a quick overview of all applications in the repository and their relation to each other.

#### NX Documentation

[Documentation](https://nx.dev/getting-started/intro)

### Frontend

[Next.js](https://nextjs.org) was chosen as a frontend framework mainly for its hybrid static & server rendering capabilities.
Since this means that only static html is being served to the client, a Next.js frontend is one part of ensuring the security of elections carried out using this application.

#### Next.js Documentation

[Documentation](https://nextjs.org/docs/getting-started)

### Backend

#### Prisma

#### Nest.js

### Blockchain
