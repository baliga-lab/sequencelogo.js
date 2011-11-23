var isblogo;
if (!isblogo) {
    isblogo = {};
}
(function () {
    "use strict";
    // some default settings
    var MARGIN_LEFT = 20, MARGIN_TOP = 20, MARGIN_RIGHT = 20,
        MARGIN_BOTTOM = 30, DEFAULT_OPTIONS, SVG_NS, GLYPH_COLORS;
    SVG_NS = 'http://www.w3.org/2000/svg';
    GLYPH_COLORS = {
        'A': 'rgb(0, 200, 50)',
        'G': 'rgb(230, 200, 0)',
        'T': 'rgb(255, 0, 0)',
        'C': 'rgb(0, 0, 230)'
    };
    DEFAULT_OPTIONS = {
        type: 'canvas',
        width: 400,
        height: 300,
        glyphStyle: '20pt Helvetica'
    };

    // **********************************************************************
    // ****** Common Functions
    // **********************************************************************

    function rank(arr) {
        var result = [], i;
        for (i = 0; i < arr.length; i += 1) {
            result.push([i, arr[i]]);
        }
        return result.sort(function (a, b) {
            return a[1] - b[1];
        });
    }

    // Generic PSSM drawing function, used for both canvas and SVG
    function drawPSSM(pssm, y0, scaley, drawFun) {
        var x, y, motifPos, size, columnRanks, currentGlyph, row, maxWidth;
        x = MARGIN_LEFT;
        for (motifPos = 0; motifPos < pssm.values.length; motifPos += 1) {
            y = y0;
            columnRanks = rank(pssm.values[motifPos]);
            maxWidth = 0;
            for (row = 0; row < columnRanks.length; row += 1) {
                currentGlyph = pssm.alphabet[columnRanks[row][0]];
                size = drawFun(currentGlyph, x, y, 1.0, columnRanks[row][1] * scaley);
                if (size.width > maxWidth) {
                    maxWidth = size.width;
                }
                y -= (size.height - 2);
            }
            x += maxWidth;
        }
    }

    // **********************************************************************
    // ****** Canvas-based Implementation
    // **********************************************************************

    function currentFontHeight(context) {
        // since canvas has no easy way to determine the
        // height of a text, the width of 'm' is used
        // as a quick and dirty approximation
        return context.measureText('m').width;
    }

    function drawLabelsX(context, startx, y) {
        context.font = '12pt Arial';
        var intervalDistance, x, textHeight, i, label, labelWidth, transx, transy;
        intervalDistance = 20;
        x = startx;
        textHeight = currentFontHeight(context);

        for (i = 10; i < 150; i += 10) {
            context.save();
            label = i.toString();
            labelWidth = context.measureText(label).width;
            transx = x + labelWidth / 2.0;
            transy = y - textHeight / 2.0;
            context.translate(transx, transy);
            context.rotate(-Math.PI / 2);
            context.translate(-transx, -transy);
            context.fillText(label, x, y);
            x += intervalDistance;
            context.restore();
        }
    }

    function drawLabelsY(context, x, y) {
        var i, label;
        context.font = '12pt Arial';
        for (i = 1; i <= 8; i += 1) {
            label = i.toString();
            context.fillText(label, x, y);
            y -= 20;
        }
    }

    function drawScale(canvas) {
        var context, right, bottom;
        context = canvas.getContext('2d');
        right = canvas.width - MARGIN_RIGHT;
        bottom = canvas.height - MARGIN_BOTTOM;

        drawLabelsX(context, MARGIN_LEFT, canvas.height);
        drawLabelsY(context, 0, bottom);
        context.beginPath();
        context.moveTo(MARGIN_LEFT, MARGIN_TOP);
        context.lineTo(MARGIN_LEFT, bottom);
        context.lineTo(right, bottom);
        context.stroke();
    }

    function drawGlyph(context, glyph, x, y, scalex, scaley) {
        var glyphWidth, glyphHeight;
        glyphWidth = context.measureText(glyph).width * scalex;
        glyphHeight = currentFontHeight(context) * scaley;

        context.save();
        context.translate(x, y);
        context.scale(scalex, scaley);
        context.translate(-x, -y);
        context.fillStyle = GLYPH_COLORS[glyph];
        context.fillText(glyph, x, y);
        context.restore();
        return { width: glyphWidth, height: glyphHeight };
    }

    function drawGlyphs(canvas, options, pssm) {
        var context, maxGlyphHeight, glyphHeight, scaley;
        context = canvas.getContext('2d');
        context.font = options.glyphStyle;
        glyphHeight = currentFontHeight(context);
        maxGlyphHeight = (canvas.height - MARGIN_BOTTOM) - MARGIN_TOP;
        scaley = maxGlyphHeight / glyphHeight;
        drawPSSM(pssm, canvas.height - MARGIN_BOTTOM, scaley,
                 function (currentGlyph, x, y, scalex, scaley) {
                return drawGlyph(context, currentGlyph, x, y, scalex, scaley);
            });
    }

    function makeCanvas(id, options, pssm) {
        var canvas = document.createElement("canvas"), elem;
        canvas.id = id;
        canvas.setAttribute('width', options.width);
        canvas.setAttribute('height', options.height);
        elem = document.getElementById(id);
        elem.parentNode.replaceChild(canvas, elem);
        drawScale(canvas);
        drawGlyphs(canvas, options, pssm);
    }

    // **********************************************************************
    // ****** SVG-based Implementation
    // **********************************************************************
    function makeScaleAttribute(x, y, scalex, scaley) {
        var result = 'translate(' + x + ' ' + y + ')';
        result += ' scale(' + scalex + ' ' + scaley + ')';
        result += ' translate(-' + x + ' -' + y + ')';
        return result;
    }

    function drawGlyphSVG(svg, glyph, style, x, y, scalex, scaley) {
        var text = document.createElementNS(SVG_NS, "svg:text"), bbox;
        text.setAttributeNS(null, "x", x);
        text.setAttributeNS(null, "y", y);
        text.setAttributeNS(null, "fill", GLYPH_COLORS[glyph]);
        text.setAttributeNS(null, "style", style);
        text.setAttributeNS(null, "transform", makeScaleAttribute(x, y, scalex, scaley));
        text.appendChild(document.createTextNode(glyph));
        svg.appendChild(text);
        // use bounding client rect so we get the real dimensions including the
        // transform
        bbox = text.getBoundingClientRect();
        return { width: bbox.width, height: bbox.height, elem: text };
    }

    function drawGlyphsSVG(svg, options, pssm) {
        // measure font height by drawing one element and removing it immediately
        var maxGlyphHeight, glyphHeight, measure, scaley;

        measure = drawGlyphSVG(svg, 'A', options.glyphStyle, 50, 50, 1.0, 1.0);
        svg.removeChild(measure.elem);
        maxGlyphHeight = (options.height - MARGIN_BOTTOM) - MARGIN_TOP;
        glyphHeight = measure.height;
        scaley = maxGlyphHeight / glyphHeight;
        drawPSSM(pssm, options.height - MARGIN_BOTTOM, scaley,
                 function (currentGlyph, x, y, scalex, scaley) {
                return drawGlyphSVG(svg, currentGlyph, options.glyphStyle, x, y, scalex, scaley);
            });
    }


    function makeSVG(id, options, pssm) {
        var svg = document.createElementNS(SVG_NS, 'svg:svg'), elem, scaley;
        svg.id = id;
        svg.setAttribute("height", options.height);
        svg.setAttribute("width", options.width);
        elem = document.getElementById(id);
        elem.parentNode.replaceChild(svg, elem);
        scaley = 10.0;
        drawGlyphsSVG(svg, options, pssm);
    }

    // **********************************************************************
    // ****** Public API
    // **********************************************************************

    isblogo.makeLogo = function (id, pssm, options) {
        if (options === null) {
            options = DEFAULT_OPTIONS;
        }
        // TODO: copy the options from DEFAULT_OPTIONS that are missing

        if (options.type === 'canvas') {
            makeCanvas(id, options, pssm);
        } else if (options.type === 'svg') {
            makeSVG(id, options, pssm);
        }
    };
}());