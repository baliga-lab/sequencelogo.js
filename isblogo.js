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
        // height of a text, twice the width of e is used
        // as a quick and dirty approximation
        return context.measureText('e').width * 2.0;
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

    function maxIndex(arr) {
        var result = 0, maxValue = Number.MIN_VALUE, i;
        for (i = 0; i < arr.length; i += 1) {
            if (arr[i] > maxValue) {
                maxValue = arr[i];
                result = i;
            }
        }
        return result;
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
        var context, x, y, size, i, maxi;
        context = canvas.getContext('2d');
        x = MARGIN_LEFT;
        y = canvas.height - MARGIN_BOTTOM;

        context.font = '20pt Helvetica';
        for (i = 0; i < pssm.values.length; i += 1) {
            maxi = maxIndex(pssm.values[i]);
            size = drawGlyph(context, pssm.alphabet[maxi],
                             x, y, 1.0, pssm.values[i][maxi] * 10.0);
            x += size[0];
        }
    }

    isblogo.makeLogo = function (canvas, pssm) {
        drawScale(canvas);
        drawGlyphs(canvas, pssm);
    };
}());