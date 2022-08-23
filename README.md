<html lang="eng">
<div>
    <h1 style="line-height: 2px">Electronic Voting and Web3</h1>
    <h2>Developing a decentralized e-voting system using blockchain technology</h2>
    <h5>by Nils Boehm</h5>
</div>
</html>

### Thesis

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
