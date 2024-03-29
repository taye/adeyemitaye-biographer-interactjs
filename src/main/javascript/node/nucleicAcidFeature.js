(function(bui) {
    var identifier = 'bui.NucleicAcidFeature';
    /**
     * @class
     * A node with the shape of an rectangle and a label inside.
     * This shape has be default rounded corners.
     *
     * @extends bui.RectangularNode
     * @constructor
     */
    bui.NucleicAcidFeature = function() {
        bui.NucleicAcidFeature.superClazz.apply(this, arguments);
        this.bottomRadius(bui.settings.style.nodeCornerRadius);
    };
    bui.NucleicAcidFeature.prototype = {
        identifier : function() {
            return identifier;
        },
        _minWidth : 60,
        _minHeight : 60
    };

    bui.util.setSuperClass(bui.NucleicAcidFeature, bui.RectangularNode);
})(bui);
