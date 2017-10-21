How to use sequencelogo.js
==========================

In order to use ``sequencelogo.js`` in your own web pages, simply include
it using the ``script`` tag::

  <script src="seqlogo.js"></script>

NPM users can use install the package like this:

.. highlight:: none

::
   
   npm install --save @baliga-lab/sequencelogo.js

Then use a script section to turn a div into a sequence logo view::

  <div id="motif1"></div>
  <script>
    seqlogo.makeLogo('motif1',
                     {
                       alphabet: ['A', 'G', 'C', 'T'],
                       values: [
                         [ 0, 0, 0.888889, 0.111111 ],
                         [ 0.722222, 0, 0.277778, 0 ],
                         ...
                       ]
                     },
                     {
                        width: 400, height: 200
                     });
  </script>

In general, you render a logo by calling ``seqlogo.makeLogo(id, pssm, options)``.
The ``pssm`` argument is simply a Javascript option that defines an ``alphabet`` and
a ``values`` array, which is an array of rows where each row is a score for each
letter in the alphabet (currently, nucleic acids and peptides are supported).

The ``options`` parameter currently allows for the following fields:

  * **width:** the internal width the view is rendered with
  * **height:** the internal height the view is rendered with
  * **style:** this allows the user to define the style that the view is represented
    within the web page. This also allows to define the element in terms of CSS
    definitions. The following fields are available:

    * **width:** the width of the element
    * **height:** the width of the element
    * **font:** the font attribute of the element
