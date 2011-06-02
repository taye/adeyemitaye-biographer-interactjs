(function(bui) {
    /**
     * @class
     * A node with the shape of an rectangle and a label inside.
     * This shape has be default rounded corners.
     *
     * @extends bui.RectangularNode
     * @constructor
     */
    bui.NucleicAcidFeature = function() {
        bui.RectangularNode.apply(this, arguments);
        this.bottomRadius(bui.settings.style.nodeCornerRadius);
    };

    bui.NucleicAcidFeature.prototype = bui.RectangularNode.prototype;
})(bui);