(function(bui) {
    var identifier = 'bui.StateVariable';

    /**
     * @private
     * Function used for the generation of listener identifiers
     * @param {bui.StateVariable} StateVariable
     * @return {String} listener identifier
     */
    var listenerIdentifier = function(StateVariable) {
        return identifier + StateVariable.id();
    };

    /**
     * @private size changed listener
     */
    var sizeChanged = function(node, width, height) {
        var x = width / 2, y = height / 2;
        var privates = this._privates(identifier);

        privates.ellipse.setAttributeNS(null, 'cx', x);
        privates.ellipse.setAttributeNS(null, 'cy', y);

        privates.ellipse.setAttributeNS(null, 'rx', x);
        privates.ellipse.setAttributeNS(null, 'ry', y);
    };

    /**
     * @private used from the constructor to improve readability
     */
    var initialPaint = function() {
        var privates = this._privates(identifier);
        privates.ellipse = document.createElementNS(bui.svgns, 'ellipse');
        var size = this.size();
        sizeChanged.call(this, this, size.width, size.height);
        this.nodeGroup().appendChild(privates.ellipse);
    };



    /**
     * @class
     * State variable class which can be used in combination with other nodes
     *
     * @extends bui.Labelable
     * @constructor
     */
    bui.StateVariable = function() {
        bui.StateVariable.superClazz.apply(this, arguments);
        this.bind(bui.Node.ListenerType.size,
                sizeChanged.createDelegate(this),
                listenerIdentifier(this));

        initialPaint.call(this);

        this.labelClass(bui.settings.css.classes.smallText,
                [bui.settings.css.classes.textDimensionCalculation.small]);
        this.adaptSizeToLabel(true);
    };

    bui.StateVariable.prototype = {
        identifier : function() {
            return identifier;
        },
        _minWidth : 20,
        _minHeight : 20,
        auxiliaryUnit : true,
        includeInJSON : false,
        _enableResizing : true,

        // override
        toJSON : function() {
            return this.label();

            /*
            // is actually an override but won't call the superclass because
            // units of information aren't considered as nodes in the JSON
            // data format. We are also assuming that only the state variable's
            // label can be edited and that therefore the JSON data needs to
            // be extracted from the label.
            
            var json = [null, ''];

            var labelParts = this.label().split('@');

            json[0] = getModificationSBOForLabel(labelParts[0]);

            if (labelParts.length > 1) {
                json[1] = labelParts[1];
            }

            return json;
            */
        }
    };
    bui.util.setSuperClass(bui.StateVariable, bui.Labelable);
})(bui);

(function(bui) {
    var identifier = 'bui.StateVariableER';

    /**
     * @private
     * Function used for the generation of listener identifiers
     * @param {bui.StateVariable} StateVariable
     * @return {String} listener identifier
     */
    var listenerIdentifier = function(StateVariableER) {
        return identifier + StateVariableER.id();
    };


    /**
     * @class
     * State variable class which can be used in combination with other nodes
     *
     * @extends bui.Labelable
     * @constructor
     */
    bui.StateVariableER = function() {
        bui.StateVariableER.superClazz.apply(this, arguments);
        this.labelClass(bui.settings.css.classes.smallText,
                [bui.settings.css.classes.textDimensionCalculation.small]);
        this.addClass(bui.settings.css.classes.statevariable);
    };

    bui.StateVariableER.prototype = {
        identifier : function() {
            return identifier;
        },
        _minWidth : 10,
        _minHeight : 14,
        auxiliaryUnit : true,
        includeInJSON : false,
        _enableResizing : true,

        // override
        toJSON : function() {
            if (this.hasClass('existence')) 
                return 'existence'
            else if (this.hasClass('location'))
                return 'location'
            else 
                return this.label();
        }
    };
    bui.util.setSuperClass(bui.StateVariableER, bui.VariableValue);
})(bui);
