.. sequencelogo.js documentation master file, created by
   sphinx-quickstart on Fri Oct 13 10:45:18 2017.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to sequencelogo.js
==========================

sequencelogo.js is a small and simple Javascript library for visualizing
sequence logos within a web page. The user provides a PSSM of a biological
sequence (either nucleic acid or peptide) and the library will automatically
render the motif logo in an HTML5 canvas element using the provided rendering
options.

The example below was used to generate the project's logo image:

.. sourcecode:: html

      <div id="motif1"></div>
      <script src="seqlogo.js"></script>
      <script>
        function initCanvas() {
          var pssm = {
            alphabet: ['A', 'G', 'C', 'T'],
            values: [
                [ 0, 0, 0.888889, 0.111111 ],
                [ 0.722222, 0, 0.277778, 0 ],
                [ 0, 0.833333, 0, 0.166667 ],
                [ 0.166667, 0.5, 0.277778, 0.055556 ],
                [ 0.232532, 0.073023, 0.684134, 0.01031 ],
                [ 0.454755, 0.017468, 0.350801, 0.176977 ],
                [ 0.121421, 0.628579, 0.017468, 0.232532 ],
                [ 0.51031, 0.073023, 0.184134, 0.232532 ],
                [ 0, 0.055556, 0, 0.944444 ],
                [ 0, 0, 0.555556, 0.444444 ],
                [ 0.277778, 0.666667, 0, 0.055556 ],
                [ 0, 0.833333, 0, 0.166667 ]
            ]
        };
        var options = {
          width: 400,
          height: 200,
          style: {
             width: 400, height: 200,
             font: '20pt Helvetica'
          }
        };
        seqlogo.makeLogo('motif1', pssm, options);
      }
    </script>


.. toctree::
   :maxdepth: 2
   :caption: Contents:

   How to use sequencelogo.js <howtouse>
