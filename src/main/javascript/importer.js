(function(bui) {

    /**
     * Default generator for node types. This will be used when
     * nodeJSON.generator is undefined.
     *
     * @param {bui.Graph} graph The graph to which the node shall be added
     * @param {Object} nodeType Node type retrieved from the node mapping.
     * @param {Object} nodeJSON Node information
     * @return {bui.Node} The generated node
     */
    var defaultNodeGenerator = function(graph, nodeType, nodeJSON) {
        var node = graph.add(nodeType.klass);

        if (bui.util.propertySetAndNotNull(nodeJSON, ['data', 'label'])) {
            if (node.label !== undefined) {
                node.label(nodeJSON.data.label);
            }
        }

        if (bui.util.propertySetAndNotNull(nodeJSON,
                ['data', 'x'], ['data', 'y'])) {
            nodeJSON.data.x = bui.util.toNumber(nodeJSON.data.x);
            nodeJSON.data.y = bui.util.toNumber(nodeJSON.data.y);

            node.position(nodeJSON.data.x, nodeJSON.data.y);
        }

        var standardNodeSize = bui.settings.style.importer.standardNodeSize;
        var size = {
            width : standardNodeSize.width,
            height : standardNodeSize.height
        };

        if (node.sizeBasedOnLabel !== undefined) {
            size = node.sizeBasedOnLabel();

            // some padding because of various shapes
            var padding = bui.settings.style.importer.sizeBasedOnLabelPassing;
            size.width += padding.horizontal;
            size.height += padding.vertical;
        }

        node.size(size.width, size.height)
                .visible(true);

        if (bui.util.propertySetAndNotNull(nodeJSON,
                ['data', 'modification'])) {
            var modifications = nodeJSON.data.modification;

            for (var i = 0; i < modifications.length; i++) {
                var modification = modifications[i];

                var label, mapping = retrieveFrom(modificationMapping,
                        modification[0]);

                label = mapping.short;

                if (bui.settings.style.importer.modificationLabel === 'long') {
                    label += '@' + modification[1];
                }

                graph.add(bui.StateVariable)
                        .label(label)
                        .parent(node)
                        .visible(true);
            }
        }

        return node;
    };

    /**
     * Import nodes.
     *
     * @param {bui.Graph} graph The target graph to which the nodes and edges
     *   should be added.
     * @param {Object} data JSON data which should be imported
     * @return {Object} All the generated nodes. Keys of this object are the
     *   node's ids or, if applicable, the node's ref key (node.data.ref).
     */
    var addAllNodes = function(graph, data) {
        var nodes = data.nodes,
                generatedNodes = {},
                node,
                nodeJSON;

        var addNode = function(nodeJSON, id) {
            var nodeType = retrieveFrom(nodeMapping, nodeJSON.sbo);
            var node;

            if (nodeType === undefined) {
                return undefined;
            }

            if (bui.util.propertySetAndNotNull(nodeType, 'generator')) {
                node = nodeType.generator(graph, nodeJSON);
            } else {
                node = defaultNodeGenerator(graph, nodeType, nodeJSON);
            }

            if (node !== undefined) {
                node.json(nodeJSON);
                generatedNodes[id] = node;
            }

            return node;
        };

        // add all nodes
        for (var i = 0; i < nodes.length; i++) {
            // TODO: remove try-catch block or use different error handling
            try {
                nodeJSON = nodes[i];

                addNode(nodeJSON, nodeJSON.id);
            } catch (e) {
                log(e);
            }
        }

        // add relationship information
        for (var key in generatedNodes) {
            if (generatedNodes.hasOwnProperty(key)) {
                node = generatedNodes[key];
                nodeJSON = node.json();

                if (nodeJSON.data !== undefined &&
                        nodeJSON.data.subnodes !== undefined) {
                    for (var j = 0; j < nodeJSON.data.subnodes.length; j++) {
                        var subNodeId = nodeJSON.data.subnodes[j];
                        var subNode = generatedNodes[subNodeId];

                        if (subNode !== undefined) {
                            subNode.parent(node);
                        } else {
                            log('Broken sub node reference to sub' +
                                    ' node id: ' + subNodeId);
                        }
                    }
                }
            }
        }

        return generatedNodes;
    };

    /**
     * Layout the complex nodes using a table layout.
     *
     * @param {Object} nodes A map which keys map onto {@link bui.Node}
     *   instances.
     */
    var doComplexLayout = function(nodes) {
        for (var key in nodes) {
            if (nodes.hasOwnProperty(key)) {
                var node = nodes[key];

                if (node instanceof bui.Complex &&
                        node.parent() instanceof bui.Complex === false) {
                    node.tableLayout();
                }
            }
        }
    };

    /**
     * Position the auxiliary units for each node.
     *
     * @param {Object} All the generated nodes. Keys of this object are the
     *   node's ids or, if applicable, the node's ref key (node.data.ref).
     */
    var positionAuxiliaryUnits = function(nodes) {
        for (var key in nodes) {
            if (nodes.hasOwnProperty(key)) {
                nodes[key].positionAuxiliaryUnits();
            }
        }
    };

    /**
     * Add edges to the graph. Information about the edges will be extracted
     * from the data parameter.
     *
     * @param {bui.Graph} graph The target graph to which the nodes and edges
     *   should be added.
     * @param {Object} data JSON data which should be imported
     * @return {Object} All the generated nodes. Keys of this object are the
     *   node's ids or, if applicable, the node's ref key (node.data.ref).
     */
    var addAllEdges = function(graph, data, generatedNodes) {
        var edges = data.edges;

        for (var i = 0; i < edges.length; i++) {
            var edgeJSON = edges[i];

            var source = generatedNodes[edgeJSON.source];
            var target = generatedNodes[edgeJSON.target];

            if (source === undefined) {
                log('Edge source ' + edgeJSON.source + ' could not be found.');
                continue;
            } else if (target === undefined) {
                log('Edge target ' + edgeJSON.target + ' could not be found.');
                continue;
            }

            // ensuring that data exists
            edgeJSON.data = edgeJSON.data || {};

            var edge = graph.add(bui.Edge)
                    .source(source)
                    .target(target);

            if (edgeJSON.sbo !== undefined) {
                try {
                    var marker = retrieveFrom(edgeMarkerMapping, edgeJSON.sbo);
                    edge.marker(marker.klass);
                } catch (e) {
                    log(e);
                }
            }

            var style = bui.AbstractLine.Style[edgeJSON.data.style];
            if (style !== undefined) {
                edge.lineStyle(style);
            }

            edge.visible(true);
        }
    };

    /**
     * Import nodes and edges from JSON using this function.
     *
     * @param {bui.Graph} graph The target graph to which the nodes and edges
     *   should be added.
     * @param {Object} data JSON data which should be imported
     */
    bui.importFromJSON = function(graph, data) {
        var generatedNodes = addAllNodes(graph, data);
        doComplexLayout(generatedNodes);
        positionAuxiliaryUnits(generatedNodes);
        addAllEdges(graph, data, generatedNodes);
        graph.reduceCanvasSize();
    };

    /**
     * Update node positions by reimporting data from JSON.
     *
     * @param {bui.Graph} graph The target graph to which the nodes and edges
     *   should be added.
     * @param {Object} data JSON data which should be imported
     * @param {Number} [duration] An optional duration in milliseconds.
     *   {@link bui.Node#move}
     */
    bui.importUpdatedNodePositionsFromJSON = function(graph, data, duration) {
        var drawables = graph.drawables();

        // optimize the data structure to map json IDs to node references
        // to achieve a computational complexity of O(2n).
        var nodes = {};
        for (var key in drawables) {
            if (drawables.hasOwnProperty(key)) {
                var drawable = drawables[key];

                // achieve bui.Node subclass has a bottomRight function.
                if (drawable.bottomRight !== undefined) {
                    var jsonId = drawable.json().id;
                    nodes[jsonId] = drawable;
                }
            }
        }

        var nodesJSON = data.nodes;
        for (var i = 0; i < nodesJSON.length; i++) {
            var nodeJSON = nodesJSON[i],
                    node = nodes[nodeJSON.id];

            if (node === undefined) {
                log('Can\'t update nodes position for json node id ' +
                        nodeJSON.id + ' because the node can\'t be found.');
                continue;
            } else if (bui.util.propertySetAndNotNull(nodeJSON,
                    ['data', 'x'], ['data', 'y']) === false) {
                continue;
            } else if (node.hasParent() === true) {
                continue;
            }

            var x = nodeJSON.data.x,
                    y = nodeJSON.data.y,
                    currentPosition = node.position();

            node.move(x - currentPosition.x, y - currentPosition.y, duration);
        }
    };
})(bui);