var app = app || {};
var qad = window.qad || {};

joint.dia.Element.define('qad.Question', {
    optionHeight: 30,
    questionHeight: 130,
    paddingBottom: 30,
    width: 235,
    ports: {
        groups: {
            'in': {
                position: {
                    name: 'left',
                    args: { y: '29'}
                },
                attrs: {
                    rect: {
                        magnet: 'passive',
                        width: 235,
                        height: 71,
                        fill: '#e4f3ff',
                    },
                    text: {
                        pointerEvents: 'none',
                        fontSize: 12,
                    }
                },
                label: {
                    position: {
                        name: 'center',
                    },
                    markup: '<text x="13" y="24" font-size="14" font-weight="600"> Operator phrase: </text> <text x="13" y="44" font-size="14">Hello, can I speak to Conner Walsh?</text>'
                },
                markup: '<rect/>'
            },
            out: {
                position: {
                    name: 'left',
                    args: { x: 220 }
                },
                attrs: {
                    circle: {
                        magnet: true,
                        stroke: '#b6b6b6',
                        fill: '#ffd6d6',
                        r: 10
                    },
                    rect: {
                        pointerEvents: 'none',
                        fill: 'transparent',
                        width: 2,
                        height: 20,
                        x: 13,
                        y: -10
                    },
                    image: {
                        pointerEvents: 'none',
                    }
                },
                label: {
                    position: {
                        args: { x: -6, y: -9 }
                    },
                    markup: '<image width="12" height="8" xlink:href="img/board/fork.svg"></image>'
                },
                markup: '<circle/><rect/>'
            }
        },
        items: [{
            group: 'in'
        }]
    },
    attrs: {
        '.': {
            magnet: false
        },
        '.body': {
            fill: '#e2f7dc',
            y: 29,
            refWidth: '100%',
            refHeight: '-29',
            stroke: 'none'
            // fill: {
            //     type: 'linearGradient',
            //     stops: [
            //         { offset: '0%', color: '#F2F2F2' },
            //         { offset: '100%', color: '#E2F7DC' }
            //     ],
            //     // Top-to-bottom gradient.
            //     attrs: { x1: '0%', y1: '0%', x2: '0%', y2: '100%' }
            // }
        },
        '#header rect': {
            fill: '#e2f7dc',
            refWidth: '100%',
            height: '29',
            stroke: 'none'
        },
        '#header #edit': {
            x: "13",
            y: "6.5",
            width: "16",
            height: "16",
            cursor: 'pointer'
        },
        '#header #play': {
            x: "111.5",
            y: "5.5",
            width: "16",
            height: "18",
            cursor: 'pointer'
        },
        '#header #remove': {
            event: 'element:delete',
            x: "220",
            y: "5.5",
            width: "12",
            height: "12",
            cursor: 'pointer'
        },
        '#header text': {
            x: "41",
            y: "20"
        },
        '.btn-add-option': {
            refX: 10,
            refDy: -22,
            cursor: 'pointer',
            fill: 'white'
        },
        '.btn-remove-option': {
            xAlignment: 10,
            yAlignment: 13,
            cursor: 'pointer',
            fill: 'white'
        },
        '.options': {
            refX: 0
        },

        // Text styling.
        text: {
            fontFamily: 'Arial'
        },
        '.option-text': {
            fontSize: 11,
            fill: '#4b4a67',
            refX: 30,
            yAlignment: 'middle'
        },
        '.option-rect': {
            stroke: '#b6b6b6',
            strokeWidth: 2,
            // strokeOpacity: .5,
            // fillOpacity: .5,
            x: 1,
            fill: 'none',
            width: '233'
        }
    }
}, {

    markup: [
        '<g id="header">',
            '<rect/>',
            '<image id="edit" xlink:href="img/board/pen.svg"/>',
            '<text font-size="15">node #1</text>',
            '<image id="play" xlink:href="img/board/Play.svg"/>',
            '<image id="remove" xlink:href="img/board/cross.svg"/>',
        '</g>',
        '<rect class="body"/>',
        '<text x="13" y="120" font-size="14" font-weight="600">Response:</text>',
        '<g class="options"></g>',
        '<path class="btn-add-option" d="M5,0 10,0 10,5 15,5 15,10 10,10 10,15 5,15 5,10 0,10 0,5 5,5z"/>'
    ].join(''),

    optionMarkup: [
        '<g class="option">',
            '<rect class="option-rect" />',
            '<path class="btn-remove-option" d="M0,0 15,0 15,5 0,5z"/>',
            '<text class="option-text"/>',
        '</g>'
    ].join(''),

    initialize: function() {

        joint.dia.Element.prototype.initialize.apply(this, arguments);
        this.on('change:options', this.onChangeOptions, this);
        this.on('change:question', function() {
            this.attr('.question-text/text', this.get('question') || '');
            // this.autoresize();
        }, this);

        this.on('change:questionHeight', function() {
            this.attr('.options/refY', this.get('questionHeight'), { silent: true });
            // this.autoresize();
        }, this);

        // this.on('change:optionHeight', this.autoresize, this);

        this.attr('.options/refY', this.get('questionHeight'), { silent: true });
        this.attr('.question-text/text', this.get('question'), { silent: true });

        this.onChangeOptions();
    },

    onChangeOptions: function() {

        var options = this.get('options');
        var optionHeight = this.get('optionHeight');

        // First clean up the previously set attrs for the old options object.
        // We mark every new attribute object with the `dynamic` flag set to `true`.
        // This is how we recognize previously set attributes.
        var attrs = this.get('attrs');
        _.each(attrs, function(attrs, selector) {

            if (attrs.dynamic) {
                // Remove silently because we're going to update `attrs`
                // later in this method anyway.
                this.removeAttr(selector, { silent: true });
            }
        }.bind(this));

        // Collect new attrs for the new options.
        var offsetY = 0;
        var attrsUpdate = {};
        var questionHeight = this.get('questionHeight');

        _.each(options, function(option) {

            var selector = '.option-' + option.id;

            attrsUpdate[selector] = { transform: 'translate(0, ' + offsetY + ')', dynamic: true };
            attrsUpdate[selector + ' .option-rect'] = { height: optionHeight, dynamic: true };
            attrsUpdate[selector + ' .option-text'] = { text: option.text, dynamic: true, refY: optionHeight / 2 };

            offsetY += optionHeight;

            var portY = offsetY - optionHeight / 2 + questionHeight;
            if (!this.getPort(option.id)) {
                this.addPort({ group: 'out', id: option.id, args: { y: portY }});
            } else {
                this.portProp(option.id, 'args/y', portY);
            }
        }.bind(this));

        this.attr(attrsUpdate);
        this.autoresize();
    },

    autoresize: function() {
        var options = this.get('options') || [];
        var gap = this.get('paddingBottom') || 20;
        var height = options.length * this.get('optionHeight') + this.get('questionHeight') + gap;
        // var width = joint.util.measureText(this.get('question'), {
        //     fontSize: this.attr('.question-text/fontSize')
        // }).width;
        this.resize(235, height);
    },

    addOption: function(option) {
        console.log("addOption");
        var options = JSON.parse(JSON.stringify(this.get('options')));
        options.push(option);
        this.set('options', options);
    },

    removeOption: function(id) {
        console.log("removeOption");

        var options = JSON.parse(JSON.stringify(this.get('options')));
        this.removePort(id);
        this.set('options', _.without(options, _.find(options, { id: id })));
    },

    changeOption: function(id, option) {

        if (!option.id) {
            option.id = id;
        }

        var options = JSON.parse(JSON.stringify(this.get('options')));
        options[_.findIndex(options, { id: id })] = option;
        this.set('options', options);
    }
});

