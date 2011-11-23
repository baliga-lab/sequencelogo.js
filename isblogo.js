var isblogo;
if (!isblogo) {
    isblogo = {};
}
(function () {
    "use strict";
    // some default settings
    var MARGIN_LEFT = 20, MARGIN_TOP = 20, MARGIN_RIGHT = 20,
        MARGIN_BOTTOM = 30, styles;
    styles = {
        'A': 'rgb(0, 200, 50)',
        'G': 'rgb(230, 200, 0)',
        'T': 'rgb(255, 0, 0)',
        'C': 'rgb(0, 0, 230)'
    };

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

    function rank(arr) {
        var result = [], i;
        for (i = 0; i < arr.length; i += 1) {
            result.push([i, arr[i]]);
        }
        return result.sort(function (a, b) {
            return a[1] - b[1];
        });
    }

    function drawGlyph(context, glyph, x, y, scalex, scaley) {
        var glyphWidth, glyphHeight;
        glyphWidth = context.measureText(glyph).width * scalex;
        glyphHeight = currentFontHeight(context) * scaley;

        context.save();
        context.translate(x, y);
        context.scale(scalex, scaley);
        context.translate(-x, -y);
        context.fillStyle = styles[glyph];
        context.fillText(glyph, x, y);
        context.restore();
        return [glyphWidth, glyphHeight];
    }

    function drawGlyphs(canvas, pssm) {
        var context, x, y, size, motifPos, maxGlyphHeight, glyphHeight,
            scaley, columnRanks, currentGlyph, row, maxWidth;
        context = canvas.getContext('2d');
        context.font = '20pt Helvetica';
        x = MARGIN_LEFT;
        glyphHeight = currentFontHeight(context);
        maxGlyphHeight = (canvas.height - MARGIN_BOTTOM) - MARGIN_TOP;
        scaley = maxGlyphHeight / glyphHeight;

        for (motifPos = 0; motifPos < pssm.values.length; motifPos += 1) {
            y = canvas.height - MARGIN_BOTTOM;
            columnRanks = rank(pssm.values[motifPos]);
            maxWidth = 0;
            for (row = 0; row < columnRanks.length; row += 1) {
                currentGlyph = pssm.alphabet[columnRanks[row][0]];
                size = drawGlyph(context, currentGlyph,
                                 x, y, 1.0,
                                 columnRanks[row][1] * scaley);
                if (size[0] > maxWidth) {
                    maxWidth = size[0];
                }
                y -= size[1];
            }
            x += maxWidth;
        }
    }

    isblogo.makeLogo = function (canvas, pssm) {
        drawScale(canvas);
        drawGlyphs(canvas, pssm);
    };
}());