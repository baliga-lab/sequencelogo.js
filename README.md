sequencelogo.js - simple sequence logo visualization in Javascript
==================================================================

![Example image](example.png)

## Description

This is a simple Javascript library that renders a sequence logo into an HTML canvas element, given a PSSM.
Advantages:

  * small
  * cross-browser
  * no dependencies on other Javascript libraries
  * renders graphics on the fly
  * default color sets for nucleotide and peptide sequences

## Installation

Simply include the script in your pages with the script tag.

## Node.js/NPM

This library is also available as an npm package:

```
  npm install --save @baliga-lab/sequencelogo.js
```

## Documentation

Official documentation at http://baliga-lab.github.io/sequencelogo.js/

## Usage

    seqlogo.makeLogo(id, pssm, options);

### Parameters


* id: the id of a DOM element. This will be replaced with a canvas element
* pssm: a Javascript object that represents a PSSM. The following format is used:
  * alphabet: list of single character strings
  * values: pssm values, columns correspond to the alphabet characters
* options: a Javascript object containing the following attributes
  * width: canvas width
  * height: canvas height
  * glyphStyle: font used to display the motif characters


### Example

    seqlogo.makeLogo('mylogo',
                     {
                       alphabet: ['A', 'G', 'C', 'T'],
                       values: [[0.0, 0.1, 0.8, 0.1],
                                ...]
                     },
                     {
                       width: 100, height: 100,
                       glyphStyle: '20pt Helvetica'
                     });
