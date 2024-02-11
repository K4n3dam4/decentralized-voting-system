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
- **[Credits](#credits)**

## Introduction

The primary objective of this project is to create a decentralized electronic voting system, advancing the study of blockchain-based voting mechanisms. This system could serve as a reference for countries interested in adopting technologies that offer enhanced security, transparency, and cost efficiency for elections, while preserving voter anonymity. The research is conducted as part of a bachelor's dissertation.

## Thesis

The `docs/` directory contains all research and the thesis derived from it. The thesis is written in
[TeX](https://tug.org/begin.html) format and can be compiled by following the setup instructions below.
A Tex distribution needs to be installed on your system.

### Compiling

```shell
# code snippets are generated with minted, so the following pip packages need to be installed
# on your system:
# - jsx-lexer
# - pygments-lexer-solidity
# - Pygments
pip install jsx-lexer pygments-lexer-solidity

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

The workspace utilizes a [nx monorepo](https://nx.dev/) structure, dividing the project into modular applications that share code with each other. This modular design was selected to facilitate future expansions of the project. Nx offers an expanding ecosystem of plugins, and its command-line interface simplifies the creation of new applications within the repository by providing a comprehensive selection of boilerplate code.

#### Dependency Graph

The dependency graph can be opened in the browser by executing nx graph at the project's root. This command offers a concise visualization of all the applications within the repository and illustrates their interconnections.

#### NX Documentation

[Documentation](https://nx.dev/getting-started/intro)

### Frontend

#### Next.js

[Next.js](https://nextjs.org) was chosen as a frontend framework mainly for its hybrid static and server rendering capabilities.

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

[Polygon](https://polygon.technology/) was selected for deploying smart contracts primarily because of its superior transaction throughput. As a Layer 2 protocol that operates atop Ethereum, Polygon represents a well-balanced choice in terms of security versus scalability. Moreover, transitioning the voting system from the MATIC Mainnet to Ethereum will be straightforward once Sharding enhances Ethereum's scalability. A migration will involve merely adjusting network settings and redeploying all the developed contracts on Ethereum's Mainnet.

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

## Credits

Special thanks and credits go out to the following persons and or organizations.

### Chakra Templates

Since the development of a pretty user interface was not one of the main priorities of this project in some instances templates were used for inspiration and partly adapted to the project's codebase.

- [Navbar](https://chakra-templates.dev/templates/navigation/navbar/withDarkModeSwitcher)
- [Landing page](https://chakra-templates.dev/templates/forms/authentication/joinOurTeam)