joint.shapes.qad.QuestionView = joint.dia.ElementView.extend({

    events: {
        'click .btn-add-option': 'onAddOption',
        'click .btn-remove-option': 'onRemoveOption'
    },

    presentationAttributes: joint.dia.ElementView.addPresentationAttributes({
        options: ['OPTIONS']
    }),

    confirmUpdate: function(flags) {
        joint.dia.ElementView.prototype.confirmUpdate.apply(this, arguments);
        if (this.hasFlag(flags, 'OPTIONS')) this.renderOptions();
    },

    renderMarkup: function() {

        joint.dia.ElementView.prototype.renderMarkup.apply(this, arguments);

        // A holder for all the options.
        this.$options = this.$('.options');
        // Create an SVG element representing one option. This element will
        // be cloned in order to create more options.
        this.elOption = V(this.model.optionMarkup);

        this.renderOptions();
    },

    renderOptions: function() {

        this.$options.empty();

        _.each(this.model.get('options'), function(option, index) {

            var className = 'option-' + option.id;
            var elOption = this.elOption.clone().addClass(className);
            elOption.attr('option-id', option.id);
            this.$options.append(elOption.node);

        }.bind(this));

        // Apply `attrs` to the newly created SVG elements.
        this.update();
    },

    onAddOption: function() {

        this.model.addOption({
            id: _.uniqueId('option-'),
            text: 'Option ' + this.model.get('options').length
        });
    },

    onRemoveOption: function(evt) {

        this.model.removeOption(V(evt.target.parentNode).attr('option-id'));
    }
});

app.Selection = Backbone.Collection.extend();

