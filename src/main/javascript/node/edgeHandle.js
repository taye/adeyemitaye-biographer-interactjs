(function(bui) {
    var identifier = 'bui.EdgeHandle';

    /**
     * @private
     * Function used for the generation of listener identifiers
     * @param {bui.EdgeHandle} EdgeHandle
     * @return {String} listener identifier
     */
    var listenerIdentifier = function(EdgeHandle) {
        return identifier + EdgeHandle.id();
    };

    /**
     * @private size listener
     */
    var sizeChanged = function(node, width) {
        var r = width / 2;
        var privates = this._privates(identifier);
        privates.circle.setAttributeNS(null, 'cx', r);
        privates.circle.setAttributeNS(null, 'cy', r);
        privates.circle.setAttributeNS(null, 'r', r);
    };

    /**
     * @private
     */
    var initialPaint = function() {
        var privates = this._privates(identifier);

        privates.circle = document.createElementNS(bui.svgns, 'circle');
        sizeChanged.call(this, this, this.size().width);
      this.nodeGroup().appendChild(privates.circle);

        // set as interactable
        interact.set(privates.circle,
            {drag: this._enableDragging, resize: this._enableResizing});

        // create eventListener delegate functions
        interactDragMove = (function (event) {
            var position = this.position();
            this.position(position.x + event.detail.dx, position.y + event.detail.dy);
        }).createDelegate(this);
        
        interactResizeMove = (function (event) {
            var size = this.size();
            this.size(size.width + event.detail.dx, size.height + event.detail.dy);
        }).createDelegate(this);

        // add event listeners
        privates.circle.addEventListener('interactresizemove', interactResizeMove);
        privates.circle.addEventListener('interactdragmove', interactDragMove);
    };
    
    /**
     * @class
     * Drag handle node type which is useful for manipulation of edge shapes
     *
     * @extends bui.Node
     * @constructor
     */
    bui.EdgeHandle = function() {
        bui.EdgeHandle.superClazz.apply(this, arguments);

        this.bind(bui.Node.ListenerType.size,
                sizeChanged.createDelegate(this),
                listenerIdentifier(this));

        initialPaint.call(this);

        var widthHeight = bui.settings.style.edgeHandleRadius * 2;
        this.size(widthHeight, widthHeight);
    };

    bui.EdgeHandle.prototype = {
        identifier : function() {
            return identifier;
        },
        includeInJSON : false,
        _circle : null,
        _forceRectangular : true,
        _enableResizing : false,
        _calculationHook : circularShapeLineEndCalculationHookWithoutPadding
    };

    bui.util.setSuperClass(bui.EdgeHandle, bui.Node);
})(bui);
