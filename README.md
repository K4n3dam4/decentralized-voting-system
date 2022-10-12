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
    - [Next.js](#nextjs)
  - [Backend](#backend)
    - [Prisma](#prisma)
    - [Nest.js](#nestjs)
- **[Blockchain](#blockchain)**
  - [Polygon](#polygon)
- **[Getting started](#getting-started)**
  - [.envs](#envs)
  - [Smart Contracts](#smart-contracts)
  - [Running the application](#running-the-application)

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
# code snippets are generated with minted, so the following pip packages need to be installed
# on your system:
# - jsx-lexer
# - Pygments
pip install jsx-lexer

# pip will install Pygments alongside jsx-lexer if it isn't installed, yet

# use the xml files located in .run/ to compile the document
# 1. run Initial_Document.xml
# 2. run Document.xml

# alternatively, you can compile it yourself via the terminal
# navigate to docs directory
cd docs
# use lualatex
lualatex -shell-escape --output-dir=out main.tex
# or xelatex
xelatex -shell-escape -output-directory=out main.tex

# to compile main document
# compile bibliography and glossaries
biber --output-directory out main
makeglossaries -d out main

# rerun latex compiler
lualatex -shell-escape --output-dir=out main.tex
# or
xelatex -shell-escape -output-directory=out main.tex
```

## Architecture

This chapter provides a quick overview over the project's architecture.

### Workspace

The workspace is a [nx monorepo](https://nx.dev/), which means that the project is split into modular applications that share code
among themselves. This approach was chosen in order to make this project easily extendable in the future.
Nx provides a growing ecosystem of plugins and its cli makes creating new applications within the repo easy due to its vast
collection of boilerplate code.

#### Dependency Graph

The dependency graph can be called with `nx graph` in the project root and provides a quick overview of all applications in the repository and their relation to each other.

#### NX Documentation

[Documentation](https://nx.dev/getting-started/intro)

### Frontend

#### Next.js

[Next.js](https://nextjs.org) was chosen as a frontend framework mainly for its hybrid static and server rendering capabilities.
Since this means that only static html is being served to the client, a Next.js frontend is one part of ensuring the security of elections carried out using this application.

#### Next.js Documentation

[Documentation](https://nextjs.org/docs/getting-started)

### Backend

#### Prisma

#### Nest.js

[Nest.js](https://nestjs.com/) is regularly mentioned among the best Node.js backend frameworks. Although Next.js comes with its own routing framework for API calls, using Nest.js
made it easier to follow best practices for backend development. Additionally, by utilizing [nestjs-ethers](https://github.com/blockcoders/nestjs-ethers), communication between the application's services and an arbitrary blockchain network could easily be established.

#### Next.js Documentation

[Documentation](https://docs.nestjs.com/)

## Blockchain

### Polygon

[Polygon](https://polygon.technology/) was chosen to deploy smart contracts mainly due to its higher transaction throughput. Since Polygon is a Layer 2 protocol running on top of Ethereum, this seemed like the most balanced option when looking at security vs. scalability.
Furthermore, migrating the voting system from MATIC Mainnet to Ethereum once Sharding will have improved Ethereum's scalability will be a matter of simply changing network configurations and redeploying all developed contracts on Ethereum's Mainnet.

#### Polygon Documentation

[Documentation](https://wiki.polygon.technology/)

## Getting started

```shell
# install dependencies
yarn install
```

### .envs

Locate example.env files in the project's root directory and rename them:
<br/>

**Production: example.env => .env**<br/>
**Development: example.env.local => .env.local**<br/>
**Test environment: example.env.test => .env.test**<br/>

Add your configurations and secrets.

### Smart Contracts

As the application relies on smart contracts to manage the voting process, you first need to compile and deploy the contracts located in _libs/smart-contracts_

```shell
# compile contracts
yarn compile:contracts

# deploy contracts
yarn deploy:contracts
```

### Running the application

```shell
# start server
yarn serve:server

# start client
yarn serve:client
```