app.SelectionView = joint.mvc.View.extend({

    PADDING: 3,

    BOX_TEMPLATE: V('rect', {
        'fill': 'none',
        'stroke': '#C6C7E2',
        'stroke-width': 1,
        'pointer-events': 'none'
    }),

    init: function() {
        this.listenTo(this.model, 'add reset change', this.render);
    },

    render: function() {

        _.invokeMap(this.boxes, 'remove');

        this.boxes = this.model.map(function(element) {
            return this.BOX_TEMPLATE
                .clone()
                .attr(element.getBBox().inflate(this.PADDING))
                .appendTo(this.options.paper.cells);
        }.bind(this));

        return this;
    },

    onRemove: function() {
        _.invokeMap(this.boxes, 'remove');
        delete this.boxes;
    }
});


app.Factory = {

    createQuestion: function(text) {

        return new joint.shapes.qad.Question({
            position: { x: 400 - 50, y: 30 },
            size: { width: 100, height: 70 },
            question: text,
            inPorts: [{ id: 'in', label: 'In' }],
            options: [
                { id: 'yes', text: 'Yes' },
                { id: 'no', text: 'No' }
            ]
        });
    },

    createAnswer: function(text) {

        return new joint.shapes.qad.Answer({
            position: { x: 400 - 50, y: 30 },
            size: { width: 100, height: 70 },
            answer: text
        });
    },

    createLink: function() {

        return new joint.dia.Link({
            attrs: {
                '.marker-target': {
                    d: 'M 10 0 L 0 5 L 10 10 z',
                    fill: '#6a6c8a',
                    stroke: '#6a6c8a'
                },
                '.connection': {
                    stroke: '#6a6c8a',
                    strokeWidth: 2
                }
            }
        });
    },

    // Example:
    /*
      {
         root: '1',
         nodes: [
            { id: '1', type: 'qad.Question', question: 'Are you sure?', options: [{ id: 'yes', text: 'Yes' }, { id: 'no', text: 'No' }] },
            { id: '2', type: 'qad.Answer', answer: 'That was good.' },
            { id: '3', type: 'qad.Answer', answer: 'That was bad.' }
         ],
         links: [
            { type: 'qad.Link', source: { id: '1', port: 'yes' }, target: { id: '2' } },
            { type: 'qad.Link', source: { id: '1', port: 'no' }, target: { id: '3' } }
         ]
      }
    */
    createDialogJSON: function(graph, rootCell) {

        var dialog = {
            root: undefined,
            nodes: [],
            links: []
        };

        _.each(graph.getCells(), function(cell) {

            var o = {
                id: cell.id,
                type: cell.get('type')
            };

            switch (cell.get('type')) {
                case 'qad.Question':
                    o.question = cell.get('question');
                    o.options = cell.get('options');
                    dialog.nodes.push(o);
                    break;
                case 'qad.Answer':
                    o.answer = cell.get('answer');
                    dialog.nodes.push(o);
                    break;
                default: // qad.Link
                    o.source = cell.get('source');
                    o.target = cell.get('target');
                    dialog.links.push(o);
                    break;
            }

            if (!cell.isLink() && !graph.getConnectedLinks(cell, { inbound: true }).length) {
                dialog.root = cell.id;
            }
        });

        if (rootCell) {
            dialog.root = rootCell.id;
        }

        return dialog;
    }
};


qad.renderDialog = function(dialog, node) {

    this.dialog = dialog;

    if (!node) {

        for (var i = 0; i < dialog.nodes.length; i++) {

            if (dialog.nodes[i].id === dialog.root) {

                node = dialog.nodes[i];
                break;
            }
        }
    }

    if (!node) {

        throw new Error('It is not clear where to go next.');
    }

    if (!this.el) {
        this.el = this.createElement('div', 'qad-dialog');
    }

    // Empty previously rendered dialog.
    this.el.textContent = '';

    switch (node.type) {

        case 'qad.Question':
            this.renderQuestion(node);
            break;
        case 'qad.Answer':
            this.renderAnswer(node);
            break;
    }

    this.currentNode = node;

    return this.el;
};

qad.createElement = function(tagName, className) {

    var el = document.createElement(tagName);
    el.setAttribute('class', className);
    return el;
};

qad.renderOption = function(option) {

    var elOption = this.createElement('button', 'qad-option qad-button');
    elOption.textContent = option.text;
    elOption.setAttribute('data-option-id', option.id);

    var self = this;
    elOption.addEventListener('click', function(evt) {

        self.onOptionClick(evt);

    }, false);

    return elOption;
};

qad.renderQuestion = function(node) {

    var elContent = this.createElement('div', 'qad-content');
    var elOptions = this.createElement('div', 'qad-options');

    for (var i = 0; i < node.options.length; i++) {

        elOptions.appendChild(this.renderOption(node.options[i]));
    }

    var elQuestion = this.createElement('h3', 'qad-question-header');
    elQuestion.innerHTML = node.question;

    elContent.appendChild(elQuestion);
    elContent.appendChild(elOptions);

    this.el.appendChild(elContent);
};

