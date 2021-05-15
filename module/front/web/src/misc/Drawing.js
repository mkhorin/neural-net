/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.Drawing = class Drawing extends Front.Element {

    init () {
        this.lastLength = 0;
        this.strokes = [];
        this.activeStrokes = [];
        this.drawHandler = this.draw.bind(this);
        this.started = false;

        this.canvas = this.find('.drawing-canvas').get(0);
        this.context = this.canvas.getContext('2d');
        this.context.fillStyle = '#fff';
        this.context.strokeStyle = '#000';
        this.context.lineCap = this.context.lineJoin = 'round';

        this.target = this.find('.drawing-target').get(0);
        this.targetContext = this.target.getContext('2d');
        this.targetContext.imageSmoothingEnabled = true;
        this.targetContext.fillStyle = this.context.fillStyle;
        this.erase();

        this.canvas.addEventListener('touchstart', this.onStartDraw.bind(this), {passive: true});
        this.canvas.addEventListener('touchmove', this.onDrawTouch.bind(this), {passive: false});
        document.addEventListener('touchend', this.onEndDraw.bind(this));
        this.canvas.addEventListener('mousedown', this.onStartDraw.bind(this));
        this.canvas.addEventListener('mousemove', this.onDraw.bind(this));
        document.addEventListener('mouseup', this.onEndDraw.bind(this));
    }

    erase () {
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.trigger('change');
    }

    setBrush (size) {
        this.context.lineWidth = size;
    }

    onStartDraw (event) {
        this.started = true;
        this.canvastClientRect = this.canvas.getBoundingClientRect();
        this.canvastWidthRatio = this.canvas.offsetWidth / this.canvas.width;
        this.canvastHeightRatio = this.canvas.offsetHeight / this.canvas.height;
        this.activeStrokes = [];
        this.strokes.push(this.activeStrokes);
        this.lastLength = 1;
        this.toggleClass('active', true);
    }

    onDraw (event) {
        this.redraw(event.offsetX, event.offsetY);
    }

    onDrawTouch (event) {
        event.preventDefault();
        const touch = event.changedTouches[0];
        const x = touch.clientX - this.canvastClientRect.left;
        const y = touch.clientY - this.canvastClientRect.top;
        this.redraw(x, y);
    }

    onEndDraw (event) {
        this.started = false;
        this.toggleClass('active', false);
        if (this.activeStrokes.length) {
            this.trigger('change');
            this.activeStrokes = [];
        }
    }

    redraw (x, y) {
        if (this.started) {
            this.activeStrokes.push([x / this.canvastWidthRatio, y / this.canvastHeightRatio]);
            requestAnimationFrame(this.drawHandler);
        }
    }

    draw () {
        if (this.activeStrokes.length <= this.lastLength) {
            return;
        }
        const startIndex = this.lastLength - 1;
        this.lastLength = this.activeStrokes.length;
        this.context.beginPath();
        this.context.moveTo(...this.activeStrokes[startIndex]);
        for (let i = startIndex; i < this.lastLength; ++i) {
            this.context.lineTo(...this.activeStrokes[i]);
        }
        this.context.stroke();
    }

    exportData () {
        const rect = this.getCroppingRect(this.context, this.canvas.width, this.canvas.height);
        if (rect) {
            const sourceRect = this.convertToSquare(rect);
            const context = this.targetContext;
            context.fillRect(0, 0, this.target.width, this.target.height);
            context.drawImage(this.canvas, ...sourceRect, 2, 2, this.target.width - 4, this.target.height - 4);
            const data = context.getImageData(0, 0, this.target.width, this.target.height);
            this.invert(data);
            context.putImageData(data, 0, 0);
            return this.getGrayscale(data);
        }
    }

    getCroppingRect (context, width, height) {
        let data = context.getImageData(0, 0, width, height).data;
        let x1 = width, y1 = height;
        let x2 = 0, y2 = 0, i = 0;
        for (let y = 0; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                if (data[i] !== 255 || data[i] !== data[i + 1] || data[i] !== data[i + 2]) {
                    if (x < x1) {
                        x1 = x;
                    } else if (x > x2) {
                        x2 = x;
                    }
                    if (y < y1) {
                        y1 = y;
                    }
                    y2 = y;
                }
                i += 4; // RGBA pixel
            }
        }
        return x1 !== width
            ? [x1, y1, x2 - x1 + 1, y2 - y1 + 1]
            : null;
    }

    convertToSquare ([x, y, w, h]) {
        let d = (w - h) / 2;
        if (d > 0) {
            y -= d;
            h = w;
        }
        if (d < 0) {
            x += d;
            w = h;
        }
        return [x, y, w, h];
    }

    invert (imageData) {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i]; // red
            data[i + 1] = 255 - data[i + 1]; // green
            data[i + 2] = 255 - data[i + 2]; // blue
        }
    }

    getGrayscale (imageData) {
        const result = [];
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            result.push(Math.round(data[i] * .299 + data[i + 1] * .587 + data[i + 2] * .114));
        }
        return result;
    }
};