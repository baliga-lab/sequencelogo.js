ISB Logo - simple sequence logo visualization in Javascript
===========================================================                                                                   

## Description

This is a simple Javascript library that renders a sequence
logo into an HTML canvas element, given a PSSM.

## Usage

    isblogo.makeLogo(id, pssm, options);

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

    isblogo.makeLogo('mylogo',
                     {
                       alphabet: ['A', 'G', 'C', 'T'],
                       values: [[0.0, 0.1, 0.8, 0.1],
                                ...]
                     },
                     {
                       width: 100, height: 100,
                       glyphStyle: '20pt Helvetica'
                     });