qad.renderAnswer = function(node) {

    var elContent = this.createElement('div', 'qad-content');
    var elAnswer = this.createElement('h3', 'qad-answer-header');
    elAnswer.innerHTML = node.answer;

    elContent.appendChild(elAnswer);
    this.el.appendChild(elContent);
};

qad.onOptionClick = function(evt) {

    var elOption = evt.target;
    var optionId = elOption.getAttribute('data-option-id');

    var outboundLink;
    for (var i = 0; i < this.dialog.links.length; i++) {

        var link = this.dialog.links[i];
        if (link.source.id === this.currentNode.id && link.source.port === optionId) {

            outboundLink = link;
            break;
        }
    }

    if (outboundLink) {

        var nextNode;
        for (var j = 0; j < this.dialog.nodes.length; j++) {

            var node = this.dialog.nodes[j];
            if (node.id === outboundLink.target.id) {

                nextNode = node;
                break;
            }
        }

        if (nextNode) {

            this.renderDialog(this.dialog, nextNode);
        }
    }
};


app.AppView = joint.mvc.View.extend({

    el: '#app',

    events: {
        'click #toolbar .add-question': 'addQuestion',
        'click #toolbar .add-answer': 'addAnswer',
        'click #toolbar .preview-dialog': 'previewDialog',
        'click #toolbar .code-snippet': 'showCodeSnippet',
        'click #toolbar .load-example': 'loadExample',
        'click #toolbar .clear': 'clear'
    },

    init: function() {
        this.initializePaper();
    },

    initializePaper: function() {
        this.paper = new joint.dia.Paper({
            el: this.$('#paper'),
            width: '100%',
            height: '100%',
            gridSize: 10,
            snapLinks: {
                radius: 30
            },
            linkPinning: false,
            multiLinks: false,
            defaultLink: app.Factory.createLink(),
            defaultRouter: { name: 'manhattan', args: { padding: 40, maximumLoops: 2000}},
            defaultConnector: { name: 'rounded' },
            validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                // Prevent linking from input ports.
                if (magnetS && magnetS.getAttribute('port-group') === 'in') return false;
                // Prevent linking from output ports to input ports within one element.
                if (cellViewS === cellViewT) return false;
                // Prevent linking to input ports.
                return (magnetT && magnetT.getAttribute('port-group') === 'in') || (cellViewS.model.get('type') === 'qad.Question' && cellViewT.model.get('type') === 'qad.Answer');
            },
            validateMagnet: function(cellView, magnet) {
                // Note that this is the default behaviour. Just showing it here for reference.
                return magnet.getAttribute('magnet') !== 'passive';
            }
        });

        this.graph = this.paper.model;

        this.paper.on('element:delete', function(elementView, evt, x, y) {
            evt.stopPropagation();
            elementView.model.remove();
        });

        // var paperScroller = new joint.ui.PaperScroller({
        //     paper: this.paper,
        //     cursor: 'grab'
        // });

        // this.paper.on('blank:pointerdown', paperScroller.startPanning);

        // $('#paper-container').append(paperScroller.render().el);

    },


    addQuestion: function() {
        app.Factory.createQuestion('Question').addTo(this.graph);
    },

    addAnswer: function() {

        app.Factory.createAnswer('Answer').addTo(this.graph);
    },

    previewDialog: function() {
        var cell = this.selection.first();
        var dialogJSON = app.Factory.createDialogJSON(this.graph, cell);
        var $background = $('<div/>').addClass('background').on('click', function() {
            $('#preview').empty();
        });

        $('#preview')
            .empty()
            .append([
                $background,
                qad.renderDialog(dialogJSON)
            ])
            .show();
    },

    clear: function() {
        this.graph.clear();
    },

    showCodeSnippet: function() {
        var cell = this.selection.first();
        var dialogJSON = app.Factory.createDialogJSON(this.graph, cell);

        var id = _.uniqueId('qad-dialog-');

        var snippet = '';
        snippet += '<div id="' + id + '"></div>';
        snippet += '<link rel="stylesheet" type="text/css" href="http://qad.client.io/css/snippet.css"></script>';
        snippet += '<script type="text/javascript" src="http://qad.client.io/src/snippet.js"></script>';
        snippet += '<script type="text/javascript">';
        snippet += 'document.getElementById("' + id + '").appendChild(qad.renderDialog(' + JSON.stringify(dialogJSON) + '))';
        snippet += '</script>';

        var content = '<textarea>' + snippet + '</textarea>';

        var dialog = new joint.ui.Dialog({
            width: '50%',
            height: 200,
            draggable: true,
            title: 'Copy-paste this snippet to your HTML page.',
            content: content
        });

        dialog.open();
    }
});

window.appView = new app.AppView;

